import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  PanResponder,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Avatar } from '@/components/Avatar';
import { useAppData } from '@/context/AppDataContext';
import { colors } from '@/theme/colors';

const ITEM_DURATION = 4500;

function timeAgo(ts: number): string {
  const mins = Math.round((Date.now() - ts) / 60000);
  if (mins < 1) return 'now';
  if (mins < 60) return `${mins}m`;
  return `${Math.round(mins / 60)}h`;
}

export default function StoryViewerScreen() {
  'use no memo';
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const router = useRouter();
  const { stories, getUser, markStoryItemViewed, sendStoryReply } = useAppData();

  const story = stories.find((s) => s.userId === userId);
  const user = getUser(userId ?? '');

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reply, setReply] = useState('');
  const progress = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  const item = story?.items[index];

  const goNext = () => {
    if (!story) return;
    if (index < story.items.length - 1) {
      setIndex((i) => i + 1);
    } else {
      router.back();
    }
  };

  const goPrev = () => {
    if (index > 0) setIndex((i) => i - 1);
    else router.back();
  };

  useEffect(() => {
    if (!item || !userId) return;
    markStoryItemViewed(userId, item.id);
  }, [item, userId, markStoryItemViewed]);

  useEffect(() => {
    if (!item) return;
    progress.setValue(0);
    if (paused) return;

    animationRef.current = Animated.timing(progress, {
      toValue: 1,
      duration: ITEM_DURATION,
      useNativeDriver: false,
    });
    animationRef.current.start(({ finished }) => {
      if (finished) goNext();
    });

    return () => animationRef.current?.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, paused, item?.id]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dy) > 10 && Math.abs(gesture.dy) > Math.abs(gesture.dx),
        onPanResponderGrant: () => setPaused(true),
        onPanResponderMove: (_, gesture) => {
          if (gesture.dy > 0) translateY.setValue(gesture.dy);
        },
        onPanResponderRelease: (_, gesture) => {
          if (gesture.dy > 120) {
            router.back();
            return;
          }
          Animated.spring(translateY, { toValue: 0, useNativeDriver: true }).start();
          setPaused(false);
        },
      }),
    [router, translateY]
  );

  if (!story || !user || !item) {
    return (
      <View style={styles.missing}>
        <Text style={styles.missingText}>This story is no longer available.</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.missingLink}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const handleSend = () => {
    if (!reply.trim()) return;
    sendStoryReply(user.id, item.color, reply);
    setReply('');
    router.push({ pathname: '/chat/[userId]', params: { userId: user.id } });
  };

  return (
    <Animated.View
      style={[styles.container, { backgroundColor: item.color, transform: [{ translateY }] }]}
      {...panResponder.panHandlers}
    >
      {item.uri && <Image source={{ uri: item.uri }} style={StyleSheet.absoluteFill} contentFit="cover" />}
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.progressRow}>
          {story.items.map((storyItem, i) => (
            <View key={storyItem.id} style={styles.progressTrack}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width:
                      i < index
                        ? '100%'
                        : i === index
                        ? progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] })
                        : '0%',
                  },
                ]}
              />
            </View>
          ))}
        </View>

        <View style={styles.header}>
          <Avatar userId={user.id} name={user.name} size={32} />
          <Text style={styles.headerName}>{user.name}</Text>
          <Text style={styles.headerTime}>{timeAgo(item.createdAt)}</Text>
          <Pressable style={styles.closeButton} onPress={() => router.back()}>
            <Ionicons name="close" size={28} color="#fff" />
          </Pressable>
        </View>

        <View style={styles.captionWrap}>
          <Text style={styles.caption}>{item.caption}</Text>
        </View>

        <View style={styles.tapZones} pointerEvents="box-none">
          <Pressable style={styles.tapZoneLeft} onPress={goPrev} />
          <Pressable
            style={styles.tapZoneRight}
            onPress={goNext}
            onPressIn={() => setPaused(true)}
            onPressOut={() => setPaused(false)}
          />
        </View>

        <View style={styles.replyRow}>
          <TextInput
            value={reply}
            onChangeText={setReply}
            placeholder={`Reply to ${user.name.split(' ')[0]}...`}
            placeholderTextColor="rgba(255,255,255,0.75)"
            style={styles.replyInput}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
            returnKeyType="send"
            onSubmitEditing={handleSend}
          />
          {reply.trim().length > 0 && (
            <Pressable onPress={handleSend} style={styles.sendButton}>
              <Ionicons name="send" size={20} color="#fff" />
            </Pressable>
          )}
        </View>
      </KeyboardAvoidingView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  progressRow: {
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 8,
    paddingTop: 54,
  },
  progressTrack: {
    flex: 1,
    height: 2.5,
    backgroundColor: 'rgba(255,255,255,0.35)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 10,
    gap: 10,
  },
  headerName: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  headerTime: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
  },
  closeButton: {
    marginLeft: 'auto',
    padding: 4,
  },
  captionWrap: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  caption: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
  },
  tapZones: {
    position: 'absolute',
    top: 80,
    bottom: 80,
    left: 0,
    right: 0,
    flexDirection: 'row',
  },
  tapZoneLeft: {
    flex: 1,
  },
  tapZoneRight: {
    flex: 2,
  },
  replyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 18,
    paddingTop: 8,
    gap: 10,
  },
  replyInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: '#fff',
    fontSize: 14,
  },
  sendButton: {
    padding: 6,
  },
  missing: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    gap: 12,
  },
  missingText: {
    color: colors.text,
    fontSize: 15,
  },
  missingLink: {
    color: colors.link,
    fontSize: 15,
    fontWeight: '600',
  },
});
