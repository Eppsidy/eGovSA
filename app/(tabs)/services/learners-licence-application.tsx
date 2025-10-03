import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LearnersLicenceApplication() {
  const [fullName, setFullName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [resAddress, setResAddress] = useState('');
  const [postalAddress, setPostalAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Calendar & Time slot states
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [timeSlot, setTimeSlot] = useState('');

  const [eyeColor, setEyeColor] = useState('');
  const [height, setHeight] = useState('');
  const [glasses, setGlasses] = useState('');
  const [medical, setMedical] = useState('');

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

  const handleSubmit = () => {
    if (!fullName || !idNumber || !dob || !gender || !resAddress || !phone || !email || !selectedDate) {
      Alert.alert('Validation Error', 'Please fill in all required fields including appointment date.');
      return;
    }
    Alert.alert(
      'Form Submitted',
      `Thank you ${fullName}, your application has been received.\n\nAppointment Date: ${selectedDate.toDateString()}\nTime Slot: ${timeSlot}`
    );
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

        {/* Additional Information */}
        <Text style={styles.sectionTitle}>Additional Information</Text>
        <TextInput style={styles.input} placeholder="Eye Color" value={eyeColor} onChangeText={setEyeColor} />
        <TextInput style={styles.input} placeholder="Height (cm)" keyboardType="numeric" value={height} onChangeText={setHeight} />
        <TextInput style={styles.input} placeholder="Do you wear glasses/contact lenses?" value={glasses} onChangeText={setGlasses} />
        <TextInput style={styles.input} placeholder="Any medical conditions affecting driving?" value={medical} onChangeText={setMedical} />

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit Application</Text>
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
  dateButton: { backgroundColor: '#f97316', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 10 },
  dateButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  timeSlotBox: { backgroundColor: '#e0f2fe', padding: 10, borderRadius: 8, marginBottom: 12 },
  timeSlotText: { color: '#0369a1', fontSize: 15, fontWeight: '600' },
  submitButton: { backgroundColor: 'orange', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
