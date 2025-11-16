import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// App-wide background with a luxurious, tinted purple/indigo gradient.
// This keeps the content readable while giving a premium, atmospheric feel.
const GradientBackground = ({ children, colors, style }) => {
  const defaultColors = ['#050616', '#141432', '#25194a'];

  return (
    <LinearGradient
      colors={colors || defaultColors}
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

