import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useRef, useState } from 'react'
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { supabase } from '../src/lib/supabase'

export default function PinRecoverScreen() {
  const router = useRouter()
  const { email: emailParam } = useLocalSearchParams<{ email?: string }>()
  const [email, setEmail] = useState(emailParam ?? '')
  const emailLocked = !!emailParam
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [sending, setSending] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [sentOnce, setSentOnce] = useState(false)
  const inputs = useRef<(TextInput | null)[]>([])

  useEffect(() => {
    // Autofocus first OTP box after sending
    if (sentOnce) inputs.current[0]?.focus()
  }, [sentOnce])

  const isValidEmail = (e: string) => /[^\s@]+@[^\s@]+\.[^\s@]+/.test(e)

  const sendOTP = async () => {
    if (!email || !isValidEmail(email)) { Alert.alert('Invalid email', 'Please enter a valid email'); return }
    try {
      setSending(true)
      const { error } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: false } })
      if (error) throw error
      setSentOnce(true)
      Alert.alert('OTP Sent', `We sent a 6-digit code to ${email}`)
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'Failed to send OTP')
    } finally {
      setSending(false)
    }
  }

  const handleChange = (value: string, index: number) => {
    const next = value.replace(/\D/g, '').slice(-1)
    const arr = [...otp]
    arr[index] = next
    setOtp(arr)
    if (next && index < 5) inputs.current[index + 1]?.focus()
  }

  const verify = async () => {
    const token = otp.join('')
    if (token.length !== 6) { Alert.alert('Incomplete', 'Please enter the full 6-digit code'); return }
    try {
      setVerifying(true)
      const { data, error } = await supabase.auth.verifyOtp({ email, token, type: 'email' })
      if (error) throw error
      if (!data.session) { Alert.alert('Verification failed', 'Please try again'); return }
      // Move to PIN reset; session is now active so we can update profile
  router.replace('/pin-reset')
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'Failed to verify code')
    } finally {
      setVerifying(false)
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.back} onPress={() => email ? router.replace({ pathname: '/pin-login', params: { email } }) : router.replace('/pin-login')}>
          <Text style={styles.backText}>Back to PIN</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Recover PIN</Text>
        <Text style={styles.subtitle}>Enter your email to receive a 6-digit code</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder='you@example.com'
            keyboardType='email-address'
            autoCapitalize='none'
            editable={!emailLocked}
          />
        </View>

        <TouchableOpacity style={[styles.button, (!isValidEmail(email) || sending) && styles.buttonDisabled]} disabled={!isValidEmail(email) || sending} onPress={sendOTP}>
          <Text style={styles.buttonText}>{sending ? 'Sending…' : sentOnce ? 'Resend Code' : 'Send OTP'}</Text>
        </TouchableOpacity>

        {sentOnce && (
          <>
            <Text style={[styles.subtitle, { marginTop: 24 }]}>Enter the 6-digit code</Text>
            <View style={styles.codeRow}>
              {otp.map((d, i) => (
                <TextInput
                  key={i}
                  ref={el => { inputs.current[i] = el }}
                  style={styles.codeInput}
                  keyboardType='number-pad'
                  maxLength={1}
                  value={d}
                  onChangeText={v => handleChange(v, i)}
                />
              ))}
            </View>
            <TouchableOpacity style={[styles.button, (otp.join('').length !== 6 || verifying) && styles.buttonDisabled]} disabled={otp.join('').length !== 6 || verifying} onPress={verify}>
              <Text style={styles.buttonText}>{verifying ? 'Verifying…' : 'Verify & Continue'}</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 80, backgroundColor: '#FFF' },
  back: { marginBottom: 12, alignSelf: 'flex-start' },
  backText: { color: '#de6c0fff', fontSize: 14, fontWeight: '500' },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 8, color: '#222' },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 16 },
  formGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '500', marginBottom: 8, color: '#444' },
  input: { borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 10, padding: 14, fontSize: 16, backgroundColor: '#FAFAFA' },
  button: { backgroundColor: '#de6c0fff', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 10, shadowColor: '#de6c0fff', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
  buttonDisabled: { backgroundColor: '#A0C8E8' },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: '600' },
  codeRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, marginBottom: 16 },
  codeInput: { width: 50, height: 60, borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 10, textAlign: 'center', fontSize: 24, backgroundColor: '#FAFAFA' },
})
