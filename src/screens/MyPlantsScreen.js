import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import GradientBackground from '../components/GradientBackground';
import PlantCard from '../components/PlantCard';
import { usePlants } from '../context/PlantContext';
import FuturisticButton from '../components/FuturisticButton';

const MyPlantsScreen = () => {
  const navigation = useNavigation();
  const { plants, deletePlant } = usePlants();
  const [refreshing, setRefreshing] = useState(false);

  const handleDelete = (plant) => {
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
              await deletePlant(plant.id);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete plant');
            }
          },
        },
      ]
    );
  };

  const handlePlantPress = (plant) => {
    navigation.navigate('PlantDetail', { plantId: plant.id });
  };

  const renderPlant = ({ item }) => (
    <PlantCard
      plant={item}
      onPress={() => handlePlantPress(item)}
      onDelete={() => handleDelete(item)}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="leaf-outline" size={80} color="#6b7280" />
      <Text style={styles.emptyTitle}>No Plants Yet</Text>
      <Text style={styles.emptyText}>
        Start by scanning a plant to add it to your collection
      </Text>
      <FuturisticButton
        title="Scan a Plant"
        icon="camera"
        onPress={() => navigation.navigate('Home')}
        style={styles.emptyButton}
      />
    </View>
  );

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>My Plants</Text>
          <Text style={styles.subtitle}>{plants.length} in collection</Text>
        </View>

        {/* Plants List */}
        <FlatList
          data={plants}
          renderItem={renderPlant}
          keyExtractor={(item) => item.id}
          contentContainerStyle={
            plants.length === 0 ? styles.emptyList : styles.list
          }
          ListEmptyComponent={renderEmpty}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            setTimeout(() => setRefreshing(false), 1000);
          }}
        />
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#f9fafb',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#cbd5f5',
  },
  list: {
    paddingVertical: 8,
  },
  emptyList: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#f9fafb',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#cbd5f5',
    textAlign: 'center',
    marginBottom: 32,
  },
  emptyButton: {
    marginTop: 8,
  },
});

export default MyPlantsScreen;

