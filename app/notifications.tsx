import { Stack } from 'expo-router'
import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'

export default function NotificationsScreen() {
  const notifications = [
    { id: '1', title: 'Smart ID Ready for Collection', description: 'Your Smart ID is ready for collection at Sandton Home Affairs office', time: '2 hours ago', active: true },
    { id: '2', title: 'Tax Return Processed', description: 'Your tax return has been successfully processed. Refund expected in 5–7 days', time: '1 day ago', active: true },
    { id: '3', title: 'Application Update', description: 'Additional documents required for business license application', time: '2 days ago', active: false },
  ]

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Stack.Screen options={{ headerShown: true, title: 'Notifications' }} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {notifications.map((n) => (
          <View key={n.id} style={styles.card}>
            <Text style={styles.title}>{n.title}</Text>
            <Text style={styles.desc}>{n.description}</Text>
            <Text style={styles.time}>{n.time}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#f6f8fb', padding: 14, borderRadius: 12, marginBottom: 12 },
  title: { fontSize: 14, fontWeight: '700', color: '#1f2937', marginBottom: 4 },
  desc: { fontSize: 12, color: '#374151', marginBottom: 6 },
  time: { fontSize: 11, color: '#6b7280' },
})
