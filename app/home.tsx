import { useRouter } from 'expo-router'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useAuth } from '../src/contexts/AuthContext'

export default function HomeScreen() {
  const { user, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut()
    } finally {
      const email = user?.email
      if (email) {
        router.replace(`/pin-login?email=${encodeURIComponent(email)}`)
      } else {
        router.replace('/pin-login')
      }
    }
  }
  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome{user?.first_name ? `, ${user.first_name}` : ''} 👋</Text>
      <Text style={styles.subtitle}>This is a placeholder Home Screen.</Text>
      <TouchableOpacity style={styles.button} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{ flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#FFF', paddingHorizontal:24 },
  welcome:{ fontSize:28, fontWeight:'700', marginBottom:12, color:'#222' },
  subtitle:{ fontSize:16, color:'#666', marginBottom:40, textAlign:'center' },
  button:{ backgroundColor:'#0066CC', paddingVertical:14, paddingHorizontal:28, borderRadius:12 },
  buttonText:{ color:'#FFF', fontSize:16, fontWeight:'600' },
})