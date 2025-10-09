import React, { useState } from 'react'
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

export default function PassportApplication() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [idNumber, setIdNumber] = useState('')
  const [appointment, setAppointment] = useState<Date | null>(null)

  function submitPassportForm() {
    if (!firstName.trim() || !lastName.trim() || !idNumber.trim()) {
      Alert.alert('Missing fields', 'Please fill in all fields before submitting.')
      return
    }
    // simple SA ID check: 13 digits
    if (!/^\d{13}$/.test(idNumber)) {
      Alert.alert('Invalid ID', 'ID number must be 13 digits.')
      return
    }
    const assigned = generateRandomAppointment()
    setAppointment(assigned)
    Alert.alert('Submitted', `Application submitted for ${firstName} ${lastName}.\nYour appointment: ${assigned.toLocaleString()}`)
    setFirstName(''); setLastName(''); setIdNumber('')
  }

  function generateRandomAppointment() {
    // pick a random day between 3 and 21 days from now
    const daysOut = Math.floor(Math.random() * (21 - 3 + 1)) + 3
    const base = new Date()
    base.setDate(base.getDate() + daysOut)

    // ensure weekday (Mon-Fri)
    while (base.getDay() === 0 || base.getDay() === 6) {
      base.setDate(base.getDate() + 1)
    }

    // random hour between 9 and 16, minute 0 or 30
    const hour = Math.floor(Math.random() * (16 - 9 + 1)) + 9
    const minute = Math.random() < 0.5 ? 0 : 30
    base.setHours(hour, minute, 0, 0)
    return base
  }
  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.card} contentContainerStyle={{ padding: 16, paddingBottom: 140 }} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Passport Application</Text>
  <Text style={styles.body}>A passport is a document issued by a national government for international travel; it certifies the identity and nationality of the holder.</Text>

  <Text style={styles.body}>Applicants should note that, in terms of section 26(B) of the South African Citizenship Act, 1995, it is a punishable offence for a South African citizen aged 18 years and older to leave or enter South Africa on a foreign passport.</Text>

  <Text style={styles.body}>When you apply for a passport, whether in South Africa or overseas, you must apply in person because the passport officer needs to verify several things:</Text>

  <Text style={styles.body}>• The passport officer must be satisfied that your identity is legal and valid.</Text>
  <Text style={styles.body}>• The passport officer must check that your photograph is a true image of yourself.</Text>
  <Text style={styles.body}>• Your fingerprints must be taken (for people aged 16 years or older) and checked against the National Population Register.</Text>
        <Text style={styles.body}>The Department of Home Affairs is replacing the green ID book with a smart ID card. This process began in 2014 and will take place over several years. You may not receive a smart ID card immediately when you apply. If you already have an ID, you will be invited to apply for the smart ID card when your turn comes.</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Apply online — enter your details</Text>
          <TextInput value={firstName} onChangeText={setFirstName} placeholder="First name" style={styles.input} />
          <TextInput value={lastName} onChangeText={setLastName} placeholder="Surname" style={styles.input} />
          <TextInput value={idNumber} onChangeText={setIdNumber} placeholder="ID number (13 digits)" style={styles.input} keyboardType="number-pad" />
          <TouchableOpacity style={styles.submit} onPress={submitPassportForm} accessibilityRole="button">
            <Text style={styles.submitText}>Submit application</Text>
          </TouchableOpacity>
          {appointment ? (
            <View style={{ marginTop: 12 }}>
              <Text style={{ fontWeight: '700' }}>Assigned appointment</Text>
              <Text style={{ color: '#374151' }}>{appointment.toLocaleString()}</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f7f7f8' },
  card: { backgroundColor: '#fff', borderRadius: 14, padding: 16, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  title: { fontSize: 20, fontWeight: '800', color: '#0f172a' },
  body: { marginTop: 12, fontSize: 14, color: '#475569' },
  form: { marginTop: 20 },
  label: { fontSize: 16, fontWeight: '600', color: '#0f172a' },
  input: { height: 40, borderColor: '#ccc', borderWidth: 1, borderRadius: 5, paddingHorizontal: 10, marginBottom: 10 },
  submit: { backgroundColor: '#0f172a', padding: 10, borderRadius: 5 },
  submitText: { color: '#fff', textAlign: 'center' },
})
