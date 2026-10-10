import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/Avatar';
import { MessageBubble } from '@/components/MessageBubble';
import { useAppData } from '@/context/AppDataContext';
import { colors } from '@/theme/colors';
import { Message } from '@/types';

export default function ChatScreen() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const router = useRouter();
  const { getUser, getConversationFor, sendMessage } = useAppData();
  const [draft, setDraft] = useState('');
  const listRef = useRef<FlatList<Message>>(null);

  const user = getUser(userId ?? '');
  const conversation = getConversationFor(userId ?? '');

  if (!user) return null;

  const handleSend = () => {
    if (!draft.trim()) return;
    sendMessage(user.id, draft);
    setDraft('');
    requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color={colors.text} />
        </Pressable>
        <Avatar userId={user.id} name={user.name} size={32} />
        <View style={styles.headerText}>
          <Text style={styles.headerName}>{user.name}</Text>
          <Text style={styles.headerHandle}>@{user.username}</Text>
        </View>
      </View>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <FlatList
          ref={listRef}
          data={conversation.messages}
          keyExtractor={(m) => m.id}
          renderItem={({ item }) => <MessageBubble message={item} />}
          contentContainerStyle={styles.listContent}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
        />

        <View style={styles.inputRow}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Message..."
            placeholderTextColor={colors.textSecondary}
            style={styles.input}
            multiline
          />
          <Pressable onPress={handleSend} disabled={!draft.trim()} style={styles.sendButton}>
            <Ionicons name="send" size={22} color={draft.trim() ? colors.link : colors.border} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 10,
  },
  backButton: {
    padding: 4,
  },
  headerText: {
    justifyContent: 'center',
  },
  headerName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  headerHandle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  listContent: {
    paddingVertical: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.text,
  },
  sendButton: {
    paddingBottom: 8,
  },
});
