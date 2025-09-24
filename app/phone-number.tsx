import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useState } from 'react'
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { supabase } from '../src/lib/supabase'

export default function PhoneNumberScreen() {
  const router = useRouter()
  const { email, firstName, lastName } = useLocalSearchParams<{ email:string; firstName:string; lastName:string }>()
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [verifying, setVerifying] = useState(false)

  const normalizedPhone = (raw: string) => raw.replace(/\s+/g, '')

  const sendOtp = async () => {
    const p = normalizedPhone(phone)
    if (!p) { Alert.alert('Phone required', 'Enter phone number first'); return }
    // Basic sanity check; Supabase/Twilio will perform strict validation server-side
    if (!/^\+?[0-9]{10,15}$/.test(p)) {
      Alert.alert('Invalid phone format', 'Use international format, e.g. +27821234567')
      return
    }
    try {
      setSending(true)
      const { error } = await supabase.auth.signInWithOtp({ phone: p })
      if (error) {
        Alert.alert('Failed to send code', error.message)
        return
      }
      setSent(true)
      Alert.alert('Code sent', 'We sent a verification code via SMS')
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'Something went wrong sending the code')
    } finally {
      setSending(false)
    }
  }

  const verifyOtp = async () => {
    const p = normalizedPhone(phone)
    if (!p) { Alert.alert('Phone required', 'Enter phone number first'); return }
    if (otp.length !== 6) { Alert.alert('Invalid code', 'Enter the 6-digit code'); return }
    try {
      setVerifying(true)
      const { data, error } = await supabase.auth.verifyOtp({
        phone: p,
        token: otp,
        type: 'sms',
      })
      if (error) {
        Alert.alert('Verification failed', error.message)
        return
      }
      // On success, proceed to PIN setup with collected params
      router.push({ pathname: '/pin-setup', params: { email, firstName, lastName, phone: p } })
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'Something went wrong verifying the code')
    } finally {
      setVerifying(false)
    }
  }
  return (
    <KeyboardAvoidingView style={{ flex:1 }} behavior={Platform.OS==='ios'? 'padding': undefined}>
      <View style={styles.container}>
        <Text style={styles.title}>Verify Your Phone</Text>
        <Text style={styles.subtitle}>Enter your mobile number for account security</Text>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder='e.g. +27821234567'
            keyboardType='phone-pad'
            autoCapitalize='none'
          />
          <Text style={styles.hint}>Use full international format, e.g. +27 for South Africa</Text>
        </View>
        {!sent && (
          <TouchableOpacity
            style={[styles.button, (!phone || sending) && styles.buttonDisabled]}
            disabled={!phone || sending}
            onPress={sendOtp}
          >
            {sending ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Send Code</Text>}
          </TouchableOpacity>
        )}
        {sent && (
          <>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Enter OTP</Text>
              <TextInput
                style={styles.input}
                value={otp}
                onChangeText={setOtp}
                placeholder='123456'
                keyboardType='number-pad'
                maxLength={6}
              />
            </View>
            <TouchableOpacity
              style={[styles.button, (otp.length !== 6 || verifying) && styles.buttonDisabled]}
              disabled={otp.length !== 6 || verifying}
              onPress={verifyOtp}
            >
              {verifying ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Verify Code</Text>}
            </TouchableOpacity>
          </>
        )}
        <Text style={styles.progressText}>Step 3 of 5</Text>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container:{ flex:1, paddingHorizontal:24, paddingTop:80, backgroundColor:'#FFF'},
  title:{ fontSize:28, fontWeight:'700', marginBottom:8, color:'#222' },
  subtitle:{ fontSize:16, color:'#666', marginBottom:32 },
  formGroup:{ marginBottom:20 },
  label:{ fontSize:14, fontWeight:'500', marginBottom:8, color:'#444' },
  input:{ borderWidth:1, borderColor:'#E0E0E0', borderRadius:10, padding:14, fontSize:16, backgroundColor:'#FAFAFA' },
  button:{ backgroundColor:'#0066CC', paddingVertical:16, borderRadius:12, alignItems:'center', marginTop:10, shadowColor:'#0066CC', shadowOffset:{ width:0, height:4 }, shadowOpacity:0.3, shadowRadius:8, elevation:6 },
  buttonDisabled:{ backgroundColor:'#A0C8E8' },
  buttonText:{ color:'#FFF', fontSize:18, fontWeight:'600' },
  progressText:{ textAlign:'center', marginTop:32, color:'#999', fontSize:12 },
  hint:{ marginTop:6, color:'#888', fontSize:12 },
})