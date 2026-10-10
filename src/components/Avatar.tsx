import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colorForId } from '@/theme/colors';

interface AvatarProps {
  userId: string;
  name: string;
  size?: number;
}

export function Avatar({ userId, name, size = 56 }: AvatarProps) {
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <View
      style={[
        styles.circle,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: colorForId(userId) },
      ]}
    >
      <Text style={[styles.initials, { fontSize: size * 0.36 }]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: '#fff',
    fontWeight: '600',
  },
});
