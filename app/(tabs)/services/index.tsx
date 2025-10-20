import { Ionicons } from '@expo/vector-icons'
import { Link, useRouter } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import React, { useMemo } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Header from '../../../src/components/Header'

// Data model
export type ServiceCategory = {
  key: string
  title: string
  agency?: string
  status?: 'Available' | 'Unavailable' | string
  summary?: string
  url?: string
  icon?: keyof typeof Ionicons.glyphMap
  items: { key: string; name: string; hint?: string }[]
}

const CATEGORIES: ServiceCategory[] = [
  {
    key: 'efiling',
    title: 'eFiling',
    agency: 'South African Revenue Service',
    status: 'Available',
    summary: 'File tax returns, manage tax accounts, and access SARS services online',
    url: 'https://secure.sarsefiling.co.za/landing',
    icon: 'document-text-outline',
    items: [
      { key: 'submit-income-tax-returns', name: 'Submit Income Tax Returns', hint: 'Available 24/7' },
      { key: 'request-tax-certificates', name: 'Request Tax Certificates', hint: '1-3 business days' },
      { key: 'vat-returns', name: 'VAT Returns', hint: 'Available 24/7' },
    ],
  },
  {
    key: 'ehomeaffairs',
    title: 'eHomeAffairs',
    agency: 'Department of Home Affairs',
    status: 'Available',
    icon: 'home-outline',
    summary: 'Apply for identity documents, passports, and citizenship services',
    url: 'https://ehome.dha.gov.za/ehomeaffairsv3',
    items: [
      { key: 'smart-id-application', name: 'Smart ID Application', hint: '10-15 business days' },
      { key: 'passport-application', name: 'Passport Application', hint: '6-8 weeks' },
      { key: 'birth-certificate', name: 'Birth Certificate', hint: '3-5 business days' },
    ],
  },
  {
    key: 'enatis',
    title: 'eNatis',
    status: 'Available',
    icon: 'car-outline',
    agency: 'National Traffic Information System',
    summary: 'Vehicle registration, licensing, and traffic fine management services',
    url: 'https://www.natis.gov.za',
    items: [
      { key: 'learners-licence-application', name: 'Learner’s Licence Application', hint: '5-7 business days' },
      { key: 'vehicle-registration', name: 'Vehicle Registration', hint: '3-5 business days' },
      { key: 'driving-license-renewal', name: 'Driving License Renewal', hint: '21 business days' },
    ],
  },
]

export default function ServicesScreen() {
  const insets = useSafeAreaInsets()
  const containerStyle = useMemo(() => [{ paddingBottom: Math.max(insets.bottom, 16) }], [insets.bottom])
  const router = useRouter()

  return (
    <View style={styles.page}>
      <Header/>
      <ScrollView contentContainerStyle={[styles.container, ...containerStyle]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.screenIntro}>Access official South African government services</Text>
        {CATEGORIES.map((cat, idx) => (
        <View key={cat.key} style={[styles.card, idx > 0 && styles.cardGap]}
          accessibilityRole="summary"
          accessibilityLabel={`${cat.title} category`}
        >
          {/* Card Header */}
          <View style={styles.cardHeaderRow}>
            <View style={styles.appIconBox}>
              {cat.icon ? <Ionicons name={cat.icon} size={20} color="#E67E22" /> : null}
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.titleRow}>
                <Text style={styles.cardTitle}>{cat.title}</Text>
                {cat.status ? (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{cat.status}</Text>
                  </View>
                ) : null}
              </View>
              {cat.agency ? <Text style={styles.agencyText}>{cat.agency}</Text> : null}
              {cat.summary ? <Text style={styles.summaryText}>{cat.summary}</Text> : null}
              {cat.url ? <Text style={styles.mutedLink}>{cat.url}</Text> : null}
            </View>
          </View>

          <Text style={styles.sectionLabel}>Available Services:</Text>

         {cat.items.map((svc, i) => (
  <View key={svc.key} style={[styles.serviceRow, i > 0 && styles.serviceRowDivider]}>
              {/* Link wraps a Pressable to get router navigation with RN feedback */}
              <Link href={`/(tabs)/services/${svc.key}` as any} asChild>
                <Pressable style={({ pressed }) => [styles.linkHit, pressed && styles.linkHitPressed]}
                  accessibilityRole="link"
                  accessibilityLabel={`${svc.name}`}
                >
                  {({ pressed }) => (
                    <View style={styles.serviceRowInner}>
                      <Text style={[styles.serviceLink, pressed && styles.serviceLinkPressed]}>{svc.name}</Text>
                    </View>
                  )}
                </Pressable>
              </Link>
              {svc.hint ? <Text style={styles.serviceHint}>{svc.hint}</Text> : null}
            </View>
          ))}

          {/* External link button under card */}
          {cat.url ? (
            <Pressable style={({ pressed }) => [styles.externalBtn, pressed && styles.externalBtnPressed]}
              onPress={() => {
                const target = cat.url?.startsWith('http') ? cat.url : `https://${cat.url}`
                if (target) {
                  WebBrowser.openBrowserAsync(target)
                }
              }}
              accessibilityRole="button"
              accessibilityLabel={`Visit ${cat.title}`}
            >
              <Ionicons name="link-outline" size={16} color="#fff" />
              <Text style={styles.externalBtnText}>Visit {cat.title}</Text>
            </Pressable>
          ) : null}
        </View>
      ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#F5F6F8' },
  container: {
    paddingHorizontal: 16,
    paddingTop: 0,
    backgroundColor: '#f7f7f8',
  },
  screenIntro: {
    textAlign: 'center',
    color: '#4b5563',
    marginTop: 12,
    marginBottom: 8,
  },
  card: {
  backgroundColor: '#ffffff',
  borderRadius: 16,
  padding: 18,
  shadowColor: '#000',
  shadowOpacity: 0.08,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 4 },
  elevation: 3,
},

cardGap: { marginTop: 20 },

  cardHeaderRow: { flexDirection: 'row', alignItems: 'flex-start' },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a' },
  agencyText: { marginTop: 2, color: '#64748b', fontSize: 13 },
  summaryText: { marginTop: 4, color: '#64748b', fontSize: 12 },
  mutedLink: { marginTop: 6, color: '#6b7280', fontSize: 12 },
  badge: { 
  backgroundColor: '#FFF4E6',
  paddingHorizontal: 10, 
  paddingVertical: 3, 
  borderRadius: 12, 
  shadowColor: '#E67E22',
  shadowOpacity: 0.1,
  shadowRadius: 3,
},
badgeText: { 
  color: '#E67E22', 
  fontSize: 12, 
  fontWeight: '700',
},
  appIconBox: { 
  width: 44, 
  height: 44, 
  borderRadius: 10, 
  backgroundColor: '#FFF4E6', 
  marginRight: 12, 
  alignItems: 'center', 
  justifyContent: 'center' 
},

  sectionLabel: { marginTop: 14, marginBottom: 8, color: '#111827', fontSize: 13, fontWeight: '700' },

  serviceRow: { },
  serviceRowDivider: {
  borderTopWidth: 1,
  borderTopColor: '#f0f0f0',
  marginTop: 10,
  paddingTop: 10,
},

  serviceRowGap: { marginTop: 12 },
  linkHit: { paddingVertical: 10, paddingHorizontal: 0 },
  linkHitPressed: { opacity: 0.85 },
  serviceRowInner: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  serviceLink: { color: '#1e48a1ff', fontSize: 16, fontWeight: '600' },
  serviceLinkPressed: { textDecorationLine: 'underline' },
  serviceHint: { marginTop: 4, color: '#6b7280', fontSize: 12 },
 externalBtn: {
  marginTop: 16,
  backgroundColor: '#E67E22',
  borderRadius: 10,
  paddingVertical: 12,
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'row',
  gap: 8,
  shadowColor: '#E67E22',
  shadowOpacity: 0.3,
  shadowRadius: 6,
  elevation: 3,
},
  externalBtnPressed: { opacity: 0.9 },
  externalBtnText: {
  color: '#fff',
  fontWeight: '700',
  fontSize: 15,
},
})
