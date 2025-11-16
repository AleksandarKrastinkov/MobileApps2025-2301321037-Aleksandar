import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useThemeMode } from '../context/ThemeContext';
import { getThemeColors } from '../theme/colors';

const PlantCard = ({ plant, onPress, onDelete }) => {
  const { mode } = useThemeMode();
  const theme = getThemeColors(mode);
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.cardContainer}
      activeOpacity={0.9}
    >
      <BlurView intensity={45} tint={theme.blurTint} style={styles.blur}>
        <LinearGradient
          colors={
            mode === 'light'
              ? ['rgba(255,255,255,0.95)', 'rgba(248,250,252,0.9)']
              : ['rgba(15,23,42,0.95)', 'rgba(30,64,175,0.7)']
          }
          style={[styles.gradient, { borderColor: theme.border }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {plant.imageUri && (
            <Image source={{ uri: plant.imageUri }} style={styles.image} />
          )}
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
                {plant.name || 'Unknown Plant'}
              </Text>
            </View>
            {onDelete && (
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
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
            )}
            {plant.species && (
              <Text style={[styles.species, { color: theme.iconAccent }]} numberOfLines={1}>
                {plant.species}
              </Text>
            )}
            {plant.lastWatered && (
              <View style={styles.infoRow}>
                <Ionicons name="water" size={14} color={theme.iconAccent} />
                <Text style={[styles.infoText, { color: theme.textMuted }]}>
                  Last watered: {new Date(plant.lastWatered).toLocaleDateString()}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.glow} />
        </LinearGradient>
      </BlurView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 22,
    marginVertical: 8,
    marginHorizontal: 16,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#020617',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  blur: {
    borderRadius: 22,
    overflow: 'hidden',
  },
  gradient: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    position: 'relative',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 18,
    marginRight: 16,
    backgroundColor: 'rgba(15,23,42,0.9)',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
  },
  deleteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 10,
    borderRadius: 12,
    minWidth: 40,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  species: {
    fontSize: 14,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 12,
    marginLeft: 6,
  },
  glow: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#6366f1',
    opacity: 0.25,
  },
});

export default PlantCard;

