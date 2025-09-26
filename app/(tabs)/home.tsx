import { Ionicons } from '@expo/vector-icons'
import { Link, useRouter } from 'expo-router'
import React from 'react'
import { Linking, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Header from '../../src/components/Header'
import { useAuth } from '../../src/contexts/AuthContext'

export default function HomeScreen() {
  const { user } = useAuth()
  const router = useRouter()

  const services = [
    {
      key: 'eHomeAffairs',
      title: 'eHomeAffairs',
      color: '#2F80ED',
      icon: <Ionicons name="document-text-outline" size={22} color="#fff" />,
      onPress: () => router.push('/(tabs)/services' as any),
    },
    {
      key: 'eNatis',
      title: 'eNatis',
      color: '#27AE60',
      icon: <Ionicons name="car-outline" size={22} color="#fff" />,
      onPress: () => router.push('/(tabs)/services' as any),
    },
    {
      key: 'eFiling',
      title: 'eFiling',
      color: '#9B51E0',
      icon: <Ionicons name="file-tray-full-outline" size={22} color="#fff" />,
      onPress: () => router.push('/(tabs)/services' as any),
    },
  ] as const

  const notifications = [
    {
      id: '1',
      title: 'Smart ID Ready for Collection',
      description: 'Your Smart ID is ready for collection at Sandton Home Affairs office',
      time: '2 hours ago',
      active: true,
    },
    {
      id: '2',
      title: 'Tax Return Processed',
      description: 'Your tax return has been successfully processed. Refund expected in 5–7 days',
      time: '1 day ago',
      active: true,
    },
    {
      id: '3',
      title: 'Application Update',
      description: 'Additional documents required for business license application',
      time: '2 days ago',
      active: false,
    },
  ] as const

  const contacts = [
    { id: 'c1', name: 'Home Affairs Office', dept: 'Sandton Branch', phone: '011 835 4500' },
    { id: 'c2', name: 'SARS Contact Center', dept: 'Tax Services', phone: '0800 00 7277' },
    { id: 'c3', name: 'eNatis Support', dept: 'Vehicle Registration', phone: '086 121 3278' },
  ]

  return (
    <View style={styles.page}>
      <Header onPressBell={() => router.push('/notifications' as any)} />

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* Welcome banner */}
        <View style={styles.welcomeCard}>
          <View style={styles.avatar}>
            <Ionicons name="person" color="#fff" size={22} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.welcomeHi}>Hi{user?.first_name ? `, ${user.first_name}` : ', Thabo'}</Text>
            <Text style={styles.welcomeSub}>Welcome back to eGov SA</Text>
          </View>
          <Ionicons name="shield-checkmark-outline" size={22} color="#fff" />
        </View>

        {/* Government Services */}
        <Text style={styles.sectionTitle}>Government Services</Text>
        <View style={styles.servicesGrid}>
          {services.map((s) => (
            <TouchableOpacity key={s.key} style={styles.serviceCard} onPress={s.onPress}>
              <View style={[styles.serviceIcon, { backgroundColor: s.color }]}>{s.icon}</View>
              <Text style={styles.serviceText}>{s.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Notifications */}
        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <Link href={'/notifications' as any} style={styles.viewAll}>View All ▸</Link>
        </View>

        {notifications.map((n) => (
          <View key={n.id} style={styles.notificationCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
              {n.active && <View style={styles.dotActive} />}
              <Text style={styles.notificationTitle}>{n.title}</Text>
            </View>
            <Text style={styles.notificationDesc}>{n.description}</Text>
            <Text style={styles.notificationTime}>{n.time}</Text>
          </View>
        ))}

        {/* Contacts */}
        <Text style={styles.sectionTitle}>Contacts</Text>
        {contacts.map((c) => (
          <Pressable
            key={c.id}
            style={styles.contactCard}
            onPress={() => {
              const tel = `tel:${c.phone.replace(/\s+/g, '')}`
              Linking.openURL(tel)
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
              <View style={styles.contactIcon}><Ionicons name="call-outline" size={18} color="#2F80ED" /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.contactName}>{c.name}</Text>
                <Text style={styles.contactDept}>{c.dept}</Text>
                <Text style={styles.contactPhone}>{c.phone}</Text>
              </View>
            </View>
            <View style={styles.callBtn}>
              <Text style={styles.callBtnText}>Call</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
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
  page: { flex: 1, backgroundColor: '#f6f8fb' },
  // header styles removed (now provided by shared Header component)

  welcomeCard: { margin: 16, padding: 16, backgroundColor: '#0a7ea4', borderRadius: 14, flexDirection: 'row', alignItems: 'center', gap: 12, ...cardShadow },
  avatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#0a7ea4aa', alignItems: 'center', justifyContent: 'center' },
  welcomeHi: { fontSize: 16, color: '#fff', fontWeight: '700' },
  welcomeSub: { fontSize: 12, color: '#e8f6fb' },

  sectionTitle: { marginTop: 10, marginHorizontal: 16, marginBottom: 10, fontSize: 14, fontWeight: '700', color: '#222' },
  rowBetween: { marginHorizontal: 16, marginTop: 10, marginBottom: 6, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  viewAll: { color: '#de6c0fff', fontWeight: '600' },

  servicesGrid: { flexDirection: 'row', gap: 12, paddingHorizontal: 16 },
  serviceCard: { flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 12, alignItems: 'center', ...cardShadow },
  serviceIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  serviceText: { fontSize: 12, color: '#222', fontWeight: '600' },

  notificationCard: { marginHorizontal: 16, marginBottom: 10, backgroundColor: '#E8F5EE', borderRadius: 12, padding: 12, ...cardShadow },
  dotActive: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#22c55e', marginRight: 6 },
  notificationTitle: { fontSize: 13, fontWeight: '700', color: '#1e293b' },
  notificationDesc: { fontSize: 12, color: '#334155', marginBottom: 6 },
  notificationTime: { fontSize: 11, color: '#64748b' },

  contactCard: { marginHorizontal: 16, marginBottom: 12, backgroundColor: '#fff', borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', ...cardShadow },
  contactIcon: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#2F80ED22', alignItems: 'center', justifyContent: 'center' },
  contactName: { fontSize: 13, fontWeight: '700', color: '#1f2937' },
  contactDept: { fontSize: 11, color: '#6b7280' },
  contactPhone: { fontSize: 12, color: '#0a7ea4', marginTop: 2 },
  callBtn: { backgroundColor: '#e6f3f8', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  callBtnText: { color: '#0a7ea4', fontWeight: '700' },
})
