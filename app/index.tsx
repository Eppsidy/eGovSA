import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Dimensions, Image, StyleSheet, Text, View } from 'react-native'
import { useAuth } from '../src/contexts/AuthContext'

export default function Index() {
  const router = useRouter()
  const { session, user, loading, checkPinExists } = useAuth()
  const [hasChecked, setHasChecked] = useState(false)

  useEffect(() => {
    const decide = async () => {
      if (loading) return
      try {
        if (session && user) {
          router.replace('/home')
          return
        }
        if (await checkPinExists()) {
          router.replace('/login/pin-login')
          return
        }
        // New user – go to onboarding after splash delay
        setTimeout(() => router.replace('/login/get-started'), 1800)
      } finally {
        setHasChecked(true)
      }
    }
    decide()
  }, [session, user, loading, router, checkPinExists])

  // Splash UI (was SplashScreen)
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.logoPlaceholder}>
          <Image
            source={require('../assets/images/j-G6PUes.jpg')}
            resizeMode="contain"
            style={styles.logoImage}
          />
          <Text style={styles.appName}>eGovSA</Text>
          <Text style={styles.tagline}>National Digital Services</Text>
        </View>
      </View>
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#de6c0fff" />
        <Text style={styles.loadingText}>{loading || !hasChecked ? 'Loading...' : 'Starting...'}</Text>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Digital Government Services</Text>
        <Text style={styles.versionText}>Version 1.0</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 60 },
  logoContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logoPlaceholder: { alignItems: 'center', padding: 20 },
  logoImage: { width: Math.min(Dimensions.get('window').width * 0.55, 260), height: Math.min(Dimensions.get('window').width * 0.55, 260), marginBottom: 12 },
  appName: { fontSize: 32, fontWeight: 'bold', color: '#de6c0fff', letterSpacing: 1 },
  tagline: { marginTop: 4, fontSize: 14, color: '#555', letterSpacing: 0.5 },
  loadingContainer: { alignItems: 'center', marginBottom: 40 },
  loadingText: { fontSize: 16, color: '#666', marginTop: 12 },
  footer: { alignItems: 'center' },
  footerText: { fontSize: 16, color: '#333', fontWeight: '500' },
  versionText: { fontSize: 12, color: '#999', marginTop: 4 },
})



