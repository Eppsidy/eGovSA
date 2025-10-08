import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import Header from '../../src/components/Header'
import { useAuth } from '../../src/contexts/AuthContext'
import { updateProfile, UpdateProfileRequest } from '../../src/lib/api'

export default function PersonalInfoScreen() {
  const { user, refreshUser } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    idNumber: '',
    residentialAddress: '',
    postalAddress: '',
  })

  useEffect(() => {
    loadProfile()
  }, [user])

  const loadProfile = async () => {
    if (!user?.id) {
      setLoading(false)
      return
    }

    try {
      // Use data from AuthContext (Supabase) which uses snake_case
      setFormData({
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.date_of_birth || '',
        gender: user.gender || '',
        idNumber: user.id_number || '',
        residentialAddress: user.residential_address || '',
        postalAddress: user.postal_address || '',
      })
      setLoading(false)
    } catch (error) {
      console.error('Failed to load profile:', error)
      Alert.alert('Error', 'Failed to load profile data')
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!user?.id) return

    setSaving(true)
    try {
      const updateData: UpdateProfileRequest = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        idNumber: formData.idNumber,
        residentialAddress: formData.residentialAddress,
        postalAddress: formData.postalAddress,
        fullName: `${formData.firstName} ${formData.lastName}`.trim(),
      }

      console.log('Sending update to backend:', updateData)
      console.log('ID Number being sent:', formData.idNumber)

      await updateProfile(user.id, updateData)
      
      console.log('Profile updated via backend, refreshing from Supabase...')
      
      // Wait a moment for the database to reflect changes
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Refresh the user data from Supabase to get the updated profile
      await refreshUser()
      
      console.log('Profile refresh complete')
      
      Alert.alert('Success', 'Profile updated successfully', [
        { text: 'OK', onPress: () => router.back() }
      ])
    } catch (error) {
      console.error('Failed to update profile:', error)
      Alert.alert('Error', 'Failed to update profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <View style={styles.page}>
        <Header />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E67E22" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.page}>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.title}>Personal Information</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>BASIC INFORMATION</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              value={formData.firstName}
              onChangeText={(text) => setFormData({ ...formData, firstName: text })}
              placeholder="Enter first name"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              value={formData.lastName}
              onChangeText={(text) => setFormData({ ...formData, lastName: text })}
              placeholder="Enter last name"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              placeholder="Enter email"
              placeholderTextColor="#9ca3af"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              placeholder="Enter phone number"
              placeholderTextColor="#9ca3af"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PERSONAL DETAILS</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date of Birth</Text>
            <TextInput
              style={styles.input}
              value={formData.dateOfBirth}
              onChangeText={(text) => setFormData({ ...formData, dateOfBirth: text })}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.genderContainer}>
              {['Male', 'Female', 'Other'].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.genderButton,
                    formData.gender === option && styles.genderButtonActive
                  ]}
                  onPress={() => setFormData({ ...formData, gender: option })}
                >
                  <Text style={[
                    styles.genderButtonText,
                    formData.gender === option && styles.genderButtonTextActive
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>ID Number</Text>
            <TextInput
              style={styles.input}
              value={formData.idNumber}
              onChangeText={(text) => {
                console.log('ID Number input changed to:', text)
                setFormData({ ...formData, idNumber: text })
              }}
              placeholder="Enter ID number"
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ADDRESS INFORMATION</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Residential Address</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.residentialAddress}
              onChangeText={(text) => setFormData({ ...formData, residentialAddress: text })}
              placeholder="Enter residential address"
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Postal Address</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.postalAddress}
              onChangeText={(text) => setFormData({ ...formData, postalAddress: text })}
              placeholder="Enter postal address"
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#f6f8fb' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingText: { fontSize: 14, color: '#6b7280' },
  scrollContent: { padding: 16, paddingBottom: 100 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  title: { fontSize: 20, fontWeight: '800', color: '#111827' },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#6b7280',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  inputGroup: { marginBottom: 16 },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  textArea: {
    minHeight: 80,
    paddingTop: 12,
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  genderButtonActive: {
    backgroundColor: '#E67E22',
    borderColor: '#E67E22',
  },
  genderButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
  },
  genderButtonTextActive: {
    color: '#fff',
  },
  saveButton: {
    backgroundColor: '#E67E22',
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
    shadowColor: '#E67E22',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '800',
  },
})

