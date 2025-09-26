import { Stack } from 'expo-router'
import React from 'react'
import { AuthProvider } from '../src/contexts/AuthContext'

export default function RootLayout() {
  return (
    <AuthProvider>
      {/* Root-level stack that renders a tabs navigator as the index route */}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  )
}
