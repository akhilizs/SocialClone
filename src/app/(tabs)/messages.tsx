import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ConversationRow } from '@/components/ConversationRow';
import { useAppData } from '@/context/AppDataContext';
import { colors } from '@/theme/colors';
import { Conversation } from '@/types';

export default function MessagesScreen() {
  const router = useRouter();
  const { conversations, getUser } = useAppData();

  const sorted = [...conversations].sort((a, b) => {
    const at = a.messages[a.messages.length - 1]?.createdAt ?? 0;
    const bt = b.messages[b.messages.length - 1]?.createdAt ?? 0;
    return bt - at;
  });

  const renderItem = ({ item }: { item: Conversation }) => {
    const user = getUser(item.participantId);
    if (!user) return null;
    return (
      <ConversationRow
        conversation={item}
        user={user}
        onPress={() => router.push({ pathname: '/chat/[userId]', params: { userId: user.id } })}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>
      <FlatList
        data={sorted}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
});
