import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { cannedReplies, initialConversations, initialStories, users } from '@/data/mockData';
import { Conversation, Story, StoryItem, User, ME } from '@/types';

interface AppDataValue {
  users: User[];
  stories: Story[];
  conversations: Conversation[];
  getUser: (id: string) => User | undefined;
  getConversationFor: (participantId: string) => Conversation;
  markStoryItemViewed: (userId: string, itemId: string) => void;
  postStoryItem: (color: string, caption: string, uri?: string) => void;
  sendMessage: (participantId: string, text: string) => void;
  sendStoryReply: (userId: string, storyColor: string, text: string) => void;
}

const AppDataContext = createContext<AppDataValue | null>(null);

let nextId = 1000;
const genId = (prefix: string) => `${prefix}-${nextId++}`;

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [stories, setStories] = useState<Story[]>(initialStories);
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);

  const getUser = useCallback((id: string) => users.find((u) => u.id === id), []);

  const getConversationFor = useCallback(
    (participantId: string) => {
      const existing = conversations.find((c) => c.participantId === participantId);
      if (existing) return existing;
      return { id: `pending-${participantId}`, participantId, messages: [] } as Conversation;
    },
    [conversations]
  );

  const ensureConversation = useCallback((participantId: string, update: (c: Conversation) => Conversation) => {
    setConversations((prev) => {
      const idx = prev.findIndex((c) => c.participantId === participantId);
      if (idx === -1) {
        const fresh: Conversation = { id: genId('c'), participantId, messages: [] };
        return [...prev, update(fresh)];
      }
      const next = [...prev];
      next[idx] = update(prev[idx]);
      return next;
    });
  }, []);

  const scheduleCannedReply = useCallback((participantId: string) => {
    const delay = 900 + Math.random() * 1600;
    setTimeout(() => {
      ensureConversation(participantId, (c) => ({
        ...c,
        messages: [
          ...c.messages,
          {
            id: genId('m'),
            conversationId: c.id,
            senderId: participantId,
            kind: 'text',
            text: cannedReplies[Math.floor(Math.random() * cannedReplies.length)],
            createdAt: Date.now(),
          },
        ],
      }));
    }, delay);
  }, [ensureConversation]);

  const sendMessage = useCallback(
    (participantId: string, text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      ensureConversation(participantId, (c) => ({
        ...c,
        messages: [
          ...c.messages,
          { id: genId('m'), conversationId: c.id, senderId: ME, kind: 'text', text: trimmed, createdAt: Date.now() },
        ],
      }));
      scheduleCannedReply(participantId);
    },
    [ensureConversation, scheduleCannedReply]
  );

  const sendStoryReply = useCallback(
    (userId: string, storyColor: string, text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      ensureConversation(userId, (c) => ({
        ...c,
        messages: [
          ...c.messages,
          {
            id: genId('m'),
            conversationId: c.id,
            senderId: ME,
            kind: 'story_reply',
            text: trimmed,
            storyColor,
            createdAt: Date.now(),
          },
        ],
      }));
      scheduleCannedReply(userId);
    },
    [ensureConversation, scheduleCannedReply]
  );

  const markStoryItemViewed = useCallback((userId: string, itemId: string) => {
    setStories((prev) =>
      prev.map((s) =>
        s.userId === userId && !s.viewedItemIds.includes(itemId)
          ? { ...s, viewedItemIds: [...s.viewedItemIds, itemId] }
          : s
      )
    );
  }, []);

  const postStoryItem = useCallback((color: string, caption: string, uri?: string) => {
    const item: StoryItem = { id: genId('story'), color, uri, caption, createdAt: Date.now() };
    setStories((prev) => {
      const idx = prev.findIndex((s) => s.userId === ME);
      if (idx === -1) {
        return [{ userId: ME, items: [item], viewedItemIds: [] }, ...prev];
      }
      const next = [...prev];
      next[idx] = { ...next[idx], items: [...next[idx].items, item] };
      return next;
    });
  }, []);

  const value = useMemo<AppDataValue>(
    () => ({
      users,
      stories,
      conversations,
      getUser,
      getConversationFor,
      markStoryItemViewed,
      postStoryItem,
      sendMessage,
      sendStoryReply,
    }),
    [stories, conversations, getUser, getConversationFor, markStoryItemViewed, postStoryItem, sendMessage, sendStoryReply]
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider');
  return ctx;
}
