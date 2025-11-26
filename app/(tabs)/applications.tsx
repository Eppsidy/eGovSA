import { Ionicons } from '@expo/vector-icons'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, Alert, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native'
import Header from '../../src/components/Header'
import { useAuth } from '../../src/contexts/AuthContext'
import { useThemeColor } from '../../src/hooks/useThemeColor'
import { Application, getUserApplications } from '../../src/lib/api'

type Status = 'In Progress' | 'Under Review' | 'Pending Payment' | 'Completed' | 'Rejected'

const STATUS_COLORS: Record<Status, { bg: string; text: string }> = {
  'In Progress': { bg: '#e3f2ff', text: '#2F80ED' },
  'Under Review': { bg: '#fff1e6', text: '#f59e0b' },
  'Pending Payment': { bg: '#fff9db', text: '#d97706' },
  Completed: { bg: '#eaf7ef', text: '#16a34a' },
  Rejected: { bg: '#ffeaea', text: '#ef4444' },
}

const formatDate = (isoString: string): string => {
  const date = new Date(isoString)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

export default function ApplicationsScreen() {
  const { user } = useAuth()
  const colors = useThemeColor()
  type TabKey = 'Active' | 'Completed' | 'Rejected'
  const [tab, setTab] = useState<TabKey>('Active')
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchApplications = useCallback(async () => {
    if (!user?.id) return
    try {
      const data = await getUserApplications(user.id)
      setApplications(data)
    } catch (error) {
      console.error('Failed to fetch applications:', error)
      Alert.alert('Error', 'Failed to load applications. Please try again.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [user?.id])

  useEffect(() => { fetchApplications() }, [fetchApplications])

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    fetchApplications()
  }, [fetchApplications])

  const groups = useMemo(() => {
    const active = applications.filter((d) =>
      d.status === 'In Progress' || d.status === 'Under Review' || d.status === 'Pending Payment'
    )
    const completed = applications.filter((d) => d.status === 'Completed')
    const rejected = applications.filter((d) => d.status === 'Rejected')
    return { Active: active, Completed: completed, Rejected: rejected }
  }, [applications])

  const list = groups[tab]

  if (loading) {
    return (
      <View style={[styles.page, { backgroundColor: colors.background }]}>
        <Header />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textTertiary }]}>Loading applications...</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={[styles.page, { backgroundColor: colors.background }]}>
      <Header />
      <View style={[styles.tabsWrap, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        {(['Active', 'Completed', 'Rejected'] as const).map((t) => (
          <Pressable
            key={t}
            style={[styles.tab, tab === t && { borderBottomColor: colors.primary }]}
            onPress={() => setTab(t)}
          >
            <Text style={[styles.tabText, { color: tab === t ? colors.primary : colors.textTertiary }, tab === t && styles.tabTextActive]}>{t}</Text>
          </Pressable>
        ))}
      </View>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentInner}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />
        }
      >
        {list.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={64} color={colors.textMuted} />
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>No {tab.toLowerCase()} applications</Text>
          </View>
        ) : (
          list.map((item) => (
            <View key={item.id} style={[styles.card, { backgroundColor: colors.card }]}>
              <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>{item.serviceType}</Text>
                <View style={[styles.badge, { backgroundColor: STATUS_COLORS[item.status]?.bg }]}>
                  <Text style={[styles.badgeText, { color: STATUS_COLORS[item.status]?.text }]}>
                    {item.status}
                  </Text>
                </View>
              </View>
              <View style={styles.cardRow}>
                <Text style={[styles.label, { color: colors.textTertiary }]}>Ref:</Text>
                <Text style={[styles.value, { color: colors.text }]}>{item.referenceNumber}</Text>
              </View>
              <View style={styles.cardRow}>
                <Text style={[styles.label, { color: colors.textTertiary }]}>Current Step:</Text>
                <Text style={[styles.value, { color: colors.text }]}>{item.currentStep}</Text>
              </View>
              <View style={styles.cardRow}>
                <Text style={[styles.label, { color: colors.textTertiary }]}>Submitted:</Text>
                <Text style={[styles.value, { color: colors.text }]}>{formatDate(item.submittedAt)}</Text>
              </View>
              <View style={styles.cardRow}>
                <Text style={[styles.label, { color: colors.textTertiary }]}>Expected Completion:</Text>
                <Text style={[styles.value, { color: colors.text }]}>
                  {item.expectedCompletionDate ? formatDate(item.expectedCompletionDate) : ''}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
      <Pressable style={[styles.fab, { backgroundColor: colors.primary }]} onPress={onRefresh}>
        <Ionicons name="refresh" size={24} color="#fff" />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 16, fontSize: 16 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60 },
  emptyText: { marginTop: 16, fontSize: 16 },
  tabsWrap: { flexDirection: 'row', borderBottomWidth: 1 },
  tab: { flex: 1, paddingVertical: 14, alignItems: 'center', borderBottomWidth: 3, borderBottomColor: 'transparent' },
  tabText: { fontSize: 15, fontWeight: '500' },
  tabTextActive: { fontWeight: '600' },
  content: { flex: 1 },
  contentInner: { padding: 16, paddingBottom: 80 },
  card: { borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: '600', flex: 1, marginRight: 8 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontSize: 12, fontWeight: '600' },
  cardRow: { flexDirection: 'row', marginBottom: 8 },
  label: { fontSize: 14, width: 140 },
  value: { fontSize: 14, fontWeight: '500', flex: 1 },
  fab: { position: 'absolute', bottom: 20, right: 20, width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 8 },
})
