import { Ionicons } from '@expo/vector-icons'
import { Link, useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Linking, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Header from '../../src/components/Header'
import { useAuth } from '../../src/contexts/AuthContext'
import { fetchWelcomeData, WelcomeResponse } from '../../src/lib/api'

export default function HomeScreen() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [welcomeData, setWelcomeData] = useState<WelcomeResponse | null>(null)
  const [loadingWelcome, setLoadingWelcome] = useState(true)

  // Fetch welcome data from backend API
  useEffect(() => {
    console.log('Home screen mounted, user state:', { 
      hasUser: !!user, 
      userId: user?.id,
      firstName: user?.first_name,
      authLoading 
    })

    const loadWelcomeData = async () => {
      // Wait for auth to finish loading
      if (authLoading) {
        console.log('Auth still loading, waiting...')
        return
      }

      if (user?.id) {
        console.log('Calling fetchWelcomeData with user ID:', user.id)
        try {
          setLoadingWelcome(true)
          const data = await fetchWelcomeData(user.id)
          console.log('Received welcome data:', data)
          setWelcomeData(data)
        } catch (error) {
          console.error('❌ Failed to fetch welcome data:', error)
          // Fallback to default if API fails
          setWelcomeData(null)
        } finally {
          setLoadingWelcome(false)
        }
      } else {
        console.log('⚠️ No user ID available, user not logged in')
        setLoadingWelcome(false)
      }
    }

    loadWelcomeData()
  }, [user?.id, authLoading])

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
      color: '#e67c35ff',
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
      <Header/>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* Welcome banner */}
        <View style={styles.welcomeCard}>
          <View style={styles.avatar}>
            {welcomeData?.user?.avatarUrl ? (
              <Ionicons name="person" color="#fff" size={22} />
            ) : (
              <Ionicons name="person" color="#fff" size={22} />
            )}
          </View>
          <View style={{ flex: 1 }}>
            {loadingWelcome ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Text style={styles.welcomeHi}>
                  {welcomeData?.message || `Hi${user?.first_name ? `, ${user.first_name}` : ', User'}`}
                </Text>
                <Text style={styles.welcomeSub}>Welcome back to eGov SA</Text>
              </>
            )}
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
              <View style={styles.contactIcon}><Ionicons name="call-outline" size={18} color="#E67E22" /></View>
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
  page: { flex: 1, backgroundColor: '#F5F6F8' },
  // header styles removed (now provided by shared Header component)

  welcomeCard: { margin: 16, padding: 20, backgroundColor: '#fff', borderRadius: 14, flexDirection: 'row', alignItems: 'center', gap: 12, ...cardShadow },
  avatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#1A2B4A', alignItems: 'center', justifyContent: 'center' },
  welcomeHi: { fontSize: 20, color: '#1A2B4A', fontWeight: '700',  },
  welcomeSub: { fontSize: 16, color: '#5A6C7D' },

  sectionTitle: { marginTop: 10, marginHorizontal: 16, marginBottom: 10, fontSize: 14, fontWeight: '700', color: '#222' },
  rowBetween: { marginHorizontal: 16, marginTop: 10, marginBottom: 6, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  viewAll: { color: '#de6c0fff', fontWeight: '600' },

  servicesGrid: { flexDirection: 'row', gap: 12, paddingHorizontal: 16 },
  serviceCard: { flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 12, alignItems: 'center', ...cardShadow },
  serviceIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  serviceText: { fontSize: 14, color: '#222', fontWeight: '600' },

  notificationCard: { marginHorizontal: 16, marginBottom: 10, backgroundColor: '#fff', borderRadius: 12, padding: 12, ...cardShadow },
  dotActive: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#de6c0fff', marginRight: 6 },
  notificationTitle: { fontSize: 14, fontWeight: '700', color: '#1A2B4A' },
  notificationDesc: { fontSize: 13, color: '#334155', marginBottom: 6 },
  notificationTime: { fontSize: 12, color: '#5A6C7D' },

  contactCard: { marginHorizontal: 16, marginBottom: 12, backgroundColor: '#fff', borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', ...cardShadow },
  contactIcon: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#ed7e2f22', alignItems: 'center', justifyContent: 'center' },
  contactName: { fontSize: 14, fontWeight: '700', color: '#37291fff' },
  contactDept: { fontSize: 12, color: '#80756bff' },
  contactPhone: { fontSize: 13, color: '#E67E22', marginTop: 2 },
  callBtn: { backgroundColor: '#f8ebe6ff', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  callBtnText: { color: '#E67E22', fontWeight: '700' },
})
