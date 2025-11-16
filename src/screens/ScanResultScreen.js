import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import GradientBackground from '../components/GradientBackground';
import { useThemeMode } from '../context/ThemeContext';
import { getThemeColors } from '../theme/colors';
import FuturisticButton from '../components/FuturisticButton';
import LoadingOverlay from '../components/LoadingOverlay';
import { usePlants } from '../context/PlantContext';
import { getCareAdvice } from '../services/openaiService';
import { getWateringFrequency } from '../utils/wateringSchedule';

const ScanResultScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { imageUri, plantData } = route.params || {};
  const { addPlant } = usePlants();
  const [careAdvice, setCareAdvice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { mode } = useThemeMode();
  const theme = getThemeColors(mode);

  useEffect(() => {
    loadCareAdvice();
  }, []);

  const loadCareAdvice = async () => {
    if (!plantData) return;
    setLoading(true);
    try {
      const advice = await getCareAdvice(
        plantData.name,
        plantData.perenualData || plantData.kindwiseData,
        null // No weather data needed
      );
      setCareAdvice(advice);
    } catch (error) {
      console.error('Error loading care advice:', error);
      Alert.alert('Error', 'Failed to load care advice');
    } finally {
      setLoading(false);
    }
  };


  const handleSavePlant = async () => {
    if (!plantData || !imageUri) return;

    setSaving(true);
    try {
      const species = plantData.kindwiseData?.plant_details?.common_names?.[0] || plantData.name;
      const wateringFrequency = getWateringFrequency(plantData.name, species);
      
      await addPlant({
        name: plantData.name,
        species: species,
        imageUri: imageUri,
        confidence: plantData.confidence,
        plantData: plantData,
        careAdvice: careAdvice,
        lastWatered: null,
        wateringFrequency: wateringFrequency,
      });
      Alert.alert('Success', 'Plant saved to your collection!', [
        {
          text: 'OK',
          onPress: () => {
            // Get the root navigator (Tab navigator)
            const rootNavigation = navigation.getParent()?.getParent();
            
            if (rootNavigation) {
              // Reset the Home stack first to remove Camera and ScanResult
              const homeStackNavigation = navigation.getParent();
              if (homeStackNavigation) {
                homeStackNavigation.reset({
                  index: 0,
                  routes: [{ name: 'HomeMain' }],
                });
              }
              
              // Then navigate to MyPlants tab
              rootNavigation.navigate('MyPlants');
            } else {
              // Fallback: reset Home stack and navigate to MyPlants
              const homeStackNavigation = navigation.getParent();
              if (homeStackNavigation) {
                homeStackNavigation.reset({
                  index: 0,
                  routes: [{ name: 'HomeMain' }],
                });
              }
              navigation.navigate('MyPlants');
            }
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save plant');
    } finally {
      setSaving(false);
    }
  };

  if (!plantData) {
    return (
      <GradientBackground>
        <SafeAreaView style={styles.container}>
          <View style={styles.centerContent}>
            <Text style={[styles.text, { color: theme.text }]}>No plant data available</Text>
            <FuturisticButton
              title="Go Back"
              onPress={() => navigation.goBack()}
              style={{ marginTop: 20 }}
            />
          </View>
        </SafeAreaView>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container} edges={['top']}>
        {loading && <LoadingOverlay message="Getting care advice..." />}
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Plant Identified</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Plant Image */}
          {imageUri && (
            <View style={styles.imageContainer}>
              <Image source={{ uri: imageUri }} style={styles.plantImage} />
              <BlurView
                intensity={40}
                tint={theme.blurTint}
                style={[
                  styles.confidenceBadge,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.borderStrong,
                  },
                ]}
              >
                <Ionicons name="checkmark-circle" size={16} color={theme.iconAccent} />
                <Text style={[styles.confidenceText, { color: theme.text }]}>
                  {Math.round(plantData.confidence * 100)}% match
                </Text>
              </BlurView>
            </View>
          )}

          {/* Plant Info Card */}
          <View style={styles.infoCard}>
            <BlurView intensity={45} tint={theme.blurTint} style={styles.infoBlur}>
              <LinearGradient
                colors={
                  mode === 'light'
                    ? ['rgba(255,255,255,0.95)', 'rgba(248,250,252,0.9)']
                    : ['rgba(15,23,42,0.95)', 'rgba(30,64,175,0.75)']
                }
                style={[styles.infoGradient, { borderColor: theme.border }]}
              >
                <Text style={[styles.plantName, { color: theme.text }]}>{plantData.name}</Text>
                {plantData.wikiDescription && (
                  <Text style={[styles.description, { color: theme.textMuted }]} numberOfLines={4}>
                    {plantData.wikiDescription}
                  </Text>
                )}
                {plantData.kindwiseData?.plant_details?.common_names && (
                  <View style={styles.tagsContainer}>
                    {plantData.kindwiseData.plant_details.common_names
                      .slice(0, 3)
                      .map((name, index) => (
                        <View
                          key={index}
                          style={[
                            styles.tag,
                            {
                              backgroundColor:
                                mode === 'light'
                                  ? 'rgba(124,58,237,0.15)'
                                  : 'rgba(129,140,248,0.25)',
                              borderColor:
                                mode === 'light'
                                  ? 'rgba(124,58,237,0.4)'
                                  : 'rgba(129,140,248,0.7)',
                            },
                          ]}
                        >
                          <Text style={[styles.tagText, { color: theme.iconAccent }]}>{name}</Text>
                        </View>
                      ))}
                  </View>
                )}
              </LinearGradient>
            </BlurView>
          </View>


          {/* Care Advice */}
          {careAdvice && (
            <View style={styles.careCard}>
              <BlurView intensity={45} tint={theme.blurTint} style={styles.careBlur}>
                <LinearGradient
                  colors={
                    mode === 'light'
                      ? ['rgba(255,255,255,0.95)', 'rgba(248,250,252,0.9)']
                      : ['rgba(15,23,42,0.95)', 'rgba(76,29,149,0.85)']
                  }
                  style={[styles.careGradient, { borderColor: theme.border }]}
                >
                  <View style={styles.careHeader}>
                    <Ionicons name="sparkles" size={24} color={theme.iconAccent} />
                    <Text style={[styles.careTitle, { color: theme.text }]}>AI Care Guide</Text>
                  </View>
                  <Text style={[styles.careText, { color: theme.textSecondary }]}>
                    {careAdvice}
                  </Text>
                </LinearGradient>
              </BlurView>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            <FuturisticButton
              title="Go Back"
              icon="arrow-back"
              variant="outline"
              onPress={() => navigation.goBack()}
              style={styles.actionButton}
            />
            <FuturisticButton
              title="Try Again"
              icon="camera"
              variant="outline"
              onPress={() => {
                // Go back to Camera screen to retake picture
                // This will pop ScanResult and return to Camera
                navigation.goBack();
              }}
              style={styles.actionButton}
            />
          </View>

          {/* Save Button */}
          <FuturisticButton
            title="Save to My Plants"
            icon="bookmark"
            onPress={handleSavePlant}
            loading={saving}
            style={styles.saveButton}
          />
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 18,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  placeholder: {
    width: 40,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  imageContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  plantImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#1a1f3a',
  },
  confidenceBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 4,
  },
  infoCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  infoBlur: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  infoGradient: {
    padding: 20,
    borderWidth: 1,
  },
  plantName: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  careCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  careBlur: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  careGradient: {
    padding: 20,
    borderWidth: 1,
  },
  careHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  careTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 12,
  },
  careText: {
    fontSize: 14,
    lineHeight: 22,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 12,
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  saveButton: {
    marginHorizontal: 20,
    marginTop: 10,
  },
});

export default ScanResultScreen;

