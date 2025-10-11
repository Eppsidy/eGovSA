import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function BirthCertificate() {
  const [fullName, setFullName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [placeOfBirth, setPlaceOfBirth] = useState('');
  const [dob, setDob] = useState<Date | null>(null);

  const [idFile, setIdFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [proofFile, setProofFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);

  const [collectionDate, setCollectionDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState<false | 'dob' | 'collection'>(false);

  // Pick ID file
  async function pickIDFile() {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['image/*', 'application/pdf'],
      copyToCacheDirectory: true,
    });
    if (!result.canceled) setIdFile(result.assets[0]);
  }

  // Pick Proof of Birth file
  async function pickProofFile() {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['image/*', 'application/pdf'],
      copyToCacheDirectory: true,
    });
    if (!result.canceled) setProofFile(result.assets[0]);
  }

  // Handle submit
  function submitForm() {
    if (!fullName.trim() || !idNumber.trim() || !placeOfBirth.trim() || !dob || !idFile || !proofFile || !collectionDate) {
      Alert.alert('Missing fields', 'Please fill in all fields and upload all required documents.');
      return;
    }

    if (!/^\d{13}$/.test(idNumber)) {
      Alert.alert('Invalid ID', 'ID number must be 13 digits.');
      return;
    }

    Alert.alert(
      'Submitted',
      `Application submitted for ${fullName}.\nCollection Date: ${collectionDate.toDateString()}`
    );

    setFullName('');
    setIdNumber('');
    setPlaceOfBirth('');
    setDob(null);
    setIdFile(null);
    setProofFile(null);
    setCollectionDate(null);
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.card} contentContainerStyle={{ padding: 16, paddingBottom: 120 }} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Birth Certificate Application</Text>

        <Text style={styles.body}>
          A birth certificate is an official document that records the details of a person's birth, including full name, date of birth, and place of birth.
        </Text>

        <Text style={styles.body}>
          Applicants must ensure that all information provided is accurate and that all supporting documents are uploaded. Incorrect or incomplete details may delay processing.
        </Text>

        <View style={styles.form}>
          <Text style={styles.label}>Apply online — enter your details</Text>

          <TextInput
            value={fullName}
            onChangeText={setFullName}
            placeholder="Full name (as per ID)"
            style={styles.input}
          />
          <TextInput
            value={idNumber}
            onChangeText={setIdNumber}
            placeholder="ID number (13 digits)"
            keyboardType="number-pad"
            style={styles.input}
          />
          <TextInput
            value={placeOfBirth}
            onChangeText={setPlaceOfBirth}
            placeholder="Place of Birth"
            style={styles.input}
          />

          {/* Date of Birth Picker */}
          <TouchableOpacity style={styles.dateButton} onPress={() => setShowPicker('dob')}>
            <Text style={styles.dateButtonText}>
              {dob ? dob.toDateString() : 'Select Date of Birth'}
            </Text>
          </TouchableOpacity>

          {/* File Upload Buttons */}
          <TouchableOpacity style={styles.uploadButton} onPress={pickIDFile}>
            <Text style={styles.uploadText}>{idFile ? `Uploaded: ${idFile.name}` : 'Upload ID Document'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.uploadButton} onPress={pickProofFile}>
            <Text style={styles.uploadText}>{proofFile ? `Uploaded: ${proofFile.name}` : 'Upload Proof of Birth'}</Text>
          </TouchableOpacity>

          {/* Collection Date Picker */}
          <TouchableOpacity style={styles.dateButton} onPress={() => setShowPicker('collection')}>
            <Text style={styles.dateButtonText}>
              {collectionDate ? collectionDate.toDateString() : 'Select Collection Date'}
            </Text>
          </TouchableOpacity>

          {/* Date Picker Component */}
          {showPicker && (
            <DateTimePicker
              value={
                showPicker === 'dob'
                  ? dob || new Date()
                  : collectionDate || new Date()
              }
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              maximumDate={showPicker === 'dob' ? new Date() : undefined}
              minimumDate={showPicker === 'collection' ? new Date() : undefined}
              onChange={(event, selectedDate) => {
                if (showPicker === 'dob' && selectedDate) setDob(selectedDate);
                if (showPicker === 'collection' && selectedDate) setCollectionDate(selectedDate);
                setShowPicker(false);
              }}
            />
          )}

          {/* Submit */}
          <TouchableOpacity style={styles.submit} onPress={submitForm}>
            <Text style={styles.submitText}>Submit Application</Text>
          </TouchableOpacity>
          <Text style={styles.helper}>Complete all fields and upload the two documents to enable submit.</Text>

          {collectionDate && (
            <View style={{ marginTop: 12 }}>
              <Text style={{ fontWeight: '700' }}>Collection Date:</Text>
              <Text style={{ color: '#374151' }}>{collectionDate.toLocaleString()}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f7f7f8' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  title: { fontSize: 20, fontWeight: '800', color: '#0f172a' },
  body: { marginTop: 12, fontSize: 14, color: '#475569' },
  form: { marginTop: 20 },
  label: { fontSize: 16, fontWeight: '600', color: '#0f172a', marginBottom: 10 },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  uploadButton: {
    backgroundColor: '#1A2B4A',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  uploadText: { color: '#fff', fontWeight: '600' },
  dateButton: {
    backgroundColor: '#1A2B4A',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  dateButtonText: { color: '#fff', fontWeight: '600' },
  submit: { backgroundColor: '#0f172a', padding: 12, borderRadius: 5, marginTop: 10 },
  submitText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
  helper: { color: '#475569', fontSize: 12, marginTop: 4, textAlign: 'center' },
});
