import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import { Message, ME } from '@/types';

export function MessageBubble({ message }: { message: Message }) {
  const mine = message.senderId === ME;

  if (message.kind === 'story_reply') {
    return (
      <View style={[styles.row, mine ? styles.rowMine : styles.rowTheirs]}>
        <View style={styles.storyReplyCard}>
          <View style={[styles.storyThumb, { backgroundColor: message.storyColor ?? colors.border }]} />
          <Text style={styles.storyReplyLabel}>Replied to your story</Text>
        </View>
        <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleTheirs]}>
          <Text style={mine ? styles.textMine : styles.textTheirs}>{message.text}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.row, mine ? styles.rowMine : styles.rowTheirs]}>
      <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleTheirs]}>
        <Text style={mine ? styles.textMine : styles.textTheirs}>{message.text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    marginVertical: 4,
    paddingHorizontal: 12,
  },
  rowMine: {
    alignItems: 'flex-end',
  },
  rowTheirs: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '75%',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  bubbleMine: {
    backgroundColor: colors.bubbleMine,
  },
  bubbleTheirs: {
    backgroundColor: colors.bubbleTheirs,
  },
  textMine: {
    color: '#fff',
    fontSize: 15,
  },
  textTheirs: {
    color: colors.text,
    fontSize: 15,
  },
  storyReplyCard: {
    alignItems: 'center',
    marginBottom: 4,
    opacity: 0.8,
  },
  storyThumb: {
    width: 36,
    height: 56,
    borderRadius: 8,
  },
  storyReplyLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
