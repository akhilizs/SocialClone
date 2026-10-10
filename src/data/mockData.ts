import { Conversation, Message, Story, User, ME } from '@/types';

export const users: User[] = [
  { id: ME, username: 'you', name: 'You' },
  { id: 'u1', username: 'maya.k', name: 'Maya Kapoor' },
  { id: 'u2', username: 'jordan.t', name: 'Jordan Torres' },
  { id: 'u3', username: 'sofia_r', name: 'Sofia Rossi' },
  { id: 'u4', username: 'theo.b', name: 'Theo Baptiste' },
  { id: 'u5', username: 'amara.n', name: 'Amara Ndiaye' },
  { id: 'u6', username: 'liam.oc', name: 'Liam O’Connor' },
];

const hoursAgo = (h: number) => Date.now() - h * 60 * 60 * 1000;
const minsAgo = (m: number) => Date.now() - m * 60 * 1000;

const storyColors = ['#F77737', '#833AB4', '#2BBF80', '#405DE6', '#E1306C', '#00A8CC'];

export const initialStories: Story[] = [
  {
    userId: 'u1',
    viewedItemIds: [],
    items: [
      { id: 's1-1', color: storyColors[0], caption: 'Golden hour on the terrace ✨', createdAt: hoursAgo(2) },
      { id: 's1-2', color: storyColors[1], caption: 'Coffee before the chaos', createdAt: hoursAgo(1) },
    ],
  },
  {
    userId: 'u2',
    viewedItemIds: [],
    items: [{ id: 's2-1', color: storyColors[2], caption: 'Studio session, new track incoming', createdAt: hoursAgo(5) }],
  },
  {
    userId: 'u3',
    viewedItemIds: ['s3-1'],
    items: [
      { id: 's3-1', color: storyColors[3], caption: 'Sunday market finds', createdAt: hoursAgo(10) },
      { id: 's3-2', color: storyColors[4], caption: 'Fresh basil for dinner', createdAt: hoursAgo(9) },
    ],
  },
  {
    userId: 'u4',
    viewedItemIds: [],
    items: [{ id: 's4-1', color: storyColors[5], caption: 'Rooftop run, 6am', createdAt: hoursAgo(14) }],
  },
  {
    userId: 'u5',
    viewedItemIds: [],
    items: [
      { id: 's5-1', color: storyColors[1], caption: 'Gallery opening tonight', createdAt: hoursAgo(3) },
    ],
  },
];

function conversation(id: string, participantId: string, messages: Omit<Message, 'conversationId'>[]): Conversation {
  return {
    id,
    participantId,
    messages: messages.map((m) => ({ ...m, conversationId: id })),
  };
}

export const initialConversations: Conversation[] = [
  conversation('c1', 'u1', [
    { id: 'm1', senderId: 'u1', kind: 'text', text: 'Hey! Are we still on for Saturday?', createdAt: minsAgo(40) },
    { id: 'm2', senderId: ME, kind: 'text', text: 'Yes! Wouldn’t miss it', createdAt: minsAgo(38) },
    { id: 'm3', senderId: 'u1', kind: 'text', text: 'Perfect, I’ll bring the camera 📷', createdAt: minsAgo(35) },
  ]),
  conversation('c2', 'u2', [
    { id: 'm4', senderId: 'u2', kind: 'text', text: 'Sent you the track, lmk what you think', createdAt: minsAgo(120) },
    { id: 'm5', senderId: ME, kind: 'text', text: 'Listening now, the bridge is 🔥', createdAt: minsAgo(90) },
  ]),
  conversation('c3', 'u3', [
    { id: 'm6', senderId: ME, kind: 'text', text: 'That market looked amazing', createdAt: minsAgo(500) },
    { id: 'm7', senderId: 'u3', kind: 'text', text: 'You’d love it, let’s go next weekend', createdAt: minsAgo(480) },
  ]),
  conversation('c4', 'u5', [
    { id: 'm8', senderId: 'u5', kind: 'text', text: 'Doors open at 7, see you there?', createdAt: minsAgo(20) },
  ]),
];

export const cannedReplies = [
  'Haha for real',
  'No way, tell me more',
  'I was just thinking about that',
  'Yes!! 100%',
  'Omg stop 😂',
  'Let’s talk about this later',
  'Sending you a call in 5',
  'That’s so true',
];
