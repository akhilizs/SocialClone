import { Stack } from 'expo-router';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppDataProvider } from '@/context/AppDataContext';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppDataProvider>
          <StatusBar style="dark" />
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="story/[userId]"
              options={{ headerShown: false, presentation: 'fullScreenModal', animation: 'fade' }}
            />
            <Stack.Screen
              name="new-story"
              options={{ headerShown: false, presentation: 'fullScreenModal' }}
            />
            <Stack.Screen name="chat/[userId]" options={{ headerShown: false }} />
          </Stack>
        </AppDataProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
