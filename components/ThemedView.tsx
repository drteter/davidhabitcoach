import { View, type ViewProps } from 'react-native';
import { useThemeColor } from '../hooks/useThemeColor';

interface ThemeProps {
  lightColor?: string;
  darkColor?: string;
}

export type ThemedViewProps = ThemeProps & ViewProps;

export function ThemedView(props: ThemedViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'background'
  );

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
