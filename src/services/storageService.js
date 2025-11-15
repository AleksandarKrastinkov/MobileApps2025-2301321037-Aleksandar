import AsyncStorage from '@react-native-async-storage/async-storage';

const PLANTS_KEY = '@plants_care:plants';
const SETTINGS_KEY = '@plants_care:settings';

// Plant CRUD Operations
export const plantStorage = {
  // Get all plants
  getAll: async () => {
    try {
      const data = await AsyncStorage.getItem(PLANTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting plants:', error);
      return [];
    }
  },

  // Get a single plant by ID
  getById: async (id) => {
    try {
      const plants = await plantStorage.getAll();
      return plants.find((plant) => plant.id === id);
    } catch (error) {
      console.error('Error getting plant:', error);
      return null;
    }
  },

  // Create a new plant
  create: async (plant) => {
    try {
      const plants = await plantStorage.getAll();
      const newPlant = {
        ...plant,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      plants.push(newPlant);
      await AsyncStorage.setItem(PLANTS_KEY, JSON.stringify(plants));
      return newPlant;
    } catch (error) {
      console.error('Error creating plant:', error);
      throw error;
    }
  },

  // Update a plant
  update: async (id, updates) => {
    try {
      const plants = await plantStorage.getAll();
      const index = plants.findIndex((plant) => plant.id === id);
      if (index === -1) {
        throw new Error('Plant not found');
      }
      plants[index] = {
        ...plants[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      await AsyncStorage.setItem(PLANTS_KEY, JSON.stringify(plants));
      return plants[index];
    } catch (error) {
      console.error('Error updating plant:', error);
      throw error;
    }
  },

  // Delete a plant
  delete: async (id) => {
    try {
      const plants = await plantStorage.getAll();
      const filteredPlants = plants.filter((plant) => plant.id !== id);
      await AsyncStorage.setItem(PLANTS_KEY, JSON.stringify(filteredPlants));
      return true;
    } catch (error) {
      console.error('Error deleting plant:', error);
      throw error;
    }
  },

  // Clear all plants
  clearAll: async () => {
    try {
      await AsyncStorage.removeItem(PLANTS_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing plants:', error);
      throw error;
    }
  },
};

// Settings storage
export const settingsStorage = {
  get: async () => {
    try {
      const data = await AsyncStorage.getItem(SETTINGS_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error getting settings:', error);
      return {};
    }
  },

  set: async (settings) => {
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      return true;
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  },
};

