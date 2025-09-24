import { useRouter } from 'expo-router'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export default function GetStartedScreen() {
  const router = useRouter()
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.headerContainer}>
          <Text style={styles.welcomeText}>Welcome to</Text>
          <Text style={styles.appTitle}>eGovSA</Text>
          <Text style={styles.subtitle}>Digital Government Services</Text>
        </View>
        <View style={styles.benefitsContainer}>
          <Text style={styles.benefitsTitle}>Access government services:</Text>
          <View style={styles.benefitItem}><Text style={styles.benefitIcon}>📋</Text><Text style={styles.benefitText}>Apply for documents and permits</Text></View>
          <View style={styles.benefitItem}><Text style={styles.benefitIcon}>💳</Text><Text style={styles.benefitText}>Pay bills and taxes securely</Text></View>
          <View style={styles.benefitItem}><Text style={styles.benefitIcon}>📱</Text><Text style={styles.benefitText}>Track application status</Text></View>
          <View style={styles.benefitItem}><Text style={styles.benefitIcon}>🔒</Text><Text style={styles.benefitText}>Secure digital identity</Text></View>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.getStartedButton} onPress={() => router.push('/registration')}>
          <Text style={styles.buttonText}>Let&apos;s Get Started</Text>
        </TouchableOpacity>
        <Text style={styles.termsText}>By continuing, you agree to our Terms of Service and Privacy Policy</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'space-between' },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 80 },
  headerContainer: { alignItems: 'center', marginBottom: 60 },
  welcomeText: { fontSize: 24, color: '#666', marginBottom: 8 },
  appTitle: { fontSize: 48, fontWeight: 'bold', color: '#0066CC', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#888', textAlign: 'center' },
  benefitsContainer: { paddingHorizontal: 20 },
  benefitsTitle: { fontSize: 20, fontWeight: '600', color: '#333', marginBottom: 24, textAlign: 'center' },
  benefitItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, paddingHorizontal: 16 },
  benefitIcon: { fontSize: 24, marginRight: 16, width: 32 },
  benefitText: { fontSize: 16, color: '#555', flex: 1 },
  buttonContainer: { paddingHorizontal: 24, paddingBottom: 40 },
  getStartedButton: { backgroundColor: '#0066CC', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginBottom: 16, shadowColor: '#0066CC', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
  buttonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' },
  termsText: { fontSize: 12, color: '#999', textAlign: 'center', lineHeight: 16 },
})