import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { useThemeColor } from '../hooks/useThemeColor';

interface ThemeProps {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'subtitle' | 'defaultSemiBold' | 'link';
}

export type ThemedTextProps = ThemeProps & TextProps;

export function ThemedText(props: ThemedTextProps) {
  const { style, lightColor, darkColor, type = 'default', ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        styles.default,
        type === 'title' && styles.title,
        type === 'subtitle' && styles.subtitle,
        type === 'defaultSemiBold' && styles.defaultSemiBold,
        type === 'link' && styles.link,
        { color },
        style,
      ]}
      {...otherProps}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  defaultSemiBold: {
    fontWeight: '600',
  },
  link: {
    color: '#2e78b7',
  },
});
