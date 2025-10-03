import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Header from '../../src/components/Header'

export default function PersonalInfoScreen() {
  return (
    <View style={styles.page}>
      <Header />
      <View style={styles.content}>
        <Text style={styles.title}>Personal Information</Text>
        <Text style={styles.subtitle}>This is a placeholder screen. Wire this to your edit form later.</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#f6f8fb' },
  content: { padding: 16 },
  title: { fontSize: 18, fontWeight: '800', color: '#111827', marginBottom: 6 },
  subtitle: { fontSize: 12, color: '#6b7280' },
})
