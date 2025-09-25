import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

export default function RegistrationScreen() {
  const router = useRouter()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [loading] = useState(false)

  const handleNext = () => {
    if (!firstName || !lastName || !email) { Alert.alert('Missing Information', 'Please fill in all fields'); return }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) { Alert.alert('Invalid Email', 'Please enter a valid email address'); return }
    router.push({ pathname: '/email-otp', params: { email, firstName, lastName } })
  }

  return (
    <KeyboardAvoidingView style={{ flex:1 }} behavior={Platform.OS==='ios'? 'padding': undefined}>
      <View style={styles.container}>
        <Text style={styles.title}>Create Your Account</Text>
        <Text style={styles.subtitle}>Enter your information to get started</Text>
        <View style={styles.formGroup}><Text style={styles.label}>First Name</Text><TextInput style={styles.input} value={firstName} onChangeText={setFirstName} placeholder='First Name' autoCapitalize='words' /></View>
        <View style={styles.formGroup}><Text style={styles.label}>Last Name</Text><TextInput style={styles.input} value={lastName} onChangeText={setLastName} placeholder='Last Name' autoCapitalize='words' /></View>
        <View style={styles.formGroup}><Text style={styles.label}>Email Address</Text><TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder='you@example.com' keyboardType='email-address' autoCapitalize='none' /></View>
        <TouchableOpacity style={[styles.button, (!firstName||!lastName||!email)&&styles.buttonDisabled]} onPress={handleNext} disabled={loading||!firstName||!lastName||!email}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push(email ? `/pin-login?email=${encodeURIComponent(email)}` : '/pin-login')} style={styles.linkContainer}>
          <Text style={styles.linkText}>Already have an account? Login</Text>
        </TouchableOpacity>
  <Text style={styles.progressText}>Step 1 of 4</Text>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container:{ flex:1, paddingHorizontal:24, paddingTop:80, backgroundColor:'#FFFFFF'},
  title:{ fontSize:28,fontWeight:'700',marginBottom:8,color:'#222'},
  subtitle:{ fontSize:16,color:'#666',marginBottom:32},
  formGroup:{ marginBottom:20},
  label:{ fontSize:14,fontWeight:'500',marginBottom:8,color:'#444'},
  input:{ borderWidth:1,borderColor:'#E0E0E0',borderRadius:10,padding:14,fontSize:16,backgroundColor:'#FAFAFA'},
  button:{ backgroundColor:'#de6c0fff',paddingVertical:16,borderRadius:12,alignItems:'center',marginTop:10,shadowColor:'#de6c0fff',shadowOffset:{width:0,height:4},shadowOpacity:0.3,shadowRadius:8,elevation:6},
  buttonDisabled:{ backgroundColor:'#f2bb8fff'},
  buttonText:{ color:'#FFFFFF',fontSize:18,fontWeight:'600'},
  linkContainer:{ marginTop:16, alignItems:'center' },
  linkText:{ color:'#de6c0fff', fontSize:14, fontWeight:'500' },
  progressText:{ textAlign:'center',marginTop:24,color:'#999',fontSize:12},
})