// This file is a fallback for using MaterialIcons on Android and web.

import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface IconSymbolProps {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
  size?: number;
}

export function IconSymbol({ name, color, size = 24 }: IconSymbolProps) {
  // Handle platform-specific icon names
  const platformName = Platform.select({
    ios: `ios-${name}`,
    android: `md-${name}`,
    default: name,
  });

  return <Ionicons name={platformName as any} size={size} color={color} style={styles.icon} />;
}

const styles = StyleSheet.create({
  icon: {
    marginBottom: -3,
  },
});
