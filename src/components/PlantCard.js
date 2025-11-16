import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const PlantCard = ({ plant, onPress, onDelete }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.cardContainer}
      activeOpacity={0.9}
    >
      <BlurView intensity={45} tint="dark" style={styles.blur}>
        <LinearGradient
          colors={['rgba(15,23,42,0.95)', 'rgba(30,64,175,0.7)']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {plant.imageUri && (
            <Image source={{ uri: plant.imageUri }} style={styles.image} />
          )}
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.name} numberOfLines={1}>
                {plant.name || 'Unknown Plant'}
              </Text>
              {onDelete && (
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  style={styles.deleteButton}
                >
                  <Ionicons name="trash-outline" size={18} color="#fb7185" />
                </TouchableOpacity>
              )}
            </View>
            {plant.species && (
              <Text style={styles.species} numberOfLines={1}>
                {plant.species}
              </Text>
            )}
            {plant.lastWatered && (
              <View style={styles.infoRow}>
                <Ionicons name="water" size={14} color="#a5b4fc" />
                <Text style={styles.infoText}>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f9fafb',
    flex: 1,
  },
  deleteButton: {
    padding: 4,
  },
  species: {
    fontSize: 14,
    color: '#c4b5fd',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 12,
    color: '#cbd5f5',
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

