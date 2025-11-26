import { useRouter } from 'expo-router'
import React, { useRef, useState } from 'react'
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useThemeColor } from '../../src/hooks/useThemeColor'

export default function PinResetScreen() {
  const router = useRouter()
  const colors = useThemeColor()
  const [pin, setPin] = useState<string[]>(['', '', '', ''])
  const inputs = useRef<(TextInput | null)[]>([])
  

  const handleChange = (value: string, index: number) => {
    const arr = [...pin]
    arr[index] = value.replace(/\D/g, '').slice(-1)
    setPin(arr)
    if (arr[index] && index < 3) inputs.current[index + 1]?.focus()
  }
  const toString = (arr: string[]) => arr.join('')

  const goToConfirm = () => {
    const p1 = toString(pin)
    if (p1.length !== 4) { Alert.alert('Incomplete', 'Enter 4 digits'); return }
    router.replace(`/login/pin-reset-confirm?pin=${encodeURIComponent(p1)}`)
  }

  const renderInputs = () => {
    const arr = pin
    return (
      <View style={styles.pinRow}>
        {arr.map((d: string, i: number) => (
          <TextInput
            key={i}
            ref={el => { inputs.current[i] = el }}
            style={[styles.pinInput, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
            keyboardType='number-pad'
            secureTextEntry
            maxLength={1}
            value={d}
            onChangeText={v => handleChange(v, i)}
          />
        ))}
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Reset PIN</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Create a new 4-digit PIN</Text>
      {renderInputs()}
      <TouchableOpacity style={[styles.button, (toString(pin).length !== 4) && styles.buttonDisabled]} disabled={toString(pin).length !== 4} onPress={goToConfirm}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 80 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: 16, marginBottom: 16 },
  pinRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  pinInput: { width: 60, height: 70, borderWidth: 1, borderRadius: 14, textAlign: 'center', fontSize: 30 },
  button: { backgroundColor: '#de6c0fff', paddingVertical: 16, borderRadius: 12, alignItems: 'center', shadowColor: '#de6c0fff', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
  buttonDisabled: { backgroundColor: '#fba158ff' },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: '600' },
})
