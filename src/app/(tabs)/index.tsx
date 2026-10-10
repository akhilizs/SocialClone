import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/Avatar';
import { StoryRing } from '@/components/StoryRing';
import { useAppData } from '@/context/AppDataContext';
import { colors } from '@/theme/colors';
import { ME, Story } from '@/types';

function timeAgo(ts: number): string {
  const mins = Math.round((Date.now() - ts) / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export default function StoriesScreen() {
  const router = useRouter();
  const { stories, getUser } = useAppData();

  const myStory = stories.find((s) => s.userId === ME);
  const others = stories.filter((s) => s.userId !== ME);

  const openStory = (userId: string) => router.push({ pathname: '/story/[userId]', params: { userId } });

  const renderOther = ({ item }: { item: Story }) => {
    const user = getUser(item.userId);
    if (!user) return null;
    const hasUnseen = item.items.some((i) => !item.viewedItemIds.includes(i.id));
    const latest = item.items[item.items.length - 1];

    return (
      <Pressable style={styles.row} onPress={() => openStory(item.userId)}>
        <StoryRing userId={user.id} name={user.name} size={60} hasUnseen={hasUnseen} />
        <View style={styles.rowText}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.meta}>{timeAgo(latest.createdAt)}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Stories</Text>
      </View>

      <Pressable
        style={styles.row}
        onPress={() => (myStory ? openStory(ME) : router.push('/new-story'))}
      >
        <View>
          {myStory ? (
            <StoryRing userId={ME} name="You" size={60} hasUnseen={myStory.items.some((i) => !myStory.viewedItemIds.includes(i.id))} />
          ) : (
            <Avatar userId={ME} name="You" size={60} />
          )}
          <Pressable
            style={styles.addBadge}
            onPress={(e) => {
              e.stopPropagation();
              router.push('/new-story');
            }}
          >
            <Ionicons name="add-circle" size={22} color={colors.link} />
          </Pressable>
        </View>
        <View style={styles.rowText}>
          <Text style={styles.name}>Your story</Text>
          <Text style={styles.meta}>{myStory ? `${myStory.items.length} moment${myStory.items.length > 1 ? 's' : ''}` : 'Add to your story'}</Text>
        </View>
      </Pressable>

      <View style={styles.divider} />

      <FlatList
        data={others}
        keyExtractor={(item) => item.userId}
        renderItem={renderOther}
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 14,
  },
  rowText: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  meta: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  addBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: colors.background,
    borderRadius: 12,
  },
  divider: {
    height: 8,
    backgroundColor: colors.surface,
    marginTop: 6,
    marginBottom: 2,
  },
});
