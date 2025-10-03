import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Header from '../../src/components/Header'

export default function AppointmentsScreen() {
  return (
    <View style={styles.page}>
      <Header />
      <View style={styles.content}>
        <Text style={styles.title}>Appointments</Text>
        <Text style={styles.subtitle}>Scheduled visits</Text>
        <View style={styles.card}> 
          <Text style={styles.empty}>No upcoming appointments.</Text>
          <Text style={styles.smallNote}>Schedule a visit for services like Smart ID, Passport, or testing centers.</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#f6f8fb' },
  content: { padding: 16 },
  title: { fontSize: 18, fontWeight: '800', color: '#111827' },
  subtitle: { fontSize: 12, color: '#6b7280', marginBottom: 12 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  empty: { fontSize: 14, fontWeight: '700', color: '#1f2937', marginBottom: 6 },
  smallNote: { fontSize: 12, color: '#6b7280' },
})
