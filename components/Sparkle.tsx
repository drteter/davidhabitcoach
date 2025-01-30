import React from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface Props {
  size?: number;
  color?: string;
  style?: any;
  delay?: number;
}

export function Sparkle({ size = 12, color = '#FFD700', style, delay = 0 }: Props) {
  const sparkleAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(sparkleAnim, {
            toValue: 1,
            duration: 1500 + Math.random() * 500,
            easing: Easing.linear,
            useNativeDriver: false,
          }),
          Animated.timing(sparkleAnim, {
            toValue: 0,
            duration: 1500 + Math.random() * 500,
            easing: Easing.linear,
            useNativeDriver: false,
          }),
        ])
      ).start();
    }, delay);
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        style,
        {
          opacity: sparkleAnim.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0.3, 1, 0.3],
          }),
          transform: [
            {
              scale: sparkleAnim.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0.7, 1.3, 0.7],
              }),
            },
            {
              rotate: sparkleAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '180deg'],
              }),
            },
          ],
        },
      ]}
    >
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path
          d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z"
          fill={color}
        />
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
}); 