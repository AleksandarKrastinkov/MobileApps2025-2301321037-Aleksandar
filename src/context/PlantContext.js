import React, { createContext, useState, useEffect, useContext } from 'react';
import { plantStorage } from '../services/storageService';

const PlantContext = createContext();

export const usePlants = () => {
  const context = useContext(PlantContext);
  if (!context) {
    throw new Error('usePlants must be used within PlantProvider');
  }
  return context;
};

export const PlantProvider = ({ children }) => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load plants on mount
  useEffect(() => {
    loadPlants();
  }, []);

  const loadPlants = async () => {
    try {
      setLoading(true);
      const loadedPlants = await plantStorage.getAll();
      setPlants(loadedPlants);
    } catch (error) {
      console.error('Error loading plants:', error);
    } finally {
      setLoading(false);
    }
  };

  const addPlant = async (plant) => {
    try {
      const newPlant = await plantStorage.create(plant);
      setPlants((prev) => [...prev, newPlant]);
      return newPlant;
    } catch (error) {
      console.error('Error adding plant:', error);
      throw error;
    }
  };

  const updatePlant = async (id, updates) => {
    try {
      const updatedPlant = await plantStorage.update(id, updates);
      setPlants((prev) =>
        prev.map((plant) => (plant.id === id ? updatedPlant : plant))
      );
      return updatedPlant;
    } catch (error) {
      console.error('Error updating plant:', error);
      throw error;
    }
  };

  const deletePlant = async (id) => {
    try {
      await plantStorage.delete(id);
      setPlants((prev) => prev.filter((plant) => plant.id !== id));
      return true;
    } catch (error) {
      console.error('Error deleting plant:', error);
      throw error;
    }
  };

  const getPlantById = (id) => {
    return plants.find((plant) => plant.id === id);
  };

  const value = {
    plants,
    loading,
    addPlant,
    updatePlant,
    deletePlant,
    getPlantById,
    refreshPlants: loadPlants,
  };

  return <PlantContext.Provider value={value}>{children}</PlantContext.Provider>;
};

