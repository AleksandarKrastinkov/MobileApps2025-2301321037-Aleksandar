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
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { usePlants } from '../context/PlantContext';
import GradientBackground from '../components/GradientBackground';
import FuturisticButton from '../components/FuturisticButton';
import { getCurrentWeather } from '../services/weatherService';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { plants } = usePlants();
  const [weather, setWeather] = useState(null);

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
            <View>
              <Text style={styles.greeting}>Hello, Plant Lover! 🌿</Text>
              <Text style={styles.subtitle}>Discover and care for your plants</Text>
            </View>
            {weather && (
              <View style={styles.weatherCard}>
                <Ionicons name="partly-sunny" size={24} color="#00ff88" />
                <View style={styles.weatherInfo}>
                  <Text style={styles.temp}>{Math.round(weather.temp)}°C</Text>
                  <Text style={styles.weatherDesc}>{weather.description}</Text>
                </View>
              </View>
            )}
          </View>

          {/* Main Action Card */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Camera')}
            style={styles.mainCard}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#00ff88', '#00cc6a', '#00994d']}
              style={styles.mainCardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.mainCardContent}>
                <View style={styles.cameraIconContainer}>
                  <Ionicons name="camera" size={48} color="#fff" />
                </View>
                <Text style={styles.mainCardTitle}>Scan Your Plant</Text>
                <Text style={styles.mainCardSubtitle}>
                  Take a photo to identify and get care tips
                </Text>
              </View>
              <View style={styles.glowEffect} />
            </LinearGradient>
          </TouchableOpacity>

          {/* Quick Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <LinearGradient
                colors={['#1a1f3a', '#0f1425']}
                style={styles.statGradient}
              >
                <Ionicons name="leaf" size={32} color="#00ff88" />
                <Text style={styles.statNumber}>{plants.length}</Text>
                <Text style={styles.statLabel}>My Plants</Text>
              </LinearGradient>
            </View>
            <View style={styles.statCard}>
              <LinearGradient
                colors={['#1a1f3a', '#0f1425']}
                style={styles.statGradient}
              >
                <Ionicons name="water" size={32} color="#00ff88" />
                <Text style={styles.statNumber}>
                  {plants.filter((p) => {
                    if (!p.lastWatered) return true;
                    const daysSince = Math.floor(
                      (Date.now() - new Date(p.lastWatered).getTime()) /
                        (1000 * 60 * 60 * 24)
                    );
                    return daysSince >= 3;
                  }).length}
                </Text>
                <Text style={styles.statLabel}>Need Water</Text>
              </LinearGradient>
            </View>
          </View>

          {/* Recent Plants */}
          {plants.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recent Plants</Text>
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
                      <View style={styles.recentPlantPlaceholder}>
                        <Ionicons name="leaf" size={32} color="#00ff88" />
                      </View>
                    )}
                    <Text style={styles.recentPlantName} numberOfLines={1}>
                      {plant.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionsGrid}>
              <TouchableOpacity
                onPress={() => navigation.navigate('MyPlants')}
                style={styles.actionCard}
              >
                <LinearGradient
                  colors={['#1a1f3a', '#0f1425']}
                  style={styles.actionGradient}
                >
                  <Ionicons name="library" size={28} color="#00ff88" />
                  <Text style={styles.actionText}>My Collection</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('CareGuide')}
                style={styles.actionCard}
              >
                <LinearGradient
                  colors={['#1a1f3a', '#0f1425']}
                  style={styles.actionGradient}
                >
                  <Ionicons name="book" size={28} color="#00ff88" />
                  <Text style={styles.actionText}>Care Guide</Text>
                </LinearGradient>
              </TouchableOpacity>
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
  greeting: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#9ca3af',
  },
  weatherCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 31, 58, 0.8)',
    padding: 12,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#00ff88',
  },
  weatherInfo: {
    marginLeft: 8,
  },
  temp: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  weatherDesc: {
    fontSize: 12,
    color: '#9ca3af',
    textTransform: 'capitalize',
  },
  mainCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#00ff88',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
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
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  mainCardTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
  },
  mainCardSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  glowEffect: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#fff',
    opacity: 0.1,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 16,
  },
  statCard: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  statGradient: {
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00ff88',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
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
    backgroundColor: '#1a1f3a',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#00ff88',
  },
  recentPlantName: {
    fontSize: 12,
    color: '#fff',
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
  actionGradient: {
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00ff88',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginTop: 8,
  },
});

export default HomeScreen;

