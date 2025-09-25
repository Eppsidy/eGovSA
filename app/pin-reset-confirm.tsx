import * as Crypto from 'expo-crypto'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useRef, useState } from 'react'
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useAuth } from '../src/contexts/AuthContext'
import { supabase } from '../src/lib/supabase'

export default function PinResetConfirmScreen() {
  const router = useRouter()
  const { pin: pinParam } = useLocalSearchParams<{ pin: string }>()
  const original = String(pinParam ?? '')
  const [confirmPin, setConfirmPin] = useState<string[]>(['', '', '', ''])
  const inputs = useRef<(TextInput | null)[]>([])
  const [saving, setSaving] = useState(false)
  const { savePin, updateUserProfile } = useAuth()

  const handleChange = (value: string, index: number) => {
    const arr = [...confirmPin]
    arr[index] = value.replace(/\D/g, '').slice(-1)
    setConfirmPin(arr)
    if (arr[index] && index < 3) inputs.current[index + 1]?.focus()
  }
  const toString = (arr: string[]) => arr.join('')
  const hashPin = async (plain: string) => Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, plain)

  const saveNewPin = async () => {
    const p2 = toString(confirmPin)
    if (p2.length !== 4) { Alert.alert('Incomplete', 'Enter 4 digits'); return }
    if (p2 !== original) { Alert.alert('Mismatch', 'PINs do not match'); return }

    try {
      setSaving(true)
      await savePin(p2)

      const hashed = await hashPin(p2)
      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError
      const userId = userData.user?.id
      if (!userId) throw new Error('User not found')

      const { error } = await supabase
        .from('profiles')
        .upsert({ id: userId, pin: hashed })
      if (error) throw error

      updateUserProfile({})
      Alert.alert('Success', 'Your PIN has been updated')
      router.replace('/home')
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'Failed to update PIN')
    } finally {
      setSaving(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirm PIN</Text>
      <Text style={styles.subtitle}>Re-enter your new 4-digit PIN</Text>
      <View style={styles.pinRow}>
        {confirmPin.map((d: string, i: number) => (
          <TextInput
            key={i}
            ref={el => { inputs.current[i] = el }}
            style={styles.pinInput}
            keyboardType='number-pad'
            secureTextEntry
            maxLength={1}
            value={d}
            onChangeText={v => handleChange(v, i)}
          />
        ))}
      </View>
      <TouchableOpacity style={[styles.button, (toString(confirmPin).length !== 4 || saving) && styles.buttonDisabled]} disabled={toString(confirmPin).length !== 4 || saving} onPress={saveNewPin}>
        <Text style={styles.buttonText}>{saving ? 'Saving…' : 'Save PIN'}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 80, backgroundColor: '#FFF' },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 8, color: '#222' },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 16 },
  pinRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  pinInput: { width: 60, height: 70, borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 14, textAlign: 'center', fontSize: 30, backgroundColor: '#FAFAFA' },
  button: { backgroundColor: '#de6c0fff', paddingVertical: 16, borderRadius: 12, alignItems: 'center', shadowColor: '#de6c0fff', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
  buttonDisabled: { backgroundColor: '#A0C8E8' },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: '600' },
})
