import { Ionicons } from '@expo/vector-icons'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, Alert, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native'
import Header from '../../src/components/Header'
import { useAuth } from '../../src/contexts/AuthContext'
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
      <View style={styles.page}>
        <Header />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#27AE60" />
          <Text style={styles.loadingText}>Loading applications...</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.page}>
      <Header />
      <View style={styles.tabsWrap}>
        {(['Active', 'Completed', 'Rejected'] as const).map((t) => (
          <Pressable
            key={t}
            style={[styles.tab, tab === t && styles.tabActive]}
            onPress={() => setTab(t)}
          >
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t}</Text>
          </Pressable>
        ))}
      </View>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentInner}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#27AE60']} tintColor="#27AE60" />
        }
      >
        {list.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No {tab.toLowerCase()} applications</Text>
          </View>
        ) : (
          list.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.serviceType}</Text>
                <View style={[styles.badge, { backgroundColor: STATUS_COLORS[item.status]?.bg }]}>
                  <Text style={[styles.badgeText, { color: STATUS_COLORS[item.status]?.text }]}>
                    {item.status}
                  </Text>
                </View>
              </View>
              <View style={styles.cardRow}>
                <Text style={styles.label}>Ref:</Text>
                <Text style={styles.value}>{item.referenceNumber}</Text>
              </View>
              <View style={styles.cardRow}>
                <Text style={styles.label}>Current Step:</Text>
                <Text style={styles.value}>{item.currentStep}</Text>
              </View>
              <View style={styles.cardRow}>
                <Text style={styles.label}>Submitted:</Text>
                <Text style={styles.value}>{formatDate(item.submittedAt)}</Text>
              </View>
              <View style={styles.cardRow}>
                <Text style={styles.label}>Expected Completion:</Text>
                <Text style={styles.value}>
                  {item.expectedCompletionDate ? formatDate(item.expectedCompletionDate) : ''}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
      <Pressable style={styles.fab} onPress={onRefresh}>
        <Ionicons name="refresh" size={24} color="#fff" />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#f5f5f5' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  loadingText: { marginTop: 16, fontSize: 16, color: '#666' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60 },
  emptyText: { marginTop: 16, fontSize: 16, color: '#999' },
  tabsWrap: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  tab: { flex: 1, paddingVertical: 14, alignItems: 'center', borderBottomWidth: 3, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: '#27AE60' },
  tabText: { fontSize: 15, fontWeight: '500', color: '#666' },
  tabTextActive: { color: '#27AE60', fontWeight: '600' },
  content: { flex: 1 },
  contentInner: { padding: 16, paddingBottom: 80 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#222', flex: 1, marginRight: 8 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontSize: 12, fontWeight: '600' },
  cardRow: { flexDirection: 'row', marginBottom: 8 },
  label: { fontSize: 14, color: '#666', width: 140 },
  value: { fontSize: 14, color: '#222', fontWeight: '500', flex: 1 },
  fab: { position: 'absolute', bottom: 20, right: 20, width: 56, height: 56, borderRadius: 28, backgroundColor: '#27AE60', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 8 },
})
