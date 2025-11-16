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
import { BlurView } from 'expo-blur';
import GradientBackground from '../components/GradientBackground';
import { useThemeMode } from '../context/ThemeContext';
import { getThemeColors } from '../theme/colors';
import FuturisticButton from '../components/FuturisticButton';
import LoadingOverlay from '../components/LoadingOverlay';
import { usePlants } from '../context/PlantContext';
import { getCareAdvice, detectPlantIssues } from '../services/openaiService';
import {
  getWateringFrequency,
  canWaterPlant,
  formatNextWateringMessage,
  getTimeUntilNextWatering,
} from '../utils/wateringSchedule';

const PlantDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { plantId } = route.params || {};
  const { getPlantById, updatePlant, deletePlant } = usePlants();
  const [plant, setPlant] = useState(null);
  const [careAdvice, setCareAdvice] = useState(null);
  const [issues, setIssues] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const { mode } = useThemeMode();
  const theme = getThemeColors(mode);

  useEffect(() => {
    loadPlant();
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

  const handleDeletePlant = () => {
    Alert.alert(
      'Delete Plant',
      `Are you sure you want to remove ${plant.name} from your collection?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePlant(plantId);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete plant');
            }
          },
        },
      ]
    );
  };

  const loadCareAdvice = async (plantData) => {
    setLoading(true);
    try {
      const advice = await getCareAdvice(
        plantData.name,
        plantData.plantData,
        null // No weather data needed
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
    if (!plant) return;
    
    const wateringFrequency = getWateringFrequency(plant.name, plant.species);
    const canWater = canWaterPlant(plant.lastWatered, wateringFrequency);
    
    if (!canWater && plant.lastWatered) {
      const timeUntil = getTimeUntilNextWatering(plant.lastWatered, wateringFrequency);
      const message = timeUntil.days > 0
        ? `Please wait ${timeUntil.days} more day${timeUntil.days > 1 ? 's' : ''} before watering again.`
        : `Please wait ${timeUntil.hours} more hour${timeUntil.hours > 1 ? 's' : ''} before watering again.`;
      Alert.alert('Cooldown Active', message);
      return;
    }
    
    try {
      await updatePlant(plantId, {
        lastWatered: new Date().toISOString(),
        wateringFrequency: wateringFrequency, // Store frequency for future reference
      });
      setPlant({ ...plant, lastWatered: new Date().toISOString(), wateringFrequency });
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
            <Text
              style={[
                styles.text,
                { color: mode === 'dark' ? '#ffffff' : '#111827' },
              ]}
            >
              Plant not found
            </Text>
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

  // Calculate watering frequency and cooldown status
  const wateringFrequency = plant.wateringFrequency || getWateringFrequency(plant.name, plant.species);
  const canWater = canWaterPlant(plant.lastWatered, wateringFrequency);
  const nextWateringMessage = formatNextWateringMessage(plant.lastWatered, wateringFrequency);
  const timeUntilWatering = getTimeUntilNextWatering(plant.lastWatered, wateringFrequency);

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
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Plant Details</Text>
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
            <BlurView intensity={45} tint={theme.blurTint} style={styles.nameBlur}>
              <LinearGradient
                colors={
                  mode === 'light'
                    ? ['rgba(255,255,255,0.95)', 'rgba(248,250,252,0.9)']
                    : ['rgba(15,23,42,0.95)', 'rgba(30,64,175,0.7)']
                }
                style={[styles.nameGradient, { borderColor: theme.border }]}
              >
                <View style={styles.nameHeader}>
                  <View style={styles.nameContent}>
                    <Text style={[styles.plantName, { color: theme.text }]}>{plant.name}</Text>
                    {plant.species && (
                      <Text style={[styles.species, { color: theme.iconAccent }]}>
                        {plant.species}
                      </Text>
                    )}
                  </View>
                  <TouchableOpacity
                    onPress={handleDeletePlant}
                    style={[
                      styles.deleteButton,
                      {
                        backgroundColor: mode === 'light' ? 'rgba(239,68,68,0.1)' : 'rgba(239,68,68,0.2)',
                      },
                    ]}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="trash-outline" size={20} color={theme.error} />
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </BlurView>
          </View>

          {/* Quick Actions */}
          <View style={styles.actionsContainer}>
            <BlurView intensity={40} tint={theme.blurTint} style={styles.actionButton}>
              <TouchableOpacity
                onPress={handleWaterPlant}
                style={styles.actionInner}
                disabled={!canWater}
                activeOpacity={canWater ? 0.9 : 1}
              >
                <LinearGradient
                  colors={canWater ? ['#22c55e', '#4ade80'] : ['#6b7280', '#9ca3af']}
                  style={styles.actionGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="water" size={22} color="#f9fafb" />
                  <Text style={styles.actionText}>{canWater ? 'Water' : 'On Cooldown'}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </BlurView>
            <BlurView intensity={40} tint={theme.blurTint} style={styles.actionButton}>
              <TouchableOpacity onPress={handleDetectIssues} style={styles.actionInner}>
                <LinearGradient
                  colors={
                    mode === 'light'
                      ? ['rgba(255,255,255,0.95)', 'rgba(248,250,252,0.9)']
                      : ['rgba(15,23,42,0.95)', 'rgba(76,29,149,0.9)']
                  }
                  style={[
                    styles.actionGradient,
                    styles.actionGradientOutline,
                    { borderColor: theme.borderStrong },
                  ]}
                >
                  <Ionicons name="medical" size={22} color={theme.iconAccent} />
                  <Text style={[styles.actionText, styles.actionTextOutline, { color: theme.iconAccent }]}>
                    Check Health
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </BlurView>
          </View>

          {/* Watering Status */}
          <BlurView
            intensity={40}
            tint={theme.blurTint}
            style={[
              styles.statusCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <Ionicons
              name={canWater ? (daysSinceWatered >= wateringFrequency ? 'warning' : 'checkmark-circle') : 'time-outline'}
              size={24}
              color={canWater ? (daysSinceWatered >= wateringFrequency ? theme.warning : theme.success) : theme.textMuted}
            />
            <View style={styles.statusInfo}>
              <Text style={[styles.statusTitle, { color: theme.text }]}>
                {canWater
                  ? daysSinceWatered >= wateringFrequency
                    ? 'Needs Watering'
                    : 'Recently Watered'
                  : 'On Cooldown'}
              </Text>
              <Text style={[styles.statusText, { color: theme.textMuted }]}>
                {plant.lastWatered
                  ? daysSinceWatered === 0
                    ? `Watered today • ${nextWateringMessage}`
                    : daysSinceWatered === 1
                    ? `Watered yesterday • ${nextWateringMessage}`
                    : `Watered ${daysSinceWatered} days ago • ${nextWateringMessage}`
                  : `Ready to water • Every ${wateringFrequency} day${wateringFrequency > 1 ? 's' : ''}`}
              </Text>
            </View>
          </BlurView>


          {/* Care Advice */}
          {careAdvice && (
            <View style={styles.careCard}>
              <BlurView intensity={45} tint={theme.blurTint} style={styles.careBlur}>
                <LinearGradient
                  colors={
                    mode === 'light'
                      ? ['rgba(255,255,255,0.95)', 'rgba(248,250,252,0.9)']
                      : ['rgba(15,23,42,0.95)', 'rgba(76,29,149,0.9)']
                  }
                  style={[styles.careGradient, { borderColor: theme.border }]}
                >
                  <View style={styles.careHeader}>
                    <Ionicons name="sparkles" size={24} color={theme.iconAccent} />
                    <Text style={[styles.careTitle, { color: theme.text }]}>Care Instructions</Text>
                  </View>
                  <Text style={[styles.careText, { color: theme.textSecondary }]}>
                    {careAdvice}
                  </Text>
                </LinearGradient>
              </BlurView>
            </View>
          )}

          {/* Issues Detection */}
          {issues && (
            <View style={styles.issuesCard}>
              <BlurView intensity={45} tint={theme.blurTint} style={styles.issuesBlur}>
                <LinearGradient
                  colors={
                    mode === 'light'
                      ? ['rgba(255,255,255,0.95)', 'rgba(248,250,252,0.9)']
                      : ['rgba(15,23,42,0.95)', 'rgba(190,24,93,0.9)']
                  }
                  style={[styles.issuesGradient, { borderColor: theme.border }]}
                >
                  <View style={styles.issuesHeader}>
                    <Ionicons name="medical" size={24} color={theme.warning} />
                    <Text style={[styles.issuesTitle, { color: theme.text }]}>Health Analysis</Text>
                  </View>
                  <Text style={[styles.issuesText, { color: theme.textSecondary }]}>{issues}</Text>
                </LinearGradient>
              </BlurView>
            </View>
          )}

          {/* Notes */}
          <View style={styles.notesCard}>
            <BlurView intensity={45} tint={theme.blurTint} style={styles.notesBlur}>
              <LinearGradient
                colors={
                  mode === 'light'
                    ? ['rgba(255,255,255,0.95)', 'rgba(248,250,252,0.9)']
                    : ['rgba(15,23,42,0.95)', 'rgba(30,64,175,0.8)']
                }
                style={[styles.notesGradient, { borderColor: theme.border }]}
              >
              <View style={styles.notesHeader}>
                <Ionicons name="document-text" size={24} color={theme.success} />
                <Text style={[styles.notesTitle, { color: theme.text }]}>Notes</Text>
                {!editingNotes && (
                  <TouchableOpacity
                    onPress={() => setEditingNotes(true)}
                    style={styles.editButton}
                  >
                    <Ionicons name="pencil" size={18} color={theme.iconAccent} />
                  </TouchableOpacity>
                )}
              </View>
              {editingNotes ? (
                <View>
                  <TextInput
                    style={[
                      styles.notesInput,
                      {
                        color: theme.text,
                        borderColor: theme.border,
                        backgroundColor: mode === 'light' ? 'rgba(255,255,255,0.5)' : 'rgba(15,23,42,0.5)',
                      },
                    ]}
                    value={notes}
                    onChangeText={setNotes}
                    multiline
                    placeholder="Add notes about your plant..."
                    placeholderTextColor={theme.textMuted}
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
                <Text style={[styles.notesText, { color: theme.textMuted }]}>
                  {notes || 'No notes yet. Tap the edit icon to add notes.'}
                </Text>
              )}
              </LinearGradient>
            </BlurView>
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
  nameBlur: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  nameGradient: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  nameHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  nameContent: {
    flex: 1,
    paddingRight: 12,
  },
  plantName: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 4,
  },
  species: {
    fontSize: 16,
  },
  deleteButton: {
    padding: 10,
    borderRadius: 12,
    minWidth: 40,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 18,
    overflow: 'hidden',
  },
  actionInner: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  actionGradient: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: 'center',
    borderRadius: 18,
  },
  actionGradientOutline: {
    borderWidth: 1,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 8,
  },
  actionTextOutline: {},
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.4)',
    backgroundColor: 'rgba(15,23,42,0.7)',
  },
  statusInfo: {
    marginLeft: 12,
    flex: 1,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f9fafb',
  },
  statusText: {
    fontSize: 12,
    color: '#cbd5f5',
    marginTop: 4,
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
    borderColor: 'rgba(148,163,184,0.45)',
  },
  careHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  careTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f9fafb',
    marginLeft: 12,
  },
  careText: {
    fontSize: 14,
    color: '#e5e7eb',
    lineHeight: 22,
  },
  issuesCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  issuesBlur: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  issuesGradient: {
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(250,204,21,0.8)',
  },
  issuesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  issuesTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f9fafb',
    marginLeft: 12,
  },
  issuesText: {
    fontSize: 14,
    color: '#e5e7eb',
    lineHeight: 22,
  },
  notesCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  notesBlur: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  notesGradient: {
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.45)',
  },
  notesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  notesTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f9fafb',
    marginLeft: 12,
    flex: 1,
  },
  editButton: {
    padding: 4,
  },
  notesInput: {
    backgroundColor: 'rgba(15,23,42,0.7)',
    borderRadius: 10,
    padding: 12,
    color: '#f9fafb',
    fontSize: 14,
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: 'rgba(129,140,248,0.7)',
  },
  notesText: {
    fontSize: 14,
    color: '#e5e7eb',
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

