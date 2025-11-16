import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

// A more refined, luxury-style button with soft gradients and subtle depth.
const FuturisticButton = ({
  title,
  onPress,
  icon,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
}) => {
  const isPrimary = variant === 'primary';
  const colors = isPrimary
    ? ['#7c3aed', '#a855f7', '#ec4899'] // soft purple/pink gradient
    : ['rgba(15,23,42,0.8)', 'rgba(24,24,48,0.9)'];

  if (variant === 'outline') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        style={[styles.outlineButton, style, disabled && styles.disabled]}
        activeOpacity={0.85}
      >
        {icon && <Ionicons name={icon} size={20} color="#e5e7eb" style={styles.icon} />}
        {loading ? (
          <ActivityIndicator color="#e5e7eb" />
        ) : (
          <Text style={styles.outlineButtonText}>{title}</Text>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[styles.buttonContainer, style, disabled && styles.disabled]}
      activeOpacity={0.85}
    >
      <LinearGradient
        colors={colors}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        {icon && <Ionicons name={icon} size={20} color="#f9fafb" style={styles.icon} />}
        {loading ? (
          <ActivityIndicator color="#f9fafb" />
        ) : (
          <Text style={styles.buttonText}>{title}</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 18,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    backgroundColor: 'rgba(15,23,42,0.8)',
  },
  gradient: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#f9fafb',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  outlineButton: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(226,232,240,0.5)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(15,23,42,0.6)',
  },
  outlineButtonText: {
    color: '#e5e7eb',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.8,
  },
  icon: {
    marginRight: 8,
  },
  disabled: {
    opacity: 0.6,
  },
});

export default FuturisticButton;

