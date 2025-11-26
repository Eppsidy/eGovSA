import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import Header from '../../src/components/Header'
import { useThemeColor } from '../../src/hooks/useThemeColor'

export default function HelpCenterScreen() {
 const colors = useThemeColor()
 return (
    <View style={[styles.page, { backgroundColor: colors.background }]}>
      <Header />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Help Center</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>FAQs and guides</Text>
        
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          {/* GETTING STARTED */}
          <Text style={[styles.sectionHeader, { color: colors.text }]}>Getting Started</Text>
          
          <Text style={[styles.question, { color: colors.text }]}>How do I register for eGov SA?</Text>
          <Text style={[styles.answer, { color: colors.textSecondary }]}>
            1. Download the eGov SA app from Google Play or Apple App Store{'\n'}
            2. Tap "Sign Up" on the welcome screen{'\n'}
            3. Enter your ID number, phone number, and email address{'\n'}
            4. Create a secure password (minimum 8 characters){'\n'}
            5. Verify your email address and phone number with OTP codes{'\n'}
            6. Complete biometric verification (selfie and ID upload){'\n'}
            7. Wait for account approval (usually 24-48 hours)
          </Text>

          <Text style={[styles.question, { color: colors.text }]}>How do I verify my account?</Text>
          <Text style={[styles.answer, { color: colors.textSecondary }]}>
            After registration, you'll need to:{'\n'}
            • Upload a clear photo of your ID document (both sides){'\n'}
            • Take a selfie for facial recognition{'\n'}
            • Verify your phone number with an SMS code{'\n'}
            • Verify your email with a confirmation link{'\n'}
            • Wait for our team to review and approve your account
          </Text>

          <Text style={[styles.question, { color: colors.text }]}>I forgot my password. How do I reset it?</Text>
          <Text style={[styles.answer, { color: colors.textSecondary }]}>
            1. On the login screen, tap "Forgot Password"{'\n'}
            2. Enter your registered email address or phone number{'\n'}
            3. Check your email/SMS for a reset code{'\n'}
            4. Enter the code in the app{'\n'}
            5. Create a new password{'\n'}
            6. Log in with your new credentials
          </Text>

          {/* EHOMEAFFAIRS */}
          <Text style={[styles.sectionHeader, styles.sectionMargin, { color: colors.text }]}>eHomeAffairs Services</Text>
          
          <Text style={[styles.question, { color: colors.text }]}>How do I apply for a Smart ID Card?</Text>
          <Text style={[styles.answer, { color: colors.textSecondary }]}>
            1. Go to Services → eHomeAffairs → Smart ID Application{'\n'}
            2. Verify your personal details are correct{'\n'}
            3. Upload a recent passport-sized photo (white background){'\n'}
            4. Select your preferred collection office{'\n'}
            5. Pay the application fee (R140){'\n'}
            6. Book an appointment for biometric capture{'\n'}
            7. Visit the selected office on your appointment date
          </Text>

          <Text style={[styles.question, { color: colors.text }]}>How do I track my ID application?</Text>
          <Text style={[styles.answer, { color: colors.textSecondary }]}>
            1. Go to Applications → My Applications{'\n'}
            2. Select your ID application{'\n'}
            3. View the current status and estimated completion date{'\n'}
            4. You'll receive push notifications for status updates
          </Text>

          <Text style={[styles.question, { color: colors.text }]}>How do I apply for a birth certificate?</Text>
          <Text style={[styles.answer, { color: colors.textSecondary }]}>
            1. Go to Services → eHomeAffairs → Birth Certificate{'\n'}
            2. Select "For Myself" or "For Dependent"{'\n'}
            3. Enter required details (name, date of birth, place of birth, parents' details){'\n'}
            4. Upload supporting documents if required{'\n'}
            5. Pay the fee (R75 unabridged, R20 abridged){'\n'}
            6. Choose delivery method (collection or courier){'\n'}
            7. Track your application in "My Applications"
          </Text>

          {/* ENATIS */}
          <Text style={[styles.sectionHeader, styles.sectionMargin, { color: colors.text }]}>eNatis Services</Text>
          
          <Text style={[styles.question, { color: colors.text }]}>How do I renew my driver's license?</Text>
          <Text style={[styles.answer, { color: colors.textSecondary }]}>
            1. Go to Services → eNatis → License Renewal{'\n'}
            2. Verify your license details{'\n'}
            3. Complete the online eye test (if eligible){'\n'}
            4. Upload a recent photo{'\n'}
            5. Pay the renewal fee (R250){'\n'}
            6. Select a collection point{'\n'}
            7. Visit the testing center if you need to redo the eye test{'\n'}
            8. Collect your license card within 14 days
          </Text>

          <Text style={[styles.question, { color: colors.text }]}>When should I renew my license?</Text>
          <Text style={[styles.answer, { color: colors.textSecondary }]}>
            You can renew your license up to 60 days before expiry. After expiry, you have a 24-month 
            grace period, but you cannot drive with an expired license.
          </Text>

          <Text style={[styles.question, { color: colors.text }]}>How do I pay traffic fines?</Text>
          <Text style={[styles.answer, { color: colors.textSecondary }]}>
            1. Go to Services → eNatis → Traffic Fines{'\n'}
            2. Enter your ID number or license disk number{'\n'}
            3. View all outstanding fines{'\n'}
            4. Select the fines you want to pay{'\n'}
            5. Choose payment method (card, bank transfer, or instant EFT){'\n'}
            6. Complete payment{'\n'}
            7. Download your proof of payment{'\n'}
            8. Fines update within 48 hours on the system
          </Text>

          <Text style={[styles.question, { color: colors.text }]}>Can I renew my vehicle license online?</Text>
          <Text style={[styles.answer, { color: colors.textSecondary }]}>
            Yes! If:{'\n'}
            • Your vehicle is registered in your name{'\n'}
            • You have no outstanding fines or traffic offenses{'\n'}
            • Your vehicle has a valid roadworthy certificate (if required){'\n'}
            • All previous licenses have been paid{'\n\n'}
            
            Steps:{'\n'}
            1. Go to Services → eNatis → Vehicle License Renewal{'\n'}
            2. Enter your license disk number{'\n'}
            3. Verify vehicle details{'\n'}
            4. Pay the renewal fee{'\n'}
            5. Choose delivery method{'\n'}
            6. Your license will be delivered within 7-10 working days
          </Text>

          {/* EFILING */}
          <Text style={[styles.sectionHeader, styles.sectionMargin, { color: colors.text }]}>eFiling (SARS) Services</Text>
          
          <Text style={[styles.question, { color: colors.text }]}>How do I submit my tax return?</Text>
          <Text style={[styles.answer, { color: colors.textSecondary }]}>
            1. Go to Services → eFiling → Submit Tax Return{'\n'}
            2. Log in with your SARS credentials (or link your account first){'\n'}
            3. Select the tax year{'\n'}
            4. Import your IRP5 documents (auto-populated if available){'\n'}
            5. Complete all required sections (income, deductions, medical aid, etc.){'\n'}
            6. Review your return{'\n'}
            7. Submit electronically{'\n'}
            8. Save your proof of submission
          </Text>

          <Text style={[styles.question, { color: colors.text }]}>How do I check my tax refund status?</Text>
          <Text style={[styles.answer, { color: colors.textSecondary }]}>
            1. Go to Services → eFiling → Refund Status{'\n'}
            2. Log in to your SARS profile{'\n'}
            3. View your refund status and estimated payment date{'\n'}
            4. Ensure your banking details are up to date
          </Text>

          {/* PAYMENTS */}
          <Text style={[styles.sectionHeader, styles.sectionMargin, { color: colors.text }]}>Payments & Transactions</Text>
          
          <Text style={[styles.question, { color: colors.text }]}>What payment methods are accepted?</Text>
          <Text style={[styles.answer, { color: colors.textSecondary }]}>
            • Credit/Debit cards (Visa, Mastercard){'\n'}
            • Instant EFT (bank transfers){'\n'}
            • SnapScan & Zapper{'\n'}
            • Government account payments (for registered entities)
          </Text>

          <Text style={[styles.question, { color: colors.text }]}>Is it safe to pay through the app?</Text>
          <Text style={[styles.answer, { color: colors.textSecondary }]}>
            Yes! We use:{'\n'}
            • 256-bit SSL encryption{'\n'}
            • PCI DSS compliant payment gateways{'\n'}
            • No card details are stored on our servers{'\n'}
            • 3D Secure authentication for all transactions
          </Text>

          <Text style={[styles.question, { color: colors.text }]}>I made a payment, but my application is still pending</Text>
          <Text style={[styles.answer, { color: colors.textSecondary }]}>
            • Most payments reflect within 24 hours{'\n'}
            • Government processing times vary (typically 3-5 working days){'\n'}
            • Check your spam folder for payment confirmation emails{'\n'}
            • If payment was deducted but application status hasn't changed after 48 hours, 
            contact support with your reference number
          </Text>

          {/* TECHNICAL SUPPORT */}
          <Text style={[styles.sectionHeader, styles.sectionMargin, { color: colors.text }]}>Technical Support</Text>
          
          <Text style={[styles.question, { color: colors.text }]}>The app is not loading or keeps crashing</Text>
          <Text style={[styles.answer, { color: colors.textSecondary }]}>
            Try these steps:{'\n'}
            1. Check your internet connection{'\n'}
            2. Close and restart the app{'\n'}
            3. Clear app cache: Settings → Apps → eGov SA → Clear Cache{'\n'}
            4. Update to the latest version from the app store{'\n'}
            5. Restart your phone{'\n'}
            6. Uninstall and reinstall the app (your data is saved in the cloud)
          </Text>

          <Text style={[styles.question, { color: colors.text }]}>I can't upload my documents</Text>
          <Text style={[styles.answer, { color: colors.textSecondary }]}>
            • Ensure files are in supported formats: PDF, JPG, PNG (max 5MB per file){'\n'}
            • Check your internet connection{'\n'}
            • Try compressing large files{'\n'}
            • Ensure you've granted camera/storage permissions to the app{'\n'}
            • Take clear, well-lit photos of documents
          </Text>

          <Text style={[styles.question, { color: colors.text }]}>Supported devices and operating systems</Text>
          <Text style={[styles.answer, { color: colors.textSecondary }]}>
            • Android: Version 8.0 (Oreo) and above{'\n'}
            • iOS: Version 13.0 and above{'\n'}
            • Tablets are supported{'\n'}
            • Internet connection required (Wi-Fi or mobile data)
          </Text>

          {/* ACCOUNT & SECURITY */}
          <Text style={[styles.sectionHeader, styles.sectionMargin, { color: colors.text }]}>Account & Security</Text>
          
          <Text style={[styles.question, { color: colors.text }]}>How do I enable two-factor authentication?</Text>
          <Text style={[styles.answer, { color: colors.textSecondary }]}>
            1. Go to Profile → Personal Information → Security Settings{'\n'}
            2. Toggle on "Two-Factor Authentication"{'\n'}
            3. Choose your preferred method (SMS or email){'\n'}
            4. Verify with a test code{'\n'}
            5. You'll now need to enter a code each time you log in from a new device
          </Text>

          <Text style={[styles.question, { color: colors.text }]}>I think my account has been compromised</Text>
          <Text style={[styles.answer, { color: colors.textSecondary }]}>
            Immediately:{'\n'}
            1. Change your password{'\n'}
            2. Enable two-factor authentication{'\n'}
            3. Review recent activity in your account{'\n'}
            4. Contact support at security@egovsa.gov.za{'\n'}
            5. Report to authorities if fraud has occurred
          </Text>

          {/* CONTACT US */}
          <Text style={[styles.sectionHeader, styles.sectionMargin, { color: colors.text }]}>Contact Us</Text>
          
          <Text style={[styles.question, { color: colors.text }]}>Customer Support</Text>
          <Text style={[styles.answer, { color: colors.textSecondary }]}>
            • Email: support@egovsa.gov.za{'\n'}
            • Phone: 0800 123 456 (Monday-Friday, 8AM-5PM){'\n'}
            • WhatsApp: 079 123 4567{'\n'}
            • Live Chat: Available in-app (9AM-5PM)
          </Text>

          <Text style={[styles.question, { color: colors.text }]}>Response Times</Text>
          <Text style={[styles.answer, { color: colors.textSecondary }]}>
            • Live Chat: Immediate to 5 minutes{'\n'}
            • Phone: Immediate during business hours{'\n'}
            • Email: 24-48 hours{'\n'}
            • WhatsApp: Within 2 hours during business hours
          </Text>

          <Text style={[styles.question, { color: colors.text }]}>Specific Department Contacts</Text>
          <Text style={[styles.answer, { color: colors.textSecondary }]}>
            Home Affairs:{'\n'}
            • Phone: 0800 60 11 90{'\n'}
            • Website: www.dha.gov.za{'\n\n'}
            
            Natis/Driving License:{'\n'}
            • Phone: 0861 400 800{'\n'}
            • Website: www.natis.gov.za{'\n\n'}
            
            SARS:{'\n'}
            • Phone: 0800 00 7277{'\n'}
            • Website: www.sars.gov.za
          </Text>

          <Text style={[styles.answer, styles.footerText, { color: colors.text }]}>
            Still need help? Contact our support team – we're here to assist you!
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
    marginBottom: 16,
    marginTop: 8
  },
  sectionMargin: {
    marginTop: 24
  },
  question: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8
  },
  answer: { 
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 12
  },
  footerText: {
    marginTop: 20,
    fontWeight: '600',
    textAlign: 'center'
  }
})
