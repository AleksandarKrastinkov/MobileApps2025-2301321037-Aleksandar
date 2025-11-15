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
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import GradientBackground from '../components/GradientBackground';
import FuturisticButton from '../components/FuturisticButton';
import LoadingOverlay from '../components/LoadingOverlay';
import { usePlants } from '../context/PlantContext';
import { getCareAdvice } from '../services/openaiService';
import { getCurrentWeather } from '../services/weatherService';

const ScanResultScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { imageUri, plantData } = route.params || {};
  const { addPlant } = usePlants();
  const [careAdvice, setCareAdvice] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCareAdvice();
    loadWeather();
  }, []);

  const loadCareAdvice = async () => {
    if (!plantData) return;
    setLoading(true);
    try {
      const weatherData = await getCurrentWeather();
      setWeather(weatherData);
      const advice = await getCareAdvice(
        plantData.name,
        plantData.perenualData || plantData.kindwiseData,
        weatherData
      );
      setCareAdvice(advice);
    } catch (error) {
      console.error('Error loading care advice:', error);
      Alert.alert('Error', 'Failed to load care advice');
    } finally {
      setLoading(false);
    }
  };

  const loadWeather = async () => {
    try {
      const weatherData = await getCurrentWeather();
      setWeather(weatherData);
    } catch (error) {
      console.error('Error loading weather:', error);
    }
  };

  const handleSavePlant = async () => {
    if (!plantData || !imageUri) return;

    setSaving(true);
    try {
      await addPlant({
        name: plantData.name,
        species: plantData.kindwiseData?.plant_details?.common_names?.[0] || plantData.name,
        imageUri: imageUri,
        confidence: plantData.confidence,
        plantData: plantData,
        careAdvice: careAdvice,
        lastWatered: null,
      });
      Alert.alert('Success', 'Plant saved to your collection!', [
        { text: 'OK', onPress: () => navigation.navigate('MyPlants') },
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
            <Text style={styles.text}>No plant data available</Text>
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
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Plant Identified</Text>
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
              <View style={styles.confidenceBadge}>
                <Ionicons name="checkmark-circle" size={16} color="#00ff88" />
                <Text style={styles.confidenceText}>
                  {Math.round(plantData.confidence * 100)}% match
                </Text>
              </View>
            </View>
          )}

          {/* Plant Info Card */}
          <View style={styles.infoCard}>
            <LinearGradient
              colors={['#1a1f3a', '#0f1425']}
              style={styles.infoGradient}
            >
              <Text style={styles.plantName}>{plantData.name}</Text>
              {plantData.wikiDescription && (
                <Text style={styles.description} numberOfLines={4}>
                  {plantData.wikiDescription}
                </Text>
              )}
              {plantData.kindwiseData?.plant_details?.common_names && (
                <View style={styles.tagsContainer}>
                  {plantData.kindwiseData.plant_details.common_names
                    .slice(0, 3)
                    .map((name, index) => (
                      <View key={index} style={styles.tag}>
                        <Text style={styles.tagText}>{name}</Text>
                      </View>
                    ))}
                </View>
              )}
            </LinearGradient>
          </View>

          {/* Weather Info */}
          {weather && (
            <View style={styles.weatherCard}>
              <Ionicons name="partly-sunny" size={24} color="#00ff88" />
              <View style={styles.weatherInfo}>
                <Text style={styles.weatherText}>
                  {Math.round(weather.temp)}°C • {weather.description}
                </Text>
                <Text style={styles.weatherLocation}>{weather.location.city}</Text>
              </View>
            </View>
          )}

          {/* Care Advice */}
          {careAdvice && (
            <View style={styles.careCard}>
              <LinearGradient
                colors={['#1a1f3a', '#0f1425']}
                style={styles.careGradient}
              >
                <View style={styles.careHeader}>
                  <Ionicons name="sparkles" size={24} color="#00ff88" />
                  <Text style={styles.careTitle}>AI Care Guide</Text>
                </View>
                <Text style={styles.careText}>{careAdvice}</Text>
              </LinearGradient>
            </View>
          )}

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
    color: '#fff',
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
    color: '#fff',
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  confidenceText: {
    color: '#00ff88',
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
  infoGradient: {
    padding: 20,
    borderWidth: 1,
    borderColor: '#00ff88',
  },
  plantName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#9ca3af',
    lineHeight: 20,
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: 'rgba(0, 255, 136, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#00ff88',
  },
  tagText: {
    color: '#00ff88',
    fontSize: 12,
    fontWeight: '600',
  },
  weatherCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: 'rgba(26, 31, 58, 0.8)',
    padding: 16,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#00ff88',
  },
  weatherInfo: {
    marginLeft: 12,
    flex: 1,
  },
  weatherText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  weatherLocation: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
  careCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  careGradient: {
    padding: 20,
    borderWidth: 1,
    borderColor: '#00ff88',
  },
  careHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  careTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginLeft: 12,
  },
  careText: {
    fontSize: 14,
    color: '#9ca3af',
    lineHeight: 22,
  },
  saveButton: {
    marginHorizontal: 20,
    marginTop: 10,
  },
});

export default ScanResultScreen;

