import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Image, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../../src/contexts/AuthContext';
import { createApplication, createAppointment, updateProfile } from '../../../src/lib/api';

export default function SmartIDApplication() {
  const { user } = useAuth();
  const [name, setName] = useState<string>('');
  const [surname, setSurname] = useState<string>('');
  const [dob, setDob] = useState<string>('');
  const [dobDate, setDobDate] = useState<Date | undefined>(undefined);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [gender, setGender] = useState<string>('');
  const [birthCertUri, setBirthCertUri] = useState<string | null>(null);
  const [parentIdUri, setParentIdUri] = useState<string | null>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [appointment, setAppointment] = useState<Date | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Auto-populate fields from user profile
  useEffect(() => {
    if (user) {
      if (user.first_name) setName(user.first_name);
      if (user.last_name) setSurname(user.last_name);
      if (user.date_of_birth) {
        setDob(user.date_of_birth);
        setDobDate(new Date(user.date_of_birth));
      }
      if (user.gender) setGender(user.gender.toLowerCase());
    }
  }, [user]);

  async function pickImage(setter: (uri: string | null) => void) {
    try {
      // require at runtime; ts-ignore avoids a compile-time error if the package isn't installed
      // @ts-ignore
      const ImagePicker: any = require('expo-image-picker');
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
      });
      // new API returns 'canceled' and assets[], older returns 'cancelled' and uri
      const canceled = (res as any).canceled ?? (res as any).cancelled ?? false;
      if (!canceled) {
        const uri = (res as any).assets?.[0]?.uri ?? (res as any).uri ?? null;
        setter(uri ?? null);
      }
    } catch (err) {
      console.warn('Image picker not available', err);
      Alert.alert('Image picker not available', 'Please install and configure expo-image-picker to enable uploads.');
    }
  }

  async function onSubmit() {
    if (!name.trim() || !surname.trim() || !dob.trim() || !gender.trim()) {
      Alert.alert('Missing information', 'Please fill in all fields before submitting.');
      return;
    }

    // Basic DOB format check YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
      Alert.alert('Invalid date', 'Please enter date of birth in YYYY-MM-DD format.');
      return;
    }

    setLoading(true);

    try {
      // Update profile with any missing information
      if (user?.id) {
        const updateData: any = {};
        
        if (!user.first_name && name.trim()) updateData.firstName = name;
        if (!user.last_name && surname.trim()) updateData.lastName = surname;
        if (!user.date_of_birth && dob.trim()) updateData.dateOfBirth = dob;
        if (!user.gender && gender.trim()) updateData.gender = gender;

        // Only call API if there's data to update
        if (Object.keys(updateData).length > 0) {
          console.log('Updating profile with missing data:', updateData);
          await updateProfile(user.id, updateData);
        }
      }

      // Create application in backend
      let createdApplicationId: string | undefined;
      if (user?.id) {
        const applicationData = {
          name,
          surname,
          dob,
          gender,
          hasBirthCertificate: !!birthCertUri,
          hasParentId: !!parentIdUri,
          hasPhoto: !!photoUri,
        };

        const createdApp = await createApplication(user.id, {
          serviceType: 'Smart ID Card Application',
          applicationData: JSON.stringify(applicationData),
        });

        createdApplicationId = createdApp.id;
        console.log('Smart ID application created successfully with ID:', createdApplicationId);
      }

      // Generate and create appointment
      const assigned = generateRandomAppointment();
      setAppointment(assigned);
      
      // Create appointment in backend with location information
      if (user?.id && createdApplicationId) {
        const locations = [
          { name: 'Pretoria Home Affairs Office', address: '230 Pretorius St, Pretoria Central, Pretoria, 0002' },
          { name: 'Johannesburg Home Affairs Office', address: '44 Harrison St, Johannesburg, 2001' },
          { name: 'Cape Town Home Affairs Office', address: '56 Barrack St, Cape Town City Centre, Cape Town, 8001' },
        ];
        
        const randomLocation = locations[Math.floor(Math.random() * locations.length)];
        
        await createAppointment({
          userId: user.id,
          applicationId: createdApplicationId,
          appointmentDate: assigned.toISOString(),
          appointmentTime: assigned.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          serviceType: 'Smart ID Card Application',
          location: randomLocation.name,
          locationAddress: randomLocation.address,
          status: 'Scheduled',
          notes: 'Please bring: Birth certificate, Parent/Guardian ID, and 2 passport-sized photos.',
        });
        
        console.log('Appointment created successfully');
      }
      
      Alert.alert('Application submitted', `Thank you ${name} ${surname}. We received your application.\nYour appointment: ${assigned.toLocaleString()}`);
      
      // clear form
      setName(''); setSurname(''); setDob(''); setGender('');
      setBirthCertUri(null); setParentIdUri(null); setPhotoUri(null);
    } catch (error) {
      console.error('Error submitting application:', error);
      Alert.alert('Error', 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const isComplete = !!(
    name.trim() &&
    surname.trim() &&
    dob.trim() &&
    gender.trim() &&
    birthCertUri &&
    parentIdUri &&
    photoUri
  );

  function generateRandomAppointment() {
    // pick a random day between 3 and 21 days from now
    const daysOut = Math.floor(Math.random() * (21 - 3 + 1)) + 3;
    const base = new Date();
    base.setDate(base.getDate() + daysOut);

    // ensure weekday (Mon-Fri)
    while (base.getDay() === 0 || base.getDay() === 6) {
      base.setDate(base.getDate() + 1);
    }

    // random hour between 9 and 16, random minute at 0 or 30
    const hour = Math.floor(Math.random() * (16 - 9 + 1)) + 9;
    const minute = Math.random() < 0.5 ? 0 : 30;
    base.setHours(hour, minute, 0, 0);
    return base;
  }
  return (
    <View style={styles.container}>
  <ScrollView style={styles.card} contentContainerStyle={{ padding: 16, paddingBottom: 140 }} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Apply for an Identity Document</Text>
  <Text style={styles.body}>If you are 16 years and older, you may apply for an identity document (ID). You will need an ID to register for your matric exams, get a driving licence, or open a bank account.</Text>

  <Text style={styles.body}>If you receive an ID with errors in the personal information, the Department of Home Affairs will replace it free of charge.</Text>

  <Text style={styles.body}>You can apply to have your ID re-issued in the following situations:</Text>

  <Text style={styles.body}>• If you are married and want to assume the surname of your spouse.</Text>
  <Text style={styles.body}>• If you are a woman and want to apply for a new ID using any of your previous surnames.</Text>
  <Text style={styles.body}>• If your ID book has been lost, stolen, or damaged.</Text>

        <Text style={styles.body}>The Department of Home Affairs is replacing the green ID book with a smart ID card. This process began in 2014 and will take place over several years. You may not receive a smart ID card immediately when you apply. If you already have an ID, you will be invited to apply for the smart ID card when your turn comes.</Text>

        {/* Simple application form */}
        <View style={styles.form}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="First name"
            value={name}
            onChangeText={setName}
            accessibilityLabel="First name"
          />

          <Text style={styles.label}>Surname</Text>
          <TextInput
            style={styles.input}
            placeholder="Surname"
            value={surname}
            onChangeText={setSurname}
            accessibilityLabel="Surname"
          />

          <Text style={styles.label}>Date of birth</Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.input}
            accessibilityRole="button"
            accessibilityLabel="Date of birth"
          >
            <Text style={dob ? undefined : { color: '#9ca3af' }}>{dob || 'YYYY-MM-DD'}</Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={dobDate ?? new Date(2000, 0, 1)}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              maximumDate={new Date()}
              onChange={(event, selected) => {
                setShowDatePicker(false);
                if (selected) {
                  setDobDate(selected);
                  const y = selected.getFullYear();
                  const m = String(selected.getMonth() + 1).padStart(2, '0');
                  const d = String(selected.getDate()).padStart(2, '0');
                  setDob(`${y}-${m}-${d}`);
                }
              }}
            />
          )}

          <Text style={styles.label}>Gender</Text>
          <View style={styles.pickerWrap}>
            <Picker
              selectedValue={gender}
              onValueChange={(v) => setGender(v)}
              mode="dropdown"
              style={{ height: 44, width: '100%' }}
            >
              <Picker.Item label="Select" value="" />
              <Picker.Item label="Male" value="male" />
              <Picker.Item label="Female" value="female" />
            </Picker>
          </View>

          <Text style={[styles.label, { marginTop: 14 }]}>Upload supporting documents</Text>
          <View style={styles.uploadRow}>
            <View style={styles.uploadCol}>
              <Text style={styles.uploadLabel}>Birth certificate</Text>
              {birthCertUri ? <Image source={{ uri: birthCertUri }} style={styles.uploadPreview} /> : null}
              <Button title="Choose file" onPress={() => pickImage(setBirthCertUri)} />
            </View>

            <View style={styles.uploadCol}>
              <Text style={styles.uploadLabel}>Parent's ID</Text>
              {parentIdUri ? <Image source={{ uri: parentIdUri }} style={styles.uploadPreview} /> : null}
              <Button title="Choose file" onPress={() => pickImage(setParentIdUri)} />
            </View>

            <View style={styles.uploadCol}>
              <Text style={styles.uploadLabel}>1 ID photo</Text>
              {photoUri ? <Image source={{ uri: photoUri }} style={styles.uploadPreview} /> : null}
              <Button title="Choose file" onPress={() => pickImage(setPhotoUri)} />
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.submit,
              { backgroundColor: '#1A2B4A', opacity: isComplete ? 1 : 0.6 },
            ]}
            onPress={onSubmit}
            accessibilityRole="button"
            disabled={!isComplete || loading}
          >
            <Text style={[styles.submitText, { color: '#ffffffff' }]}>
              {loading ? 'Submitting...' : 'Submit application'}
            </Text>
          </TouchableOpacity>
          {!isComplete ? (
            <Text style={styles.helper}>Complete all fields and upload the three documents to enable submit.</Text>
          ) : null}
          {appointment ? (
            <View style={{ marginTop: 12 }}>
              <Text style={{ fontWeight: '700' }}>Assigned appointment</Text>
              <Text style={{ color: '#374151' }}>{appointment.toLocaleString()}</Text>
            </View>
          ) : null}
        </View>
  </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f7f7f8' },
  card: { flex: 1, backgroundColor: '#fff', borderRadius: 14, padding: 16, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  title: { fontSize: 20, fontWeight: '800', color: '#0f172a' },
  body: { marginTop: 12, fontSize: 14, color: '#475569', lineHeight: 20, marginBottom: 8 },
  form: { marginTop: 18 },
  label: { fontSize: 13, color: '#334155', marginTop: 10, marginBottom: 6 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e6e9ee', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8 },
  submit: { marginTop: 14, backgroundColor: '#0f172a', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  submitText: { color: '#fff', fontWeight: '700' },
  uploadRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 8 },
  uploadCol: { width: '30%', minWidth: 110, alignItems: 'center', paddingHorizontal: 6, marginBottom: 12 },
  uploadLabel: { fontSize: 12, color: '#475569', marginBottom: 6 },
  uploadPreview: { width: 88, height: 88, borderRadius: 6, marginBottom: 6, backgroundColor: '#f0f0f0' },
  helper: { color: '#6b7280', fontSize: 13, marginTop: 8, textAlign: 'center' },
  pickerWrap: { borderWidth: 1, borderColor: '#e6e9ee', borderRadius: 8, height: 44, justifyContent: 'center' },
})

