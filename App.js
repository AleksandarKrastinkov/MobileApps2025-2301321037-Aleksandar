import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MainNavigator from './src/navigation/MainNavigator';
import { PlantProvider } from './src/context/PlantContext';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PlantProvider>
        <NavigationContainer>
          <StatusBar style="light" />
          <MainNavigator />
        </NavigationContainer>
      </PlantProvider>
    </GestureHandlerRootView>
  );
}

