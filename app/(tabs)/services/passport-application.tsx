import React, { useEffect, useState } from 'react'
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useAuth } from '../../../src/contexts/AuthContext'
import { createApplication, createAppointment, updateProfile } from '../../../src/lib/api'

export default function PassportApplication() {
  const { user } = useAuth()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [idNumber, setIdNumber] = useState('')
  const [appointment, setAppointment] = useState<Date | null>(null)
  const [loading, setLoading] = useState(false)

  // Auto-populate fields from user profile
  useEffect(() => {
    if (user) {
      if (user.first_name) setFirstName(user.first_name)
      if (user.last_name) setLastName(user.last_name)
      if (user.id_number) setIdNumber(user.id_number)
    }
  }, [user])

  async function submitPassportForm() {
    if (!firstName.trim() || !lastName.trim() || !idNumber.trim()) {
      Alert.alert('Missing fields', 'Please fill in all fields before submitting.')
      return
    }
    // simple SA ID check: 13 digits
    if (!/^\d{13}$/.test(idNumber)) {
      Alert.alert('Invalid ID', 'ID number must be 13 digits.')
      return
    }

    setLoading(true)

    try {
      // Update profile with any missing information
      if (user?.id) {
        const updateData: any = {}
        
        if (!user.first_name && firstName.trim()) updateData.firstName = firstName
        if (!user.last_name && lastName.trim()) updateData.lastName = lastName
        if (!user.id_number && idNumber.trim()) updateData.idNumber = idNumber

        // Only call API if there's data to update
        if (Object.keys(updateData).length > 0) {
          // console.log('Updating profile with missing data:', updateData)
          await updateProfile(user.id, updateData)
        }
      }

      // Create application in backend
      let createdApplicationId = null
      if (user?.id) {
        const applicationData = {
          firstName,
          lastName,
          idNumber,
        }

        const application = await createApplication(user.id, {
          serviceType: 'Passport Application',
          applicationData: JSON.stringify(applicationData),
        })

        createdApplicationId = application.id
        // console.log('Passport application created successfully')
      }

      const assigned = generateRandomAppointment()
      
      // Create appointment in backend
      if (user?.id && createdApplicationId) {
        const locations = [
          { name: 'your nearest Home Affairs', address: '123 Main St, Johannesburg, 2000' },
          { name: 'your nearest Home Affairs', address: '456 Church St, Pretoria, 0001' },
          { name: 'your nearest Home Affairs', address: '789 Adderley St, Cape Town, 8001' },
        ]
        const randomLocation = locations[Math.floor(Math.random() * locations.length)]

        await createAppointment({
          userId: user.id,
          applicationId: createdApplicationId,
          appointmentDate: assigned.toISOString(),
          appointmentTime: assigned.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          serviceType: 'Passport Application',
          location: randomLocation.name,
          locationAddress: randomLocation.address,
          status: 'Scheduled',
          notes: 'Please bring original ID document and passport photos',
        })

        // console.log('Appointment created successfully')
      }

      setAppointment(assigned)
      Alert.alert('Submitted', `Application submitted for ${firstName} ${lastName}.\nYour appointment: ${assigned.toLocaleString()}`)
      setFirstName(''); setLastName(''); setIdNumber('')
    } catch (error) {
      console.error('Error submitting passport application:', error)
      Alert.alert('Error', 'Failed to submit application. Please try again.')
    } finally {
      setLoading(false)
    }
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
          <TouchableOpacity style={styles.submit} onPress={submitPassportForm} accessibilityRole="button" disabled={loading}>
            <Text style={styles.submitText}>{loading ? 'Submitting...' : 'Submit application'}</Text>
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
