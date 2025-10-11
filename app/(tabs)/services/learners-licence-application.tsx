import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../../src/contexts/AuthContext';
import { createApplication, updateProfile } from '../../../src/lib/api';

export default function LearnersLicenceApplication() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [resAddress, setResAddress] = useState('');
  const [postalAddress, setPostalAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  // Calendar & Time slot states
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [timeSlot, setTimeSlot] = useState('');

  const [eyeColor, setEyeColor] = useState('');
  const [height, setHeight] = useState('');
  const [glasses, setGlasses] = useState('');
  const [medical, setMedical] = useState('');

  // Auto-populate fields from user profile
  useEffect(() => {
    if (user) {
      if (user.full_name) setFullName(user.full_name);
      else if (user.first_name && user.last_name) setFullName(`${user.first_name} ${user.last_name}`);
      
      if (user.id_number) setIdNumber(user.id_number);
      if (user.date_of_birth) setDob(user.date_of_birth);
      if (user.gender) setGender(user.gender);
      if (user.residential_address) setResAddress(user.residential_address);
      if (user.postal_address) setPostalAddress(user.postal_address);
      if (user.phone) setPhone(user.phone);
      if (user.email) setEmail(user.email);
    }
  }, [user]);

  // Handle calendar selection
  const handleDateChange = (event: any, date?: Date | undefined) => {
    setShowCalendar(false); // close picker after selection
    if (date) {
      setSelectedDate(date);

      // Assign automatic time slot based on chosen date
      const slots = ['09:00 AM', '11:00 AM', '01:00 PM', '03:00 PM'];
      const randomSlot = slots[Math.floor(Math.random() * slots.length)];
      setTimeSlot(randomSlot);
    }
  };

  const handleSubmit = async () => {
    if (!fullName || !idNumber || !dob || !gender || !resAddress || !phone || !email || !selectedDate) {
      Alert.alert('Validation Error', 'Please fill in all required fields including appointment date.');
      return;
    }

    setLoading(true);

    try {
      // Update profile with any missing information
      if (user?.id) {
        const updateData: any = {};
        
        // Parse full name into first and last name if needed
        if (!user.first_name || !user.last_name) {
          const nameParts = fullName.trim().split(' ');
          if (!user.first_name && nameParts.length > 0) updateData.firstName = nameParts[0];
          if (!user.last_name && nameParts.length > 1) updateData.lastName = nameParts.slice(1).join(' ');
        }
        
        if (!user.id_number && idNumber.trim()) updateData.idNumber = idNumber;
        if (!user.date_of_birth && dob.trim()) updateData.dateOfBirth = dob;
        if (!user.gender && gender.trim()) updateData.gender = gender;
        if (!user.residential_address && resAddress.trim()) updateData.residentialAddress = resAddress;
        if (!user.postal_address && postalAddress.trim()) updateData.postalAddress = postalAddress;
        if (!user.phone && phone.trim()) updateData.phone = phone;
        if (!user.email && email.trim()) updateData.email = email;

        // Only call API if there's data to update
        if (Object.keys(updateData).length > 0) {
          console.log('Updating profile with missing data:', updateData);
          await updateProfile(user.id, updateData);
        }
      }

      // Create application in backend
      if (user?.id) {
        const applicationData = {
          fullName,
          idNumber,
          dob,
          gender,
          resAddress,
          postalAddress,
          phone,
          email,
          appointmentDate: selectedDate.toISOString(),
          timeSlot,
          eyeColor,
          height,
          glasses,
          medical,
        };

        await createApplication(user.id, {
          serviceType: 'Learners Licence Application',
          applicationData: JSON.stringify(applicationData),
        });

        console.log('Learners licence application created successfully');
      }

      Alert.alert(
        'Form Submitted',
        `Thank you ${fullName}, your application has been received.\n\nAppointment Date: ${selectedDate.toDateString()}\nTime Slot: ${timeSlot}`
      );
    } catch (error) {
      console.error('Error submitting learners licence application:', error);
      Alert.alert('Error', 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Learner’s Licence Application</Text>

        {/* Personal Details */}
        <Text style={styles.sectionTitle}>Personal Details</Text>

        <TextInput style={styles.input} placeholder="Full Name (as per ID)" value={fullName} onChangeText={setFullName} />

        <TextInput style={styles.input} placeholder="ID Number" keyboardType="numeric" value={idNumber} onChangeText={setIdNumber} />

        <TextInput style={styles.input} placeholder="Date of Birth (YYYY-MM-DD)" value={dob} onChangeText={setDob} />

        <Picker
          selectedValue={gender}
          style={styles.picker}
          onValueChange={(itemValue: string) => setGender(itemValue)}
        >
          <Picker.Item label="Select Gender" value="" />
          <Picker.Item label="Male" value="Male" />
          <Picker.Item label="Female" value="Female" />
          <Picker.Item label="Other" value="Other" />
        </Picker>
        

        <TextInput style={styles.input} placeholder="Residential Address" value={resAddress} onChangeText={setResAddress} />

        <TextInput style={styles.input} placeholder="Postal Address (if different)" value={postalAddress} onChangeText={setPostalAddress} />

        <TextInput style={styles.input} placeholder="Phone Number" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />

        <TextInput style={styles.input} placeholder="Email Address" keyboardType="email-address" value={email} onChangeText={setEmail} />

        {/* Appointment Section */}
        <Text style={styles.sectionTitle}>Book Appointment</Text>
        <TouchableOpacity style={styles.dateButton} onPress={() => setShowCalendar(true)}>
          <Text style={styles.dateButtonText}>{selectedDate ? selectedDate.toDateString() : 'Select Date'}</Text>
        </TouchableOpacity>

        {timeSlot ? (
          <View style={styles.timeSlotBox}>
            <Text style={styles.timeSlotText}>Assigned Time Slot: {timeSlot}</Text>
          </View>
        ) : null}

        {showCalendar && (
          <DateTimePicker
            value={selectedDate || new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            minimumDate={new Date()}
            onChange={handleDateChange}
          />
        )}

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
          <Text style={styles.submitButtonText}>{loading ? 'Submitting...' : 'Submit Application'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f7f7f8' },
  card: { backgroundColor: '#fff', borderRadius: 14, padding: 16, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  title: { fontSize: 22, fontWeight: '800', color: '#0f172a', marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#334155', marginTop: 16, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 12, fontSize: 16 },
  picker: { height: 50, width: '100%', marginBottom: 12 },
  label: { fontSize: 14, color: '#475569', marginBottom: 4 },
  dateButton: { backgroundColor: '#475569', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 10 },
  dateButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  timeSlotBox: { backgroundColor: '#e0f2fe', padding: 10, borderRadius: 8, marginBottom: 12 },
  timeSlotText: { color: '#0369a1', fontSize: 15, fontWeight: '600' },
  submitButton: { backgroundColor: '#475569', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
