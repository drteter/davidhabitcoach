import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { ThemedText } from './ThemedText';
import { Colors } from '../constants/Colors';

interface Props {
  progress: number;
  size?: number;
  strokeWidth?: number;
  count?: number;
  target?: number;
}

export function ProgressCircle({ 
  progress, 
  size = 80, 
  strokeWidth = 8,
  count,
  target
}: Props) {
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const [shimmerOffset, setShimmerOffset] = useState('-10%');

  useEffect(() => {
    if (progress >= 100) {
      // Create a continuous shimmer animation
      shimmerAnim.addListener(({ value }) => {
        const offset = `${(value * 120 - 10)}%`;
        setShimmerOffset(offset);
      });

      Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: false,
          }),
          Animated.timing(shimmerAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: false,
          }),
        ])
      ).start();

      // Cleanup
      return () => {
        shimmerAnim.removeAllListeners();
      };
    }
  }, [progress >= 100]);

  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  
  // Always show full circle when over 100%
  const strokeDashoffset = progress >= 100 
    ? 0 
    : circumference - (Math.min(100, progress) / 100) * circumference;

  // Luxurious gold colors with shimmer
  const goldGradientStart = '#FFD700'; // Bright gold
  const goldGradientMiddle = '#FDB931'; // Rich gold
  const goldGradientEnd = '#B8860B';    // Dark gold
  const shimmerColor = '#FFFFFF';        // Shimmer highlight

  // Calculate font size based on number of digits
  const roundedProgress = Math.round(progress);
  const getBaseFontSize = () => {
    if (progress >= 100) {
      return 20; // Start larger and let it scale down
    }
    return 24;
  };

  return (
    <View style={styles.circleContainer}>
      <View style={styles.container}>
        <Svg width={size} height={size}>
          <Defs>
            <LinearGradient 
              id="goldGradient" 
              x1="0%" 
              y1="0%" 
              x2="100%" 
              y2="100%"
            >
              <Stop offset="0%" stopColor={goldGradientStart} />
              <Stop offset="50%" stopColor={goldGradientMiddle} />
              <Stop offset="100%" stopColor={goldGradientEnd} />
            </LinearGradient>
            
            {/* Shimmer gradient */}
            {progress >= 100 && (
              <LinearGradient
                id="shimmerGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <Stop 
                  offset={shimmerOffset}
                  stopColor={shimmerColor}
                  stopOpacity="0"
                />
                <Stop 
                  offset={`${parseFloat(shimmerOffset) + 10}%`}
                  stopColor={shimmerColor}
                  stopOpacity="0.3"
                />
                <Stop 
                  offset={`${parseFloat(shimmerOffset) + 20}%`}
                  stopColor={shimmerColor}
                  stopOpacity="0"
                />
              </LinearGradient>
            )}
          </Defs>

          {/* Background circle */}
          <Circle
            stroke="#E6E6E6"
            fill="none"
            cx={center}
            cy={center}
            r={radius}
            strokeWidth={strokeWidth}
          />

          {/* Main progress circle */}
          <Circle
            stroke={progress >= 100 ? "url(#goldGradient)" : Colors.primary}
            fill="none"
            cx={center}
            cy={center}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${center} ${center})`}
            strokeOpacity={progress >= 100 ? 0.9 : 1}
          />

          {/* Shimmer overlay */}
          {progress >= 100 && (
            <Circle
              stroke="url(#shimmerGradient)"
              fill="none"
              cx={center}
              cy={center}
              r={radius}
              strokeWidth={strokeWidth}
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform={`rotate(-90 ${center} ${center})`}
            />
          )}

          {/* Extra decorative ring for >100% */}
          {progress >= 100 && (
            <Circle
              stroke={goldGradientStart}
              fill="none"
              cx={center}
              cy={center}
              r={radius + strokeWidth * 1.5}
              strokeWidth={1}
              opacity={0.3}
            />
          )}
        </Svg>
        <View style={[styles.textContainer, { width: size, height: size }]}>
          <ThemedText 
            type="defaultSemiBold"
            style={[
              progress >= 100 && styles.overachievedText,
              { fontSize: 16 }
            ]}
          >
            {Math.round(progress)}%
          </ThemedText>
        </View>
      </View>
      {count !== undefined && (
        <View style={styles.statsContainer}>
          <ThemedText 
            type="defaultBold" 
            style={[
              styles.countText,
              progress >= 100 && styles.overachievedText
            ]}
          >
            {count.toLocaleString()}
          </ThemedText>
          {target && (
            <ThemedText 
              type="default" 
              style={styles.targetText}
            >
              {`target: ${target.toLocaleString()}`}
            </ThemedText>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  circleContainer: {
    alignItems: 'center',
  },
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    marginTop: 8,
    alignItems: 'center',
  },
  countText: {
    fontSize: 18,
    marginBottom: 2,
  },
  targetText: {
    fontSize: 14,
    color: '#666',
  },
  overachievedText: {
    color: '#B8860B',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
}); 