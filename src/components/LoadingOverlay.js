import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeMode } from '../context/ThemeContext';
import { getThemeColors } from '../theme/colors';

const LoadingOverlay = ({ message = 'Loading...' }) => {
  const { mode } = useThemeMode();
  const theme = getThemeColors(mode);
  
  return (
    <View style={styles.overlay} pointerEvents="box-none">
      <BlurView intensity={20} tint={theme.blurTint} style={styles.blur} pointerEvents="box-none">
        <LinearGradient
          colors={
            mode === 'light'
              ? ['rgba(255,255,255,0.95)', 'rgba(248,250,252,0.9)']
              : ['#1a1f3a', '#0f1425']
          }
          style={styles.container}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <ActivityIndicator size="large" color={theme.accent} />
          <Text style={[styles.message, { color: theme.text }]}>{message}</Text>
        </LinearGradient>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  blur: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    padding: 32,
    borderRadius: 20,
    alignItems: 'center',
    minWidth: 200,
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LoadingOverlay;

