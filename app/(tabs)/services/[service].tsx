import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
export default function ServiceDetailScreen() {
  const params = useLocalSearchParams<{ service?: string; title?: string }>()
  const title = (params.title as string) || 'Service'

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>This is a placeholder screen for {title}.</Text>
        <Text style={styles.body}>We will add the full flow and integrations here later.</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f7f7f8',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  title: { fontSize: 20, fontWeight: '800', color: '#0f172a' },
  subtitle: { marginTop: 8, fontSize: 14, color: '#334155' },
  body: { marginTop: 12, fontSize: 14, color: '#475569' },
})
