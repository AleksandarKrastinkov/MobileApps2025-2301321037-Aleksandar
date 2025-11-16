import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TamaguiProvider, Theme } from 'tamagui';
import config from './tamagui.config';
import MainNavigator from './src/navigation/MainNavigator';
import { PlantProvider } from './src/context/PlantContext';
import { ThemeModeProvider, useThemeMode } from './src/context/ThemeContext';

const Root = () => {
  const { mode } = useThemeMode();

  return (
    <TamaguiProvider config={config}>
      <Theme name={mode}>
        <PlantProvider>
          <NavigationContainer>
            <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
            <MainNavigator />
          </NavigationContainer>
        </PlantProvider>
      </Theme>
    </TamaguiProvider>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeModeProvider>
        <Root />
      </ThemeModeProvider>
    </GestureHandlerRootView>
  );
}

