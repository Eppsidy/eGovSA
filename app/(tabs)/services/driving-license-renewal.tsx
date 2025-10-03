import React from 'react'
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native'

export default function DrivingLicenseRenewal() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Driving License Renewal</Text>

        <Text style={styles.body}>
          You must renew your driving licence card four weeks before its expiry date. 
          If you renew it after the expiry date, you will have to apply for a temporary 
          driving licence at an additional cost while waiting for your new licence card 
          to be issued.
        </Text>

        <Text style={styles.body}>
          Note: You will not be required to take a driving test when you renew your licence. 
          You will undergo eye testing and your fingerprints will be taken. Alternatively, 
          you can have your eyes tested by an optometrist and submit the report at the 
          driving licence testing centre (DLTC). If your sight has worsened since your licence 
          was issued, new conditions will be attached to your licence.
        </Text>

        <Text style={styles.subtitle}>What you should do</Text>
        <Text style={styles.body}>Go to your nearest DLTC with the following:</Text>
        <Text style={styles.body}>• Identity document (ID) and a copy of your ID, old driving licence card or valid South African passport</Text>
        <Text style={styles.body}>• Four black-and-white ID photographs (confirm the exact number required with the DLTC)</Text>
        <Text style={styles.body}>• Proof of residential address (e.g. utility bill). If not in your name, the owner must provide an affidavit confirming you live there, with the bill attached</Text>
        <Text style={styles.body}>• If you stay at an informal settlement, bring a stamped letter from your ward councillor confirming your address</Text>
        <Text style={styles.body}>• Prescribed application fee</Text>
        <Text style={styles.body}>
          • Apply online here:{" "}
          <Text style={styles.link} onPress={() => Linking.openURL('https://online.natis.gov.za/#/')}>
            https://online.natis.gov.za/#/
          </Text>
        </Text>
        <Text style={styles.body}>• Complete form DL1: Application for renewal of driving licence card</Text>
        <Text style={styles.body}>• Complete the Notification of Change of Address or Particulars (NCP) form</Text>
        <Text style={styles.body}>• Undergo an eye test (or submit results from an optometrist)</Text>

        <Text style={styles.subtitle}>How long does it take?</Text>
        <Text style={styles.body}>Your new driving licence will be ready in 4 to 6 weeks.</Text>

        <Text style={styles.subtitle}>How much does it cost?</Text>
        <Text style={styles.body}>Contact your local licensing office for the cost.</Text>

        <Text style={styles.subtitle}>Forms to complete</Text>
        <Text style={styles.body}>Application for renewal of driver’s licence (DL1) – available at your DLTC.</Text>

        <Text style={styles.subtitle}>Who to contact</Text>
        <Text style={styles.body}>Contact your relevant municipality for further assistance.</Text>
      </View>
    </ScrollView>
  )
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
  title: { fontSize: 20, fontWeight: '800', color: '#0f172a', marginBottom: 12 },
  subtitle: { marginTop: 16, fontSize: 16, fontWeight: '700', color: '#334155' },
  body: { marginTop: 8, fontSize: 14, color: '#475569', lineHeight: 20 },
  link: { color: '#2563eb', textDecorationLine: 'underline' },
})
