import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppData } from '@/context/AppDataContext';
import { avatarPalette } from '@/theme/colors';

export default function NewStoryScreen() {
  const router = useRouter();
  const { postStoryItem } = useAppData();
  const [uri, setUri] = useState<string | null>(null);
  const [caption, setCaption] = useState('');

  const pickImage = async (fromCamera: boolean) => {
    const permission = fromCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permission needed', 'Allow access to continue.');
      return;
    }

    const result = fromCamera
      ? await ImagePicker.launchCameraAsync({ quality: 0.8, allowsEditing: true, aspect: [9, 16] })
      : await ImagePicker.launchImageLibraryAsync({ quality: 0.8, allowsEditing: true, aspect: [9, 16] });

    if (!result.canceled && result.assets?.[0]) {
      setUri(result.assets[0].uri);
    }
  };

  const handlePost = () => {
    const color = avatarPalette[Math.floor(Math.random() * avatarPalette.length)];
    postStoryItem(color, caption.trim(), uri ?? undefined);
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="close" size={28} color="#fff" />
        </Pressable>
        <Text style={styles.title}>New story</Text>
        <Pressable onPress={handlePost} disabled={!uri}>
          <Text style={[styles.post, !uri && styles.postDisabled]}>Share</Text>
        </Pressable>
      </View>

      <View style={styles.preview}>
        {uri ? (
          <Image source={{ uri }} style={styles.previewImage} contentFit="cover" />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="image-outline" size={56} color="rgba(255,255,255,0.6)" />
            <Text style={styles.placeholderText}>Choose a photo to share</Text>
          </View>
        )}
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.actionButton} onPress={() => pickImage(false)}>
          <Ionicons name="images-outline" size={22} color="#fff" />
          <Text style={styles.actionLabel}>Library</Text>
        </Pressable>
        <Pressable style={styles.actionButton} onPress={() => pickImage(true)}>
          <Ionicons name="camera-outline" size={22} color="#fff" />
          <Text style={styles.actionLabel}>Camera</Text>
        </Pressable>
      </View>

      <TextInput
        value={caption}
        onChangeText={setCaption}
        placeholder="Add a caption..."
        placeholderTextColor="rgba(255,255,255,0.6)"
        style={styles.captionInput}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#111',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  post: {
    color: '#0095f6',
    fontSize: 16,
    fontWeight: '700',
  },
  postDisabled: {
    opacity: 0.4,
  },
  preview: {
    flex: 1,
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#1c1c1e',
  },
  previewImage: {
    flex: 1,
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  placeholderText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 32,
    paddingBottom: 12,
  },
  actionButton: {
    alignItems: 'center',
    gap: 4,
  },
  actionLabel: {
    color: '#fff',
    fontSize: 12,
  },
  captionInput: {
    marginHorizontal: 16,
    marginBottom: 24,
    color: '#fff',
    fontSize: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
    paddingTop: 12,
  },
});
