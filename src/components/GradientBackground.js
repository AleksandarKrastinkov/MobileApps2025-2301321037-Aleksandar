import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeMode } from '../context/ThemeContext';

// App-wide background with a luxurious, tinted gradient.
// Switches between a dark and a softer light variant based on theme mode.
const GradientBackground = ({ children, colors, style }) => {
  const { mode } = useThemeMode();

  const darkColors = ['#050616', '#141432', '#25194a'];
  const lightColors = ['#f8f9fa', '#f1f5f9', '#e2e8f0']; // Softer, warmer light grays

  const resolvedColors = colors || (mode === 'dark' ? darkColors : lightColors);

  return (
    <LinearGradient
      colors={resolvedColors}
      style={[styles.gradient, style]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});

export default GradientBackground;

