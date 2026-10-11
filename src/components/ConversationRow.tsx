import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/Avatar';
import { colors } from '@/theme/colors';
import { Conversation, User, ME } from '@/types';

function timeAgo(ts: number): string {
  const diffMs = Date.now() - ts;
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return 'now';
  if (mins < 60) return `${mins}m`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.round(hours / 24)}d`;
}

interface ConversationRowProps {
  conversation: Conversation;
  user: User;
  onPress: () => void;
}

export function ConversationRow({ conversation, user, onPress }: ConversationRowProps) {
  const last = conversation.messages[conversation.messages.length - 1];
  const isMine = last?.senderId === ME;
  const preview = last ? (last.kind === 'story_reply' ? `Replied to your story: ${last.text}` : last.text) : 'Say hi';

  return (
    <Pressable style={styles.row} onPress={onPress}>
      <Avatar userId={user.id} name={user.name} size={54} />
      <View style={styles.textCol}>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.preview} numberOfLines={1}>
          {isMine ? 'You: ' : ''}
          {preview}
          {last ? `  ·  ${timeAgo(last.createdAt)}` : ''}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 12,
  },
  textCol: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  preview: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
