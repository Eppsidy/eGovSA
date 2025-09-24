import { Stack } from 'expo-router'
import React from 'react'
import { AuthProvider } from '../src/contexts/AuthContext'

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  )
}
