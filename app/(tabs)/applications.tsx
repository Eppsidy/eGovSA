import { Ionicons } from '@expo/vector-icons'
import React, { useMemo, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import Header from '../../src/components/Header'

type Status = 'In Progress' | 'Under Review' | 'Pending Payment' | 'Completed' | 'Rejected'

type ApplicationItem = {
  id: string
  service: string
  ref: string
  status: Status
  currentStep: string
  submitted: string // DD/MM/YYYY
  expected: string // DD/MM/YYYY
}

const STATUS_COLORS: Record<Status, { bg: string; text: string }> = {
  'In Progress': { bg: '#e3f2ff', text: '#2F80ED' }, // blue
  'Under Review': { bg: '#fff1e6', text: '#f59e0b' }, // orange
  'Pending Payment': { bg: '#fff9db', text: '#d97706' }, // yellow
  Completed: { bg: '#eaf7ef', text: '#16a34a' }, // green
  Rejected: { bg: '#ffeaea', text: '#ef4444' }, // red
}

const DATA: ApplicationItem[] = [
  {
    id: 'a1',
    service: 'Smart ID Renewal',
    status: 'In Progress',
    ref: 'ID001',
    currentStep: 'Biometric Verification',
    submitted: '20/08/2024',
    expected: '03/09/2024',
  },
  {
    id: 'a2',
    service: 'Tax Return Filing',
    status: 'Under Review',
    ref: 'TAX002',
    currentStep: 'Document Verification',
    submitted: '10/08/2024',
    expected: '31/08/2024',
  },
  {
    id: 'a3',
    service: 'Business License Application',
    status: 'Pending Payment',
    ref: 'BUS003',
    currentStep: 'Payment Pending',
    submitted: '05/08/2024',
    expected: '—',
  },
  {
    id: 'a4',
    service: 'Passport Application',
    status: 'Completed',
    ref: 'PA004',
    currentStep: 'Issued',
    submitted: '12/07/2024',
    expected: '26/07/2024',
  },
  {
    id: 'a5',
    service: 'Learner’s Licence Application',
    status: 'Rejected',
    ref: 'LL005',
    currentStep: 'Resubmit Documents',
    submitted: '22/07/2024',
    expected: '—',
  },
]

export default function ApplicationsScreen() {
  // tabs: Active (In Progress, Under Review, Pending Payment), Completed, Rejected
  type TabKey = 'Active' | 'Completed' | 'Rejected'
  const [tab, setTab] = useState<TabKey>('Active')

  const groups = useMemo(() => {
    const active = DATA.filter((d) =>
      d.status === 'In Progress' || d.status === 'Under Review' || d.status === 'Pending Payment'
    )
    const completed = DATA.filter((d) => d.status === 'Completed')
    const rejected = DATA.filter((d) => d.status === 'Rejected')
    return { Active: active, Completed: completed, Rejected: rejected }
  }, [])

  const list = groups[tab]

  return (
    <View style={styles.page}>
      <Header />

      {/* Tabs */}
      <View style={styles.tabsWrap}>
        {(['Active', 'Completed', 'Rejected'] as const).map((t) => (
          <Pressable
            key={t}
            onPress={() => setTab(t)}
            style={[styles.tabPill, tab === t && styles.tabPillActive]}
          >
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t}</Text>
            <View style={[styles.countBadge, tab === t && styles.countBadgeActive]}>
              <Text style={[styles.countText, tab === t && styles.countTextActive]}>{groups[t].length}</Text>
            </View>
          </Pressable>
        ))}
      </View>

      {/* List */}
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {list.map((item) => (
          <View key={item.id} style={styles.card}>
            {/* Header row: icon + service + status badge */}
            <View style={styles.cardHeader}>
              <View style={styles.serviceIcon}>
                <Ionicons name="document-text-outline" size={18} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.serviceTitle}>{item.service}</Text>
                <Text style={styles.serviceRef}>Ref: {item.ref}</Text>
              </View>
              <StatusBadge status={item.status} />
            </View>

            {/* Current step */}
            <View style={styles.stepBox}>
              <Text style={styles.stepLabel}>Current step:</Text>
              <Text style={styles.stepValue}>{item.currentStep}</Text>
            </View>

            {/* Dates row */}
            <View style={styles.datesRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.dateLabel}>Submitted</Text>
                <Text style={styles.dateValue}>{item.submitted}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.dateLabel}>Expected</Text>
                <Text style={styles.dateValue}>{item.expected}</Text>
              </View>
              <Pressable
                onPress={() => {
                  // Placeholder for refresh/retry action per item
                }}
                hitSlop={10}
                style={styles.refreshBtn}
                accessibilityLabel={`Refresh ${item.service}`}
              >
                <Ionicons name="refresh" size={18} color="#64748b" />
              </Pressable>
            </View>
          </View>
        ))}
        {list.length === 0 && (
          <View style={styles.emptyWrap}>
            <Ionicons name="file-tray-outline" size={28} color="#b8a894ff" />
            <Text style={styles.emptyText}>No applications here yet.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

function StatusBadge({ status }: { status: Status }) {
  const c = STATUS_COLORS[status]
  return (
    <View style={[styles.badge, { backgroundColor: c.bg }]}> 
      <Text style={[styles.badgeText, { color: c.text }]}>{status}</Text>
    </View>
  )
}

const cardShadow = {
  shadowColor: '#000',
  shadowOpacity: 0.08,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 3 },
  elevation: 3,
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#F5F6F8' },

  // Tabs
  tabsWrap: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: 16,
    padding: 6,
    borderRadius: 14,
    ...cardShadow,
  },
  tabPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  tabPillActive: {
    backgroundColor: '#0a7ea40f',
  },
  tabText: { color: '#475569', fontWeight: '700', fontSize: 13 },
  tabTextActive: { color: '#a45a0aff' },
  countBadge: {
    minWidth: 20,
    paddingHorizontal: 6,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countBadgeActive: {
    backgroundColor: '#0a7ea41a',
  },
  countText: { fontSize: 11, color: '#334155', fontWeight: '700' },
  countTextActive: { color: '#0a7ea4' },

  // Cards
  card: {
    marginHorizontal: 16,
    marginBottom: 14,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    ...cardShadow,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  serviceIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#E67E22',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  serviceTitle: { fontSize: 14, fontWeight: '800', color: '#0f172a' },
  serviceRef: { fontSize: 11, color: '#64748b', marginTop: 2 },

  badge: { paddingHorizontal: 10, height: 22, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  badgeText: { fontSize: 11, fontWeight: '800' },

  stepBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e2e8f0',
    marginBottom: 10,
  },
  stepLabel: { fontSize: 11, color: '#64748b', marginBottom: 4 },
  stepValue: { fontSize: 12, color: '#1e293b', fontWeight: '700' },

  datesRow: { flexDirection: 'row', alignItems: 'center' },
  dateLabel: { fontSize: 11, color: '#64748b', marginBottom: 4 },
  dateValue: { fontSize: 12, color: '#1e293b', fontWeight: '700' },
  refreshBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ebe8e5ff',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fcfaf8ff',
  },

  emptyWrap: { alignItems: 'center', justifyContent: 'center', marginTop: 40, gap: 8 },
  emptyText: { color: '#b8a794ff', fontWeight: '700' },
})
