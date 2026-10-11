import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Avatar } from '@/components/Avatar';
import { colors, storyGradient } from '@/theme/colors';

interface StoryRingProps {
  userId: string;
  name: string;
  size?: number;
  hasUnseen: boolean;
  ringWidth?: number;
}

export function StoryRing({ userId, name, size = 64, hasUnseen, ringWidth = 3 }: StoryRingProps) {
  const inner = size - ringWidth * 2 - 4;

  if (!hasUnseen) {
    return (
      <View
        style={[
          styles.ring,
          { width: size, height: size, borderRadius: size / 2, borderColor: colors.border, borderWidth: ringWidth },
        ]}
      >
        <Avatar userId={userId} name={name} size={inner} />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={storyGradient}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
      style={[styles.ring, { width: size, height: size, borderRadius: size / 2 }]}
    >
      <View style={[styles.innerFrame, { borderRadius: size / 2 }]}>
        <Avatar userId={userId} name={name} size={inner} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  ring: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerFrame: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
});
