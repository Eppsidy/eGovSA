import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function VATReturns() {
  const [amount, setAmount] = useState('');
  const [vatAmount, setVatAmount] = useState<string | null>(null);
  const [isInclusive, setIsInclusive] = useState(false);

  const calculateVAT = () => {
    const value = parseFloat(amount);
    if (isNaN(value)) {
      Alert.alert('Invalid input', 'Please enter a valid number');
      return;
    }
    const rate = 0.15;
    let result = 0;

    if (isInclusive) {
      // VAT inclusive
      result = value - value / (1 + rate);
    } else {
      // VAT exclusive
      result = value * rate;
    }

    setVatAmount(result.toFixed(2));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        {/* Title */}
        <Text style={styles.title}>VAT Returns</Text>

        {/* Summary & Introduction */}
        <Text style={styles.body}>
          The purpose of this webpage is to assist vendors/tax practitioners to complete the Value-Added Tax (VAT201) return accurately and honestly. Included in this webpage are the steps on how to request, complete, submit the VAT201 return, and make payments.
        </Text>

        <Text style={styles.subtitle}>Introduction</Text>
        <Text style={styles.body}>
          The South African Revenue Service (SARS) has been modernising and simplifying tax processes in line with international best practice...
        </Text>

        <Text style={styles.subtitle}>Requesting the VAT201 Return</Text>
        <Text style={styles.body}>
          Vendors can request VAT201 Returns via eFiling, Contact Centre, or at a SARS office. eFiling provides additional submission days and is recommended.
        </Text>

        <Text style={styles.subtitle}>Registering on eFiling for VAT Purposes</Text>
        <Text style={styles.body}>
          A vendor must be registered as an eFiler to submit VAT201 returns and make VAT payments via eFiling. Applies to Individuals, Tax Practitioners, Organisations (Companies, Trusts, etc.).
        </Text>

        {/* VAT Calculator Section */}
        <Text style={[styles.subtitle, { marginTop: 20 }]}>VAT Calculator</Text>
        <Text style={styles.body}>Calculating VAT for VAT-inclusive and VAT-exclusive prices in South Africa (15%).</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter gross salary amount"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />

        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, isInclusive && styles.toggleActive]}
            onPress={() => setIsInclusive(true)}
          >
            <Text style={[styles.toggleText, isInclusive && styles.toggleTextActive]}>VAT Inclusive</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, !isInclusive && styles.toggleActive]}
            onPress={() => setIsInclusive(false)}
          >
            <Text style={[styles.toggleText, !isInclusive && styles.toggleTextActive]}>VAT Exclusive</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.calcButton} onPress={calculateVAT}>
          <Text style={styles.calcButtonText}>Calculate VAT</Text>
        </TouchableOpacity>

        {vatAmount !== null && (
          <Text style={styles.result}>VAT Amount: R {vatAmount}</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f7f7f8' },
  card: { backgroundColor: '#fff', borderRadius: 14, padding: 16, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  title: { fontSize: 22, fontWeight: '800', color: '#0f172a', marginBottom: 12 },
  subtitle: { fontSize: 18, fontWeight: '700', color: '#334155', marginTop: 16 },
  body: { marginTop: 8, fontSize: 14, color: '#475569', lineHeight: 20 },
  input: { marginTop: 12, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, fontSize: 16 },
  toggleContainer: { flexDirection: 'row', marginTop: 12 },
  toggleButton: { flex: 1, padding: 10, borderWidth: 1, borderColor: '#0f172a', borderRadius: 8, marginRight: 5, alignItems: 'center' },
  toggleActive: { backgroundColor: '#0f172a' },
  toggleText: { color: '#0f172a', fontWeight: '600' },
  toggleTextActive: { color: '#fff' },
  calcButton: { marginTop: 12, backgroundColor: '#0f172a', padding: 12, borderRadius: 8, alignItems: 'center' },
  calcButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  result: { marginTop: 12, fontSize: 16, fontWeight: '600', color: '#0f172a' },
});
