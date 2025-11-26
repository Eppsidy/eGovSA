import { useRouter } from 'expo-router'
import React, { useMemo, useState } from 'react'
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useThemeColor } from '../../src/hooks/useThemeColor'
import { supabase } from '../../src/lib/supabase'

export default function LoginEmailScreen() {
  const router = useRouter()
  const colors = useThemeColor()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const isValidEmail = useMemo(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email.trim())
  }, [email])

  const handleContinue = async () => {
    const trimmed = email.trim()
    if (!isValidEmail) {
      Alert.alert('Invalid Email', 'Please enter a valid email address')
      return
    }
    setLoading(true)
    try {
      // Check via RPC to safely bypass RLS without exposing data
      const { data, error } = await supabase.rpc('email_exists', { p_email: trimmed })
      if (error) {
        console.error('email_exists RPC error:', error)
        Alert.alert(
          'Unable to verify email',
          'We could not verify your email at the moment. Please try again shortly.'
        )
        return
      }
      if (data === true) {
        router.push({ pathname: '/login/pin-login', params: { email: trimmed } })
      } else {
        Alert.alert(
          'Email not found',
          'We could not find an account with that email. You can try a different email or create a new account.',
          [
            { text: 'Try again' },
            { text: 'Create account', onPress: () => router.push('/login/registration') },
          ]
        )
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>Welcome back</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Enter your email to continue</Text>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Email Address</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
            value={email}
            onChangeText={setEmail}
            placeholder='you@example.com'
            placeholderTextColor={colors.textMuted}
            keyboardType='email-address'
            autoCapitalize='none'
            autoComplete='email'
            autoCorrect={false}
            returnKeyType='done'
            onSubmitEditing={handleContinue}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, (!isValidEmail || loading) && styles.buttonDisabled]}
          onPress={handleContinue}
          disabled={!isValidEmail || loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Checking…' : 'Continue'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/login/registration')} style={styles.linkContainer}>
          <Text style={[styles.linkText, { color: colors.primary }]}>New here? Create an account</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 80 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: 16, marginBottom: 32 },
  formGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '500', marginBottom: 8 },
  input: { borderWidth: 1, borderRadius: 10, padding: 14, fontSize: 16 },
  button: { backgroundColor: '#de6c0fff', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 10, shadowColor: '#de6c0fff', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
  buttonDisabled: { backgroundColor: '#f2bb8fff' },
  buttonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' },
  linkContainer: { marginTop: 16, alignItems: 'center' },
  linkText: { fontSize: 14, fontWeight: '500' },
})
