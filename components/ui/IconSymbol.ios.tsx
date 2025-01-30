import { SymbolView, SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { StyleProp, ViewStyle } from 'react-native';

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight = 'regular',
}: {
  name: string;
  size?: number;
  color: string;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
}) {
  const symbolMap: { [key: string]: SymbolViewProps['name'] } = {
    'add-outline': 'plus',
    'remove-outline': 'minus',
    'list-outline': 'list.bullet',
    'compass-outline': 'safari',
    'settings-outline': 'gear',
  };

  const symbolName = symbolMap[name];
  
  if (!symbolName) {
    console.warn(`No matching SF Symbol found for: ${name}`);
    return null;
  }

  return (
    <SymbolView
      weight="semibold"
      tintColor={color}
      resizeMode="center"
      name={symbolName}
      style={[
        {
          width: size,
          height: size,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
    />
  );
}
