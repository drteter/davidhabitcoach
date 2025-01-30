// This is a shim for web and Android where the tab bar is generally opaque.
import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function TabBarBackground() {
  return <View style={styles.background} />;
}

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#eee',
  },
});

export function useBottomTabOverflow() {
  return 0;
}
