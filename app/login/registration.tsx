import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useThemeColor } from '../../src/hooks/useThemeColor'

export default function RegistrationScreen() {
  const router = useRouter()
  const colors = useThemeColor()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [loading] = useState(false)

  const handleNext = () => {
    if (!firstName || !lastName || !email) { Alert.alert('Missing Information', 'Please fill in all fields'); return }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) { Alert.alert('Invalid Email', 'Please enter a valid email address'); return }
    router.push({ pathname: '/login/email-otp', params: { email, firstName, lastName } })
  }

  return (
    <KeyboardAvoidingView style={{ flex:1 }} behavior={Platform.OS==='ios'? 'padding': undefined}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>Create Your Account</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Enter your information to get started</Text>
        <View style={styles.formGroup}><Text style={[styles.label, { color: colors.text }]}>First Name</Text><TextInput style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]} value={firstName} onChangeText={setFirstName} placeholder='First Name' placeholderTextColor={colors.textMuted} autoCapitalize='words' /></View>
        <View style={styles.formGroup}><Text style={[styles.label, { color: colors.text }]}>Last Name</Text><TextInput style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]} value={lastName} onChangeText={setLastName} placeholder='Last Name' placeholderTextColor={colors.textMuted} autoCapitalize='words' /></View>
        <View style={styles.formGroup}><Text style={[styles.label, { color: colors.text }]}>Email Address</Text><TextInput style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]} value={email} onChangeText={setEmail} placeholder='you@example.com' placeholderTextColor={colors.textMuted} keyboardType='email-address' autoCapitalize='none' /></View>
        <TouchableOpacity style={[styles.button, (!firstName||!lastName||!email)&&styles.buttonDisabled]} onPress={handleNext} disabled={loading||!firstName||!lastName||!email}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/login/login-email')} style={styles.linkContainer}>
          <Text style={[styles.linkText, { color: colors.primary }]}>Already have an account? Login</Text>
        </TouchableOpacity>
  <Text style={[styles.progressText, { color: colors.textMuted }]}>Step 1 of 4</Text>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container:{ flex:1, paddingHorizontal:24, paddingTop:80 },
  title:{ fontSize:28,fontWeight:'700',marginBottom:8 },
  subtitle:{ fontSize:16,marginBottom:32 },
  formGroup:{ marginBottom:20 },
  label:{ fontSize:14,fontWeight:'500',marginBottom:8 },
  input:{ borderWidth:1,borderRadius:10,padding:14,fontSize:16 },
  button:{ backgroundColor:'#de6c0fff',paddingVertical:16,borderRadius:12,alignItems:'center',marginTop:10,shadowColor:'#de6c0fff',shadowOffset:{width:0,height:4},shadowOpacity:0.3,shadowRadius:8,elevation:6},
  buttonDisabled:{ backgroundColor:'#f2bb8fff'},
  buttonText:{ color:'#FFFFFF',fontSize:18,fontWeight:'600'},
  linkContainer:{ marginTop:16, alignItems:'center' },
  linkText:{ fontSize:14, fontWeight:'500' },
  progressText:{ textAlign:'center',marginTop:24,fontSize:12 },
})