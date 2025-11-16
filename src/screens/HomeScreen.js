import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { usePlants } from '../context/PlantContext';
import { useThemeMode } from '../context/ThemeContext';
import { getThemeColors } from '../theme/colors';
import GradientBackground from '../components/GradientBackground';
import FuturisticButton from '../components/FuturisticButton';
import { getCurrentWeather } from '../services/weatherService';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { plants } = usePlants();
  const [weather, setWeather] = useState(null);
  const { mode, toggleTheme } = useThemeMode();
  const theme = getThemeColors(mode);

  useEffect(() => {
    loadWeather();
  }, []);

  const loadWeather = async () => {
    try {
      const weatherData = await getCurrentWeather();
      setWeather(weatherData);
    } catch (error) {
      console.error('Error loading weather:', error);
    }
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text
                style={[
                  styles.greeting,
                  { color: mode === 'dark' ? '#ffffff' : '#111827' },
                ]}
              >
                Hello, Plant Lover! 🌿
              </Text>
              <Text
                style={[
                  styles.subtitle,
                  { color: mode === 'dark' ? '#9ca3af' : '#4b5563' },
                ]}
              >
                Discover and care for your plants
              </Text>
            </View>
            <View style={styles.headerRight}>
              {weather && (
                <BlurView
                  intensity={40}
                  tint={theme.blurTint}
                  style={[
                    styles.weatherCard,
                    {
                      backgroundColor: theme.card,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <Ionicons name="partly-sunny" size={24} color={theme.iconAccent} />
                  <View style={styles.weatherInfo}>
                    <Text style={[styles.temp, { color: theme.text }]}>
                      {Math.round(weather.temp)}°C
                    </Text>
                    <Text style={[styles.weatherDesc, { color: theme.textMuted }]}>
                      {weather.description}
                    </Text>
                  </View>
                </BlurView>
              )}
            </View>
          </View>

          {/* Theme Toggle */}
          <View style={styles.themeToggleContainer}>
            <TouchableOpacity
              onPress={toggleTheme}
              activeOpacity={0.9}
            >
              <BlurView
                intensity={35}
                tint={theme.blurTint}
                style={[
                  styles.themeToggle,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.borderStrong,
                  },
                ]}
              >
                <View
                  style={[
                    styles.themeThumb,
                    {
                      backgroundColor: mode === 'light' ? 'rgba(124,58,237,0.2)' : 'rgba(15,23,42,0.95)',
                    },
                    mode === 'dark' ? styles.themeThumbRight : styles.themeThumbLeft,
                  ]}
                />
                <View style={styles.themeLabels}>
                  <Text
                    style={[
                      styles.themeLabel,
                      {
                        color: mode === 'light' ? theme.text : theme.textMuted,
                      },
                      mode === 'light' && { color: theme.text, fontWeight: '700' },
                    ]}
                  >
                    Light
                  </Text>
                  <Text
                    style={[
                      styles.themeLabel,
                      {
                        color: mode === 'dark' ? theme.text : theme.textMuted,
                      },
                      mode === 'dark' && { color: theme.text, fontWeight: '700' },
                    ]}
                  >
                    Dark
                  </Text>
                </View>
              </BlurView>
            </TouchableOpacity>
          </View>

          {/* Main Action Card */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Camera')}
            style={styles.mainCard}
            activeOpacity={0.9}
          >
            <BlurView intensity={50} tint="dark" style={styles.mainCardBlur}>
              <LinearGradient
                colors={['rgba(124,58,237,0.85)', 'rgba(168,85,247,0.9)', 'rgba(236,72,153,0.95)']}
                style={styles.mainCardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.mainCardContent}>
                  <View style={styles.cameraIconContainer}>
                    <Ionicons name="camera" size={48} color="#f9fafb" />
                  </View>
                  <Text style={styles.mainCardTitle}>Scan Your Plant</Text>
                  <Text style={styles.mainCardSubtitle}>
                    Take a photo to identify and get care tips
                  </Text>
                </View>
                <View style={styles.glowEffect} />
              </LinearGradient>
            </BlurView>
          </TouchableOpacity>

          {/* Quick Stats */}
          <View style={styles.statsContainer}>
            <BlurView intensity={40} tint={theme.blurTint} style={styles.statCard}>
              <LinearGradient
                colors={
                  mode === 'light'
                    ? ['rgba(255,255,255,0.95)', 'rgba(248,250,252,0.9)']
                    : ['rgba(15,23,42,0.9)', 'rgba(15,23,42,0.6)']
                }
                style={[styles.statGradient, { borderColor: theme.border }]}
              >
                <Ionicons name="leaf" size={28} color={theme.iconAccent} />
                <Text style={[styles.statNumber, { color: theme.text }]}>{plants.length}</Text>
                <Text style={[styles.statLabel, { color: theme.textMuted }]}>My Plants</Text>
              </LinearGradient>
            </BlurView>
            <BlurView intensity={40} tint={theme.blurTint} style={styles.statCard}>
              <LinearGradient
                colors={
                  mode === 'light'
                    ? ['rgba(255,255,255,0.95)', 'rgba(248,250,252,0.9)']
                    : ['rgba(15,23,42,0.9)', 'rgba(15,23,42,0.6)']
                }
                style={[styles.statGradient, { borderColor: theme.border }]}
              >
                <Ionicons name="water" size={28} color={theme.accentSecondary} />
                <Text style={[styles.statNumber, { color: theme.text }]}>
                  {plants.filter((p) => {
                    if (!p.lastWatered) return true;
                    const daysSince = Math.floor(
                      (Date.now() - new Date(p.lastWatered).getTime()) /
                        (1000 * 60 * 60 * 24)
                    );
                    return daysSince >= 3;
                  }).length}
                </Text>
                <Text style={[styles.statLabel, { color: theme.textMuted }]}>Need Water</Text>
              </LinearGradient>
            </BlurView>
          </View>

          {/* Recent Plants */}
          {plants.length > 0 && (
            <View style={styles.section}>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: mode === 'dark' ? '#ffffff' : '#111827' },
                ]}
              >
                Recent Plants
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.recentPlantsContainer}
              >
                {plants.slice(0, 5).map((plant) => (
                  <TouchableOpacity
                    key={plant.id}
                    onPress={() =>
                      navigation.navigate('MyPlants', {
                        screen: 'PlantDetail',
                        params: { plantId: plant.id },
                      })
                    }
                    style={styles.recentPlantCard}
                  >
                    {plant.imageUri ? (
                      <Image
                        source={{ uri: plant.imageUri }}
                        style={styles.recentPlantImage}
                      />
                    ) : (
                      <View
                        style={[
                          styles.recentPlantPlaceholder,
                          {
                            backgroundColor: theme.card,
                            borderColor: theme.border,
                          },
                        ]}
                      >
                        <Ionicons name="leaf" size={28} color={theme.iconAccent} />
                      </View>
                    )}
                    <Text style={[styles.recentPlantName, { color: theme.text }]} numberOfLines={1}>
                      {plant.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Quick Actions</Text>
            <View style={styles.actionsGrid}>
              <BlurView intensity={35} tint={theme.blurTint} style={styles.actionCard}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('MyPlants')}
                  style={[
                    styles.actionInner,
                    {
                      backgroundColor: theme.card,
                      borderColor: theme.border,
                    },
                  ]}
                  activeOpacity={0.9}
                >
                  <Ionicons name="library" size={24} color={theme.iconAccent} />
                  <Text style={[styles.actionText, { color: theme.text }]}>My Collection</Text>
                </TouchableOpacity>
              </BlurView>
              <BlurView intensity={35} tint={theme.blurTint} style={styles.actionCard}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('CareGuide')}
                  style={[
                    styles.actionInner,
                    {
                      backgroundColor: theme.card,
                      borderColor: theme.border,
                    },
                  ]}
                  activeOpacity={0.9}
                >
                  <Ionicons name="book" size={24} color={theme.iconAccent} />
                  <Text style={[styles.actionText, { color: theme.text }]}>Care Guide</Text>
                </TouchableOpacity>
              </BlurView>
            </View>
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
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
    paddingRight: 12,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeToggleContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  themeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 999,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderWidth: 1,
    overflow: 'hidden',
  },
  themeThumb: {
    position: 'absolute',
    top: 3,
    bottom: 3,
    width: '50%',
    borderRadius: 999,
    shadowColor: '#020617',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  themeThumbLeft: {
    left: 3,
  },
  themeThumbRight: {
    right: 3,
  },
  themeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  themeLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
  },
  greeting: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  weatherCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    borderWidth: 1,
    marginLeft: 'auto',
  },
  weatherInfo: {
    marginLeft: 8,
  },
  temp: {
    fontSize: 18,
    fontWeight: '700',
  },
  weatherDesc: {
    fontSize: 12,
    textTransform: 'capitalize',
  },
  mainCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 28,
    overflow: 'hidden',
    elevation: 16,
    shadowColor: '#020617',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 30,
  },
  mainCardBlur: {
    borderRadius: 28,
    overflow: 'hidden',
  },
  mainCardGradient: {
    padding: 32,
    position: 'relative',
  },
  mainCardContent: {
    alignItems: 'center',
    zIndex: 1,
  },
  cameraIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(15,23,42,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  mainCardTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#f9fafb',
    marginBottom: 8,
  },
  mainCardSubtitle: {
    fontSize: 14,
    color: 'rgba(249, 250, 251, 0.8)',
    textAlign: 'center',
  },
  glowEffect: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#a855f7',
    opacity: 0.2,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 16,
  },
  statCard: {
    flex: 1,
    borderRadius: 22,
    overflow: 'hidden',
  },
  statGradient: {
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '800',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  recentPlantsContainer: {
    paddingHorizontal: 20,
  },
  recentPlantCard: {
    marginRight: 12,
    alignItems: 'center',
  },
  recentPlantImage: {
    width: 80,
    height: 80,
    borderRadius: 15,
    backgroundColor: '#1a1f3a',
    marginBottom: 8,
  },
  recentPlantPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
  },
  recentPlantName: {
    fontSize: 12,
    textAlign: 'center',
    maxWidth: 80,
  },
  actionsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 16,
  },
  actionCard: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  actionInner: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    borderWidth: 1,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
});

export default HomeScreen;

