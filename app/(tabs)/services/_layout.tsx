import { Stack } from 'expo-router'
import React from 'react'

export default function ServicesStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitleAlign: 'center',
        headerShadowVisible: false,
        headerStyle: { backgroundColor: '#fff' },
        headerTitleStyle: { fontSize: 18, fontWeight: '700' },
        contentStyle: { backgroundColor: '#f7f7f8' },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="[service]" options={{ headerShown: false }} />
    </Stack>
  )
}
