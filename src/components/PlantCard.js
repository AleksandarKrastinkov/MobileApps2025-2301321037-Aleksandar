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
      <LinearGradient
        colors={['#1a1f3a', '#0f1425', '#1a1f3a']}
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
                <Ionicons name="trash-outline" size={18} color="#ff4444" />
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
              <Ionicons name="water" size={14} color="#00ff88" />
              <Text style={styles.infoText}>
                Last watered: {new Date(plant.lastWatered).toLocaleDateString()}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.glow} />
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#00ff88',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  gradient: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 15,
    marginRight: 16,
    backgroundColor: '#1a1f3a',
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
    color: '#fff',
    flex: 1,
  },
  deleteButton: {
    padding: 4,
  },
  species: {
    fontSize: 14,
    color: '#00ff88',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 12,
    color: '#9ca3af',
    marginLeft: 6,
  },
  glow: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#00ff88',
    opacity: 0.1,
  },
});

export default PlantCard;

