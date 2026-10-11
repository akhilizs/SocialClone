export interface User {
  id: string;
  username: string;
  name: string;
}

export interface StoryItem {
  id: string;
  color: string;
  uri?: string;
  caption: string;
  createdAt: number;
}

export interface Story {
  userId: string;
  items: StoryItem[];
  viewedItemIds: string[];
}

export type MessageKind = 'text' | 'story_reply';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  kind: MessageKind;
  text: string;
  storyColor?: string;
  createdAt: number;
}

export interface Conversation {
  id: string;
  participantId: string;
  messages: Message[];
}

export const ME = 'me';
