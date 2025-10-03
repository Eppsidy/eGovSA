import React from 'react'
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native'

export default function RequestTaxCertificates() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Request Tax Certificates</Text>

        <Text style={styles.body}>
          An employer needs to submit a reconciliation showing details of the total amount of 
          Employees’ Tax [Pay-As-You-Earn (PAYE)], Skills Development Levy (SDL), Unemployment 
          Insurance Fund (UIF) and/or Employment Tax Incentive (ETI) deducted or withheld, as well 
          as the details of Employee Tax Certificates [IRP5/IT3(a)s] issued during the tax year.
        </Text>

        <Text style={styles.subtitle}>The Monthly Employer Declaration (EMP201)</Text>
        <Text style={styles.body}>
          The amounts deducted or withheld by the employer must be paid to the South African Revenue 
          Service (SARS) monthly, by completing the Monthly Employer Declaration (EMP201). 
          The EMP201 is a payment declaration in which the employer declares the total payment together 
          with the allocations for PAYE, SDL, UIF and/or ETI.
        </Text>
        <Text style={styles.body}>
          A unique Payment Reference Number (PRN) will be pre-populated on the EMP201, which will be 
          used to link the actual payment with the relevant EMP201 payment declaration.
        </Text>
        <Text style={styles.tip}>
          💡 Top Tip: Qualifying Employers – you may claim the ETI on your EMP201 submission. 
          For more information,{" "}
          <Text style={styles.link} onPress={() => Linking.openURL('https://www.sars.gov.za')}>
            click here
          </Text>.
        </Text>

        <Text style={styles.subtitle}>The Employer Reconciliation Declarations (EMP501, EMP601, EMP701)</Text>
        <Text style={styles.body}>
          Employers must submit an accurate Employer Reconciliation Declaration (EMP501), issue Employee 
          Tax Certificates [IRP5/IT3(a)s], and if applicable, a Tax Certificate Cancellation Declaration (EMP601) 
          for the following periods:
        </Text>
        <Text style={styles.body}>• Interim period: 1 March to 31 August</Text>
        <Text style={styles.body}>• Annual period: 1 March to 28/29 February</Text>
        <Text style={styles.tip}>
          💡 Top Tip: If an employer has already submitted the EMP501, any corrections must be done via 
          the EMP501, not the EMP201.
        </Text>

        <Text style={styles.subtitle}>The Employee Tax Certificate [IRP5/IT3(a)]</Text>
        <Text style={styles.body}>
          An employer must issue an employee with an IRP5/IT3(a) where remuneration is paid or has become payable. 
          This certificate discloses the total employment remuneration earned for the year of assessment and the 
          total employees’ tax deducted or withheld.
        </Text>
        <Text style={styles.body}>
          Certificates are issued for the full year (01 March – 28/29 February) or for the period that the employee 
          was employed.
        </Text>

        <Text style={styles.subtitle}>PAYE Audit</Text>
        <Text style={styles.body}>
          Employers who are subject to an audit can view Audit Letters on eFiling and e@syFile™. Employers may also 
          upload supporting documents in response to the audit letters or submit a Request for Correction of the EMP201 
          or EMP501.
        </Text>
        <Text style={styles.body}>
          If not registered on eFiling or e@syFile™, employers can submit a Request for Correction or supporting documents 
          at their nearest SARS Branch.
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
    elevation: 2,
  },
  title: { fontSize: 20, fontWeight: '800', color: '#0f172a', marginBottom: 12 },
  subtitle: { marginTop: 16, fontSize: 16, fontWeight: '700', color: '#334155' },
  body: { marginTop: 8, fontSize: 14, color: '#475569', lineHeight: 20 },
  tip: { marginTop: 8, fontSize: 13, color: '#2563eb', fontStyle: 'italic' },
  link: { color: '#2563eb', textDecorationLine: 'underline' },
})
