import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

const LoadingOverlay = ({ message = 'Loading...' }) => {
  return (
    <View style={styles.overlay}>
      <BlurView intensity={20} style={styles.blur}>
        <LinearGradient
          colors={['#1a1f3a', '#0f1425']}
          style={styles.container}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <ActivityIndicator size="large" color="#00ff88" />
          <Text style={styles.message}>{message}</Text>
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
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LoadingOverlay;

