import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import Header from '../../src/components/Header'
import { useThemeColor } from '../../src/hooks/useThemeColor'

export default function TermsPrivacyScreen() {
  const colors = useThemeColor()
  return (
    <View style={[styles.page, { backgroundColor: colors.background }]}>
      <Header />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Terms & Privacy</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>Legal information</Text>
        
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          {/* TERMS OF SERVICE */}
          <Text style={[styles.sectionHeader, { color: colors.text }]}>Terms of Service</Text>
          
          <Text style={[styles.subheading, { color: colors.text }]}>1. Acceptance of Terms</Text>
          <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
            By accessing and using the eGov SA application, you agree to be bound by these Terms of Service. 
            If you do not agree to these terms, please do not use this application.
          </Text>

          <Text style={[styles.subheading, { color: colors.text }]}>2. Eligibility</Text>
          <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
            You must be a South African citizen or legal resident with valid identification to use this service. 
            Users must be 18 years or older, or have parental/guardian consent if under 18.
          </Text>

          <Text style={[styles.subheading, { color: colors.text }]}>3. Account Registration</Text>
          <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
            • You must provide accurate, current, and complete information during registration{'\n'}
            • You are responsible for maintaining the confidentiality of your login credentials{'\n'}
            • You must notify us immediately of any unauthorized use of your account{'\n'}
            • One account per person; multiple accounts are prohibited
          </Text>

          <Text style={[styles.subheading, { color: colors.text }]}>4. Acceptable Use</Text>
          <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
            You agree NOT to:{'\n'}
            • Use the app for any unlawful purpose or fraudulent activity{'\n'}
            • Attempt to gain unauthorized access to our systems or other users' accounts{'\n'}
            • Submit false information or documents{'\n'}
            • Use automated systems or bots to access the service{'\n'}
            • Interfere with the proper functioning of the application
          </Text>

          <Text style={[styles.subheading, { color: colors.text }]}>5. Services Provided</Text>
          <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
            eGov SA provides access to:{'\n'}
            • eHomeAffairs: ID applications, smart ID cards, birth/death certificates, marriage certificates{'\n'}
            • eNatis: Driver's license renewals, vehicle registration, traffic fine payments{'\n'}
            • eFiling: Tax submissions, returns filing, SARS correspondence
          </Text>

          <Text style={[styles.subheading, { color: colors.text }]}>6. Service Availability</Text>
          <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
            • We strive for 99% uptime but cannot guarantee uninterrupted service{'\n'}
            • Scheduled maintenance will be communicated in advance where possible{'\n'}
            • Government systems may affect service availability
          </Text>

          <Text style={[styles.subheading, { color: colors.text }]}>7. Fees and Payments</Text>
          <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
            • Government fees apply as per official tariffs from Home Affairs, Natis, and SARS{'\n'}
            • Payment processing fees may apply{'\n'}
            • All fees are non-refundable once services are rendered
          </Text>

          <Text style={[styles.subheading, { color: colors.text }]}>8. Intellectual Property</Text>
          <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
            All content, trademarks, and data on this application are the property of the South African 
            Government and eGov SA. Unauthorized use is prohibited.
          </Text>

          <Text style={[styles.subheading, { color: colors.text }]}>9. Limitation of Liability</Text>
          <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
            eGov SA acts as an intermediary platform. We are not liable for:{'\n'}
            • Decisions made by government departments{'\n'}
            • Processing delays by government entities{'\n'}
            • Loss of data due to force majeure events{'\n'}
            • Technical issues beyond our reasonable control
          </Text>

          <Text style={[styles.subheading, { color: colors.text }]}>10. Governing Law</Text>
          <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
            These terms are governed by the laws of the Republic of South Africa. Any disputes will be 
            resolved in South African courts.
          </Text>

          <Text style={[styles.subheading, { color: colors.text }]}>11. Contact Information</Text>
          <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
            For questions about these terms:{'\n'}
            • Email: legal@egovsa.gov.za{'\n'}
            • Phone: 0800 123 456
          </Text>

          {/* PRIVACY POLICY */}
          <Text style={[styles.sectionHeader, styles.marginTop, { color: colors.text }]}>Privacy Policy</Text>
          
          <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
            Your privacy and security are paramount. We are committed to protecting your personal information 
            in compliance with the Protection of Personal Information Act (POPIA), 2013.
          </Text>

          <Text style={[styles.subheading, { color: colors.text }]}>1. Information We Collect</Text>
          <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
            Personal Information:{'\n'}
            • Full name, ID number, date of birth{'\n'}
            • Contact details (phone, email, physical address){'\n'}
            • Biometric data (for verification purposes){'\n'}
            • Financial information (for payment processing){'\n'}
            • Vehicle and driver's license information{'\n'}
            • Tax reference numbers and employment details{'\n'}
            • Supporting documents{'\n\n'}
            
            Technical Information:{'\n'}
            • Device information and operating system{'\n'}
            • IP address and location data{'\n'}
            • App usage statistics{'\n'}
            • Log files and crash reports
          </Text>

          <Text style={[styles.subheading, { color: colors.text }]}>2. How We Collect Information</Text>
          <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
            • Direct input during registration and service applications{'\n'}
            • Document uploads and biometric verification{'\n'}
            • Automated collection through app usage{'\n'}
            • Third-party verification services
          </Text>

          <Text style={[styles.subheading, { color: colors.text }]}>3. Purpose of Collection</Text>
          <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
            We collect your information to:{'\n'}
            • Verify your identity and prevent fraud{'\n'}
            • Process government service applications{'\n'}
            • Facilitate communication with government departments{'\n'}
            • Improve our services and user experience{'\n'}
            • Comply with legal and regulatory requirements{'\n'}
            • Provide customer support
          </Text>

          <Text style={[styles.subheading, { color: colors.text }]}>4. Information Sharing</Text>
          <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
            We share your information with:{'\n'}
            • Government Departments: Home Affairs, Natis, SARS (as required for service delivery){'\n'}
            • Payment Processors: Secure third-party payment gateways{'\n'}
            • Verification Services: Identity verification providers{'\n'}
            • Legal Authorities: When required by law or court order{'\n\n'}
            
            We do NOT sell your personal information to third parties.
          </Text>

          <Text style={[styles.subheading, { color: colors.text }]}>5. Data Security</Text>
          <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
            We implement industry-standard security measures:{'\n'}
            • End-to-end encryption for data transmission{'\n'}
            • Secure cloud storage with regular backups{'\n'}
            • Multi-factor authentication options{'\n'}
            • Regular security audits and penetration testing{'\n'}
            • Access controls and employee confidentiality agreements
          </Text>

          <Text style={[styles.subheading, { color: colors.text }]}>6. Data Retention</Text>
          <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
            • Active account data: Retained while your account is active{'\n'}
            • Transaction records: 7 years (as required by law){'\n'}
            • Support communications: 3 years{'\n'}
            • Inactive accounts: Deleted after 2 years of inactivity
          </Text>

          <Text style={[styles.subheading, { color: colors.text }]}>7. Your Rights (Under POPIA)</Text>
          <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
            You have the right to:{'\n'}
            • Access your personal information{'\n'}
            • Request correction of inaccurate data{'\n'}
            • Object to processing of your information{'\n'}
            • Request deletion of your data (subject to legal requirements){'\n'}
            • Withdraw consent (where applicable){'\n'}
            • Lodge a complaint with the Information Regulator
          </Text>

          <Text style={[styles.subheading, { color: colors.text }]}>8. Cookies and Tracking</Text>
          <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
            We use:{'\n'}
            • Essential cookies: For app functionality and security{'\n'}
            • Analytics cookies: To understand app usage (anonymized){'\n'}
            • Preference cookies: To remember your settings{'\n\n'}
            
            You can manage cookie preferences in the app settings.
          </Text>

          <Text style={[styles.subheading, { color: colors.text }]}>9. Children's Privacy</Text>
          <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
            Users under 18 require parental/guardian consent. We do not knowingly collect information from 
            children without proper authorization.
          </Text>

          <Text style={[styles.subheading, { color: colors.text }]}>10. Data Breach Notification</Text>
          <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
            In the event of a data breach, we will notify affected users and the Information Regulator 
            within 72 hours as required by law.
          </Text>

          <Text style={[styles.subheading, { color: colors.text }]}>11. Contact Us</Text>
          <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
            For privacy concerns or to exercise your rights:{'\n'}
            • Privacy Officer Email: privacy@egovsa.gov.za{'\n'}
            • Phone: 0800 123 456{'\n'}
            • Address: eGov SA Privacy Office, 123 Government Avenue, Pretoria, 0001{'\n'}
            • Information Regulator: complaints.IR@justice.gov.za | 012 406 4818
          </Text>

          <Text style={[styles.subheading, { color: colors.text }]}>12. Consent</Text>
          <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
            By using eGov SA, you consent to the collection and use of your information as described in 
            this Privacy Policy.
          </Text>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  page: { 
    flex: 1
  },
  content: { 
    padding: 16, 
    paddingBottom: 40 
  },
  title: { 
    fontSize: 18, 
    fontWeight: '800',
    marginBottom: 4
  },
  subtitle: { 
    fontSize: 12,
    marginBottom: 12 
  },
  card: { 
    borderRadius: 12, 
    padding: 16, 
    shadowColor: '#000', 
    shadowOpacity: 0.06, 
    shadowRadius: 6, 
    shadowOffset: { width: 0, height: 2 },
    elevation: 2
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    marginTop: 8
  },
  subheading: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8
  },
  paragraph: { 
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 12
  },
  marginTop: {
    marginTop: 24
  },
  footerText: {
    marginTop: 20,
    fontWeight: '600',
    textAlign: 'center'
  }
})
