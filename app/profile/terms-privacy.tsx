import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import Header from '../../src/components/Header'

export default function TermsPrivacyScreen() {
  return (
    <View style={styles.page}>
      <Header />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Terms & Privacy</Text>
        <Text style={styles.subtitle}>Legal information</Text>
        <View style={styles.card}> 
          <Text style={styles.paragraph}>
            This is a placeholder for Terms of Service and Privacy Policy content. Replace with your
            app's legal text and links to full documents.
          </Text>
          <Text style={styles.paragraph}>
            Your privacy and security are important. We follow best practices to protect your data.
          </Text>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#f6f8fb' },
  content: { padding: 16, paddingBottom: 40 },
  title: { fontSize: 18, fontWeight: '800', color: '#111827' },
  subtitle: { fontSize: 12, color: '#6b7280', marginBottom: 12 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  paragraph: { fontSize: 13, color: '#334155', marginBottom: 10, lineHeight: 20 },
})
