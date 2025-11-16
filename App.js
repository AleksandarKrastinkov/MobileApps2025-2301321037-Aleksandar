import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TamaguiProvider, Theme } from 'tamagui';
import config from './tamagui.config';
import MainNavigator from './src/navigation/MainNavigator';
import { PlantProvider } from './src/context/PlantContext';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TamaguiProvider config={config}>
        <Theme name="dark">
          <PlantProvider>
            <NavigationContainer>
              <StatusBar style="light" />
              <MainNavigator />
            </NavigationContainer>
          </PlantProvider>
        </Theme>
      </TamaguiProvider>
    </GestureHandlerRootView>
  );
}

