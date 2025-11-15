import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import GradientBackground from '../components/GradientBackground';
import FuturisticButton from '../components/FuturisticButton';
import LoadingOverlay from '../components/LoadingOverlay';
import { usePlants } from '../context/PlantContext';
import { getCareAdvice, detectPlantIssues } from '../services/openaiService';
import { getCurrentWeather } from '../services/weatherService';

const PlantDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { plantId } = route.params || {};
  const { getPlantById, updatePlant } = usePlants();
  const [plant, setPlant] = useState(null);
  const [careAdvice, setCareAdvice] = useState(null);
  const [issues, setIssues] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadPlant();
    loadWeather();
  }, [plantId]);

  const loadPlant = () => {
    const plantData = getPlantById(plantId);
    if (plantData) {
      setPlant(plantData);
      setNotes(plantData.notes || '');
      if (plantData.careAdvice) {
        setCareAdvice(plantData.careAdvice);
      } else {
        loadCareAdvice(plantData);
      }
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

  const loadCareAdvice = async (plantData) => {
    setLoading(true);
    try {
      const weatherData = await getCurrentWeather();
      const advice = await getCareAdvice(
        plantData.name,
        plantData.plantData,
        weatherData
      );
      setCareAdvice(advice);
      await updatePlant(plantId, { careAdvice: advice });
    } catch (error) {
      console.error('Error loading care advice:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDetectIssues = async () => {
    if (!plant?.imageUri) {
      Alert.alert('Error', 'No plant image available');
      return;
    }

    setLoading(true);
    try {
      const issuesData = await detectPlantIssues(plant.imageUri, plant.name);
      setIssues(issuesData);
    } catch (error) {
      Alert.alert('Error', 'Failed to detect issues');
    } finally {
      setLoading(false);
    }
  };

  const handleWaterPlant = async () => {
    try {
      await updatePlant(plantId, {
        lastWatered: new Date().toISOString(),
      });
      setPlant({ ...plant, lastWatered: new Date().toISOString() });
      Alert.alert('Success', 'Watering logged!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update watering');
    }
  };

  const handleSaveNotes = async () => {
    try {
      await updatePlant(plantId, { notes });
      setEditingNotes(false);
      Alert.alert('Success', 'Notes saved!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save notes');
    }
  };

  if (!plant) {
    return (
      <GradientBackground>
        <SafeAreaView style={styles.container}>
          <View style={styles.centerContent}>
            <Text style={styles.text}>Plant not found</Text>
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

  const daysSinceWatered = plant.lastWatered
    ? Math.floor(
        (Date.now() - new Date(plant.lastWatered).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container} edges={['top']}>
        {loading && <LoadingOverlay message="Analyzing..." />}
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Plant Details</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Plant Image */}
          {plant.imageUri && (
            <View style={styles.imageContainer}>
              <Image source={{ uri: plant.imageUri }} style={styles.plantImage} />
            </View>
          )}

          {/* Plant Name */}
          <View style={styles.nameCard}>
            <Text style={styles.plantName}>{plant.name}</Text>
            {plant.species && (
              <Text style={styles.species}>{plant.species}</Text>
            )}
          </View>

          {/* Quick Actions */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              onPress={handleWaterPlant}
              style={styles.actionButton}
            >
              <LinearGradient
                colors={['#00ff88', '#00cc6a']}
                style={styles.actionGradient}
              >
                <Ionicons name="water" size={24} color="#fff" />
                <Text style={styles.actionText}>Water</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDetectIssues}
              style={styles.actionButton}
            >
              <LinearGradient
                colors={['#1a1f3a', '#0f1425']}
                style={[styles.actionGradient, styles.actionGradientOutline]}
              >
                <Ionicons name="medical" size={24} color="#00ff88" />
                <Text style={[styles.actionText, styles.actionTextOutline]}>
                  Check Health
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Watering Status */}
          {daysSinceWatered !== null && (
            <View style={styles.statusCard}>
              <Ionicons
                name={daysSinceWatered >= 3 ? 'warning' : 'checkmark-circle'}
                size={24}
                color={daysSinceWatered >= 3 ? '#ffaa00' : '#00ff88'}
              />
              <View style={styles.statusInfo}>
                <Text style={styles.statusTitle}>
                  {daysSinceWatered >= 3
                    ? 'Needs Watering'
                    : 'Recently Watered'}
                </Text>
                <Text style={styles.statusText}>
                  {daysSinceWatered === 0
                    ? 'Watered today'
                    : daysSinceWatered === 1
                    ? 'Watered yesterday'
                    : `Watered ${daysSinceWatered} days ago`}
                </Text>
              </View>
            </View>
          )}

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
                  <Text style={styles.careTitle}>Care Instructions</Text>
                </View>
                <Text style={styles.careText}>{careAdvice}</Text>
              </LinearGradient>
            </View>
          )}

          {/* Issues Detection */}
          {issues && (
            <View style={styles.issuesCard}>
              <LinearGradient
                colors={['#1a1f3a', '#0f1425']}
                style={styles.issuesGradient}
              >
                <View style={styles.issuesHeader}>
                  <Ionicons name="medical" size={24} color="#ffaa00" />
                  <Text style={styles.issuesTitle}>Health Analysis</Text>
                </View>
                <Text style={styles.issuesText}>{issues}</Text>
              </LinearGradient>
            </View>
          )}

          {/* Notes */}
          <View style={styles.notesCard}>
            <LinearGradient
              colors={['#1a1f3a', '#0f1425']}
              style={styles.notesGradient}
            >
              <View style={styles.notesHeader}>
                <Ionicons name="document-text" size={24} color="#00ff88" />
                <Text style={styles.notesTitle}>Notes</Text>
                {!editingNotes && (
                  <TouchableOpacity
                    onPress={() => setEditingNotes(true)}
                    style={styles.editButton}
                  >
                    <Ionicons name="pencil" size={18} color="#00ff88" />
                  </TouchableOpacity>
                )}
              </View>
              {editingNotes ? (
                <View>
                  <TextInput
                    style={styles.notesInput}
                    value={notes}
                    onChangeText={setNotes}
                    multiline
                    placeholder="Add notes about your plant..."
                    placeholderTextColor="#6b7280"
                  />
                  <View style={styles.notesActions}>
                    <TouchableOpacity
                      onPress={() => {
                        setEditingNotes(false);
                        setNotes(plant.notes || '');
                      }}
                      style={styles.cancelButton}
                    >
                      <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleSaveNotes}
                      style={styles.saveNotesButton}
                    >
                      <Text style={styles.saveNotesText}>Save</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <Text style={styles.notesText}>
                  {notes || 'No notes yet. Tap the edit icon to add notes.'}
                </Text>
              )}
            </LinearGradient>
          </View>
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
  },
  plantImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#1a1f3a',
  },
  nameCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  plantName: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  species: {
    fontSize: 16,
    color: '#00ff88',
  },
  actionsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 15,
    overflow: 'hidden',
  },
  actionGradient: {
    padding: 16,
    alignItems: 'center',
  },
  actionGradientOutline: {
    borderWidth: 1,
    borderColor: '#00ff88',
  },
  actionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 8,
  },
  actionTextOutline: {
    color: '#00ff88',
  },
  statusCard: {
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
  statusInfo: {
    marginLeft: 12,
    flex: 1,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  statusText: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
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
  issuesCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  issuesGradient: {
    padding: 20,
    borderWidth: 1,
    borderColor: '#ffaa00',
  },
  issuesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  issuesTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginLeft: 12,
  },
  issuesText: {
    fontSize: 14,
    color: '#9ca3af',
    lineHeight: 22,
  },
  notesCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  notesGradient: {
    padding: 20,
    borderWidth: 1,
    borderColor: '#00ff88',
  },
  notesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  notesTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginLeft: 12,
    flex: 1,
  },
  editButton: {
    padding: 4,
  },
  notesInput: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 10,
    padding: 12,
    color: '#fff',
    fontSize: 14,
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#00ff88',
  },
  notesText: {
    fontSize: 14,
    color: '#9ca3af',
    lineHeight: 22,
  },
  notesActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 12,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  cancelText: {
    color: '#9ca3af',
    fontSize: 14,
    fontWeight: '600',
  },
  saveNotesButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#00ff88',
    borderRadius: 8,
  },
  saveNotesText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default PlantDetailScreen;

