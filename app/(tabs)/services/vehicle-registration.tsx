import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { JSX } from 'react/jsx-runtime'

export default function VehicleRegistration(): JSX.Element {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Vehicle Registration</Text>

        <Text style={styles.body}>
          If you are a title holder of a new, pre-owned, built or re-built motor vehicle, 
          you must register it at your relevant registering authority to get a registration certificate. 
          If the vehicle is financed, the title holder will be the financing institution. 
          Once registered and licensed, you will receive a motor vehicle licence disc.
        </Text>

        <Text style={styles.body}>
          You must register and license your vehicle within 21 days after a change of ownership. 
          Failure to do so will result in arrears and penalties. Vehicle registrations are recorded on 
          the National Traffic Information System (eNaTIS).
        </Text>

        <Text style={styles.subtitle}>When registration becomes invalid</Text>
        <Text style={styles.body}>
          • Licence disc not renewed for more than 4 years{"\n"}
          • Vehicle permanently unfit for use after accident{"\n"}
          • Vehicle sold (change of ownership){"\n"}
          • Vehicle repossessed for more than 31 days{"\n"}
          • Deregistration certificate has been issued
        </Text>

        <Text style={styles.subtitle}>Register a new vehicle</Text>
        <Text style={styles.body}>
          To register a new vehicle, go to your registering authority and submit:
          {"\n\n"}• Your identity document (ID)
          {"\n"}• Proof of residential address (e.g. utility bill). 
          {"\n"}   – If not in your name, provide affidavit + bill{"\n"}
          {"\n"}• Letter from ward councillor if in informal settlement{"\n"}
          {"\n"}• Manufacturer's certificate with vehicle details{"\n"}
          {"\n"}• Roadworthy certificate (for heavy load / RTQS vehicles)
          {"\n\n"}Complete the RLV form (Application for Registration and Licensing of Motor Vehicle).
        </Text>

        <Text style={styles.subtitle}>Register a used vehicle</Text>
        <Text style={styles.body}>
          The seller must first submit a Notification of Change of Ownership (NCO). 
          Then, provide:
          {"\n\n"}• Your ID{"\n"}
          • Proof of residential address{"\n"}
          • Vehicle registration certificate (in seller’s name){"\n"}
          • Roadworthy certificate (if older than 60 days){"\n"}
          • Proof of purchase{"\n"}
          • Valid licence (fees must be up to date)
          {"\n\n"}Complete the RLV form.
        </Text>

        <Text style={styles.subtitle}>Register a vehicle built up from parts</Text>
        <Text style={styles.body}>
          Submit the following at your nearest registration authority:
          {"\n\n"}• ID{"\n"}
          • Proof of address{"\n"}
          • Affidavit (form SOA) confirming parts origin/work done{"\n"}
          • Request for police clearance (form RPC){"\n"}
          • Request for police identification (form RPI){"\n"}
          • Deregistration certificate (if deregistered){"\n"}
          • Weighbridge certificate{"\n"}
          • Proof of title ownership{"\n"}
          • Letter of authority (if applicable){"\n\n"}
          Provincial helpdesk will capture the record on eNaTIS. 
          A roadworthy test must also be performed. 
          Complete the RLV form.
        </Text>

        <Text style={styles.subtitle}>Register a modified vehicle</Text>
        <Text style={styles.body}>
          Submit the following at your registration authority:
          {"\n\n"}• ID{"\n"}
          • Proof of address{"\n"}
          • Affidavit (form SOA){"\n"}
          • Police clearance (RPC) & identification (RPI){"\n"}
          • Deregistration certificate (if deregistered){"\n"}
          • Weighbridge certificate{"\n"}
          • Proof of title ownership{"\n"}
          • Roadworthy certificate{"\n"}
          • Letter of authority (if applicable){"\n"}
          • Manufacturer’s certificate or previous registration certificate 
            (or affidavit if unavailable)
          {"\n\n"}Complete the RLV form.
        </Text>

        <Text style={styles.subtitle}>Processing time</Text>
        <Text style={styles.body}>
          The application is sent to the provincial helpdesk. 
          Vehicle record introduction may take a few days. 
          The applicant will be contacted once the record is active on eNaTIS.
        </Text>

        <Text style={styles.subtitle}>Cost</Text>
        <Text style={styles.body}>
          Contact your local licensing office for fees.
        </Text>

        <Text style={styles.subtitle}>Forms</Text>
        <Text style={styles.body}>
          Forms are available at the motor vehicle registration authority 
          or downloadable from the eNaTIS website.
        </Text>

        <Text style={styles.subtitle}>Who to contact</Text>
        <Text style={styles.body}>
          Contact your local Department of Transport.
        </Text>
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
    elevation: 2 
  },
  title: { fontSize: 20, fontWeight: '800', color: '#0f172a', marginBottom: 8 },
  subtitle: { marginTop: 16, fontSize: 16, fontWeight: '600', color: '#334155' },
  body: { marginTop: 8, fontSize: 14, color: '#475569', lineHeight: 20 },
})
