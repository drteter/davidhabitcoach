import React from 'react';
import { Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Link, LinkProps } from 'expo-router';

interface HapticTabProps {
  href: LinkProps['href'];
  children: React.ReactNode;
}

export function HapticTab({ href, children }: HapticTabProps) {
  return (
    <Link href={href} asChild>
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
      >
        {children}
      </Pressable>
    </Link>
  );
}
