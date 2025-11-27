import { useRouter } from 'expo-router'
import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useThemeColor } from '../../src/hooks/useThemeColor'

export default function GetStartedScreen() {
  const router = useRouter()
  const colors = useThemeColor()

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={styles.headerContainer}>
          <Text style={[styles.welcomeText, { color: colors.textSecondary }]}>Welcome to</Text>
          <Text style={[styles.appTitle, { color: colors.primary }]}>eGovSA</Text>
          <Image
                      source={require('../../assets/images/splash.png')}
                      resizeMode="contain"
                      style={styles.logoImage}
                    />
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>South African Digital Government Services</Text>
        </View>
        <View style={styles.benefitsContainer}>
          <Text style={[styles.benefitsTitle, { color: colors.text }]}>Government services available:</Text>
          <View style={styles.benefitItem}><Text style={styles.benefitIcon}>📋</Text><Text style={[styles.benefitText, { color: colors.textSecondary }]}>Tax services</Text></View>
          <View style={styles.benefitItem}><Text style={styles.benefitIcon}>📋</Text><Text style={[styles.benefitText, { color: colors.textSecondary }]}>Home Affairs services</Text></View>
          <View style={styles.benefitItem}><Text style={styles.benefitIcon}>📋</Text><Text style={[styles.benefitText, { color: colors.textSecondary }]}>License application and renewals</Text></View>
          <View style={styles.benefitItem}><Text style={styles.benefitIcon}>📋</Text><Text style={[styles.benefitText, { color: colors.textSecondary }]}>Tracking services requests</Text></View>
          <View style={styles.benefitItem}><Text style={styles.benefitIcon}>📋</Text><Text style={[styles.benefitText, { color: colors.textSecondary }]}>Payments</Text></View>
          <View style={styles.benefitItem}><Text style={styles.benefitIcon}>📋</Text><Text style={[styles.benefitText, { color: colors.textSecondary }]}>Feedback Provider</Text></View>
          <View style={styles.benefitItem}><Text style={styles.benefitIcon}>📋</Text><Text style={[styles.benefitText, { color: colors.textSecondary }]}>More</Text></View>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.getStartedButton} onPress={() => router.push('/login/registration')}>
          <Text style={styles.buttonText}>Let&apos;s Get Started</Text>
        </TouchableOpacity>
        <Text style={[styles.termsText, { color: colors.textMuted }]}>By continuing, you agree to our Terms of Service and Privacy Policy</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'space-between' },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 50 },
  headerContainer: { alignItems: 'center', marginBottom: 30 },
  welcomeText: { fontSize: 20, marginBottom: 4, fontWeight:'bold' },
  appTitle: { fontSize: 32, fontWeight: 'bold', marginBottom: 4 },
  subtitle: { fontSize: 13, textAlign: 'center' },
  benefitsContainer: { paddingHorizontal: 10 },
  benefitsTitle: { fontSize: 18, fontWeight: '600', marginBottom: 16, textAlign: 'center' },
  benefitItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, paddingHorizontal: 8 },
  benefitIcon: { fontSize: 18, marginRight: 12, width: 24 },
  benefitText: { fontSize: 14, flex: 1 },
  buttonContainer: { paddingHorizontal: 20, paddingBottom: 30 },
  getStartedButton: { backgroundColor: '#de6c0fff', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginBottom: 12, shadowColor: '#0066CC', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  termsText: { fontSize: 11, textAlign: 'center', lineHeight: 14 },
  logoImage: { width: 100, height: 100, marginVertical: 12 },
})