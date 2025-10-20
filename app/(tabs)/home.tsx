import { Ionicons } from '@expo/vector-icons'
import { Link, useRouter } from 'expo-router'
import React, { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, Alert, Linking, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Header from '../../src/components/Header'
import { useAuth } from '../../src/contexts/AuthContext'
import { fetchProfile, fetchWelcomeData, getActiveUserNotifications, Notification, WelcomeResponse, WelcomeUserInfo } from '../../src/lib/api'

// Provincial contact data structure

const provincialContacts = {
  homeAffairs: {
    name: 'Home Affairs Office',
    provinces: [
      { name: 'Eastern Cape', office: 'East London Branch', phone: '043 701 3400' },
      { name: 'Free State', office: 'Bloemfontein Branch', phone: '051 407 3204' },
      { name: 'Gauteng', office: 'Sandton Branch', phone: '011 835 4500' },
      { name: 'KwaZulu-Natal', office: 'Durban Branch', phone: '031 314 9111' },
      { name: 'Limpopo', office: 'Polokwane Branch', phone: '015 299 5000' },
      { name: 'Mpumalanga', office: 'Nelspruit Branch', phone: '013 753 9500' },
      { name: 'Northern Cape', office: 'Kimberley Branch', phone: '053 838 0700' },
      { name: 'North West', office: 'Mahikeng Branch', phone: '018 397 1500' },
      { name: 'Western Cape', office: 'Cape Town Branch', phone: '021 462 4970' },
    ]
  },
  sars: {
    name: 'SARS Contact Center',
    provinces: [
      { name: 'Eastern Cape', office: 'Port Elizabeth Branch', phone: '041 505 3000' },
      { name: 'Free State', office: 'Bloemfontein Branch', phone: '051 406 9000' },
      { name: 'Gauteng', office: 'Pretoria Branch', phone: '012 422 4000' },
      { name: 'KwaZulu-Natal', office: 'Durban Branch', phone: '031 314 8611' },
      { name: 'Limpopo', office: 'Polokwane Branch', phone: '015 291 3031' },
      { name: 'Mpumalanga', office: 'Nelspruit Branch', phone: '013 752 8041' },
      { name: 'Northern Cape', office: 'Kimberley Branch', phone: '053 832 5441' },
      { name: 'North West', office: 'Rustenburg Branch', phone: '014 592 9305' },
      { name: 'Western Cape', office: 'Cape Town Branch', phone: '021 417 2500' },
    ]
  },
  enatis: {
    name: 'eNatis Support',
    provinces: [
      { name: 'Eastern Cape', office: 'Vehicle Registration', phone: '040 609 5111' },
      { name: 'Free State', office: 'Vehicle Registration', phone: '051 407 6911' },
      { name: 'Gauteng', office: 'Vehicle Registration', phone: '086 121 3278' },
      { name: 'KwaZulu-Natal', office: 'Vehicle Registration', phone: '033 342 6666' },
      { name: 'Limpopo', office: 'Vehicle Registration', phone: '015 284 4300' },
      { name: 'Mpumalanga', office: 'Vehicle Registration', phone: '013 655 7000' },
      { name: 'Northern Cape', office: 'Vehicle Registration', phone: '053 838 5000' },
      { name: 'North West', office: 'Vehicle Registration', phone: '018 388 5000' },
      { name: 'Western Cape', office: 'Vehicle Registration', phone: '021 483 4311' },
    ]
  }
}

export default function HomeScreen() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [welcomeData, setWelcomeData] = useState<WelcomeResponse | null>(null)
  const [profileData, setProfileData] = useState<WelcomeUserInfo | null>(null)
  const [loadingWelcome, setLoadingWelcome] = useState(true)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loadingNotifications, setLoadingNotifications] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  
  // State for expandable contacts
  const [expandedContact, setExpandedContact] = useState<string | null>(null)
  const [expandedProvince, setExpandedProvince] = useState<string | null>(null)

  // Fetch welcome data from backend API
  useEffect(() => {
    // console.log('Home screen mounted, user state:', { 
    //   hasUser: !!user, 
    //   userId: user?.id,
    //   firstName: user?.first_name,
    //   authLoading 
    // })

    const loadWelcomeData = async () => {
      // Wait for auth to finish loading
      if (authLoading) {
        // console.log('Auth still loading, waiting...')
        return
      }

      if (user?.id) {
        // console.log('Calling fetchWelcomeData and fetchProfile with user ID:', user.id)
        try {
          setLoadingWelcome(true)
          // Fetch both welcome data and profile data from cache/API
          const [welcomeResponse, profileResponse] = await Promise.all([
            fetchWelcomeData(user.id),
            fetchProfile(user.id)
          ])
          // console.log('Received welcome data:', welcomeResponse)
          // console.log('Received profile data:', profileResponse)
          setWelcomeData(welcomeResponse)
          setProfileData(profileResponse)
        } catch (error) {
          console.error('❌ Failed to fetch welcome/profile data:', error)
          // Fallback to default if API fails
          setWelcomeData(null)
          setProfileData(null)
        } finally {
          setLoadingWelcome(false)
        }
      } else {
        // console.log('⚠️ No user ID available, user not logged in')
        setLoadingWelcome(false)
      }
    }

    loadWelcomeData()
  }, [user?.id, authLoading])

  // Fetch notifications from backend API
  const fetchNotifications = useCallback(async () => {
    if (!user?.id) {
      setLoadingNotifications(false)
      return
    }

    try {
      // console.log('Fetching notifications for user:', user.id)
      const data = await getActiveUserNotifications(user.id)
      // console.log('Received notifications:', data)
      // Show only the first 3 notifications
      setNotifications(data.slice(0, 3))
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
      setNotifications([])
    } finally {
      setLoadingNotifications(false)
    }
  }, [user?.id])

  useEffect(() => {
    if (authLoading) return
    fetchNotifications()
  }, [authLoading, fetchNotifications])

  // Pull to refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    try {
      // Refresh welcome data, profile data, and notifications
      if (user?.id) {
        await Promise.all([
          fetchWelcomeData(user.id).then(data => setWelcomeData(data)).catch(() => {}),
          fetchProfile(user.id).then(data => setProfileData(data)).catch(() => {}),
          fetchNotifications()
        ])
      }
    } catch (error) {
      // console.error('Error refreshing:', error)
    } finally {
      setRefreshing(false)
    }
  }, [user?.id, fetchNotifications])

  const getTimeAgo = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 60) {
      return diffMins <= 1 ? '1 minute ago' : `${diffMins} minutes ago`
    } else if (diffHours < 24) {
      return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`
    } else {
      return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`
    }
  }

  const contactColors = {
  homeAffairs: '#2F80ED',
  sars: '#e67c35ff',
  enatis: '#27AE60'
}

  const toggleContact = (contactKey: string) => {
    if (expandedContact === contactKey) {
      setExpandedContact(null)
      setExpandedProvince(null)
    } else {
      setExpandedContact(contactKey)
      setExpandedProvince(null)
    }
  }

  const toggleProvince = (provinceKey: string) => {
    setExpandedProvince(expandedProvince === provinceKey ? null : provinceKey)
  }

  const handleCall = (name: string, phone: string) => {
  Alert.alert(
    'Make a Call',
    `Call ${name} at ${phone}?`,
    [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Call', 
        onPress: () => {
          const tel = `tel:${phone.replace(/\s+/g, '')}`
          Linking.openURL(tel)
        }
      }
    ]
  )
}

  const services = [
  {
    key: 'eHomeAffairs',
    title: 'eHomeAffairs',
    description: 'ID & Passport Services',
    color: '#2F80ED',
    icon: <Ionicons name="document-text-outline" size={22} color="#fff" />,
    onPress: () => router.push('/(tabs)/services' as any),
  },
  {
    key: 'eNatis',
    title: 'eNatis',
    description: 'Vehicle Registration',
    color: '#27AE60',
    icon: <Ionicons name="car-outline" size={22} color="#fff" />,
    onPress: () => router.push('/(tabs)/services' as any),
  },
  {
    key: 'eFiling',
    title: 'eFiling',
    description: 'Tax Services',
    color: '#e67c35ff',
    icon: <Ionicons name="file-tray-full-outline" size={22} color="#fff" />,
    onPress: () => router.push('/(tabs)/services' as any),
  },
] as const

  return (
    <View style={styles.page}>
      <Header/>

      <ScrollView 
        contentContainerStyle={{ paddingBottom: 100 }} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#27AE60']}
            tintColor="#27AE60"
          />
        }
      >
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
                  {welcomeData?.message || `Hi ${user?.first_name ? `, ${user.first_name}` : ', User'}`}
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
  <Text style={styles.serviceDesc}>{s.description}</Text>
</TouchableOpacity>
          ))}
        </View>

        {/* Notifications */}
        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <Link href={'/notifications' as any} style={styles.viewAll}>View All ▸</Link>
        </View>

        {loadingNotifications ? (
          <View style={{ marginHorizontal: 16, marginBottom: 10, backgroundColor: '#fff', borderRadius: 12, padding: 20, alignItems: 'center', ...cardShadow }}>
            <ActivityIndicator size="small" color="#27AE60" />
            <Text style={{ marginTop: 8, fontSize: 12, color: '#6B7280' }}>Loading notifications...</Text>
          </View>
        ) : notifications.length === 0 ? (
          <View style={{ marginHorizontal: 16, marginBottom: 10, backgroundColor: '#fff', borderRadius: 12, padding: 20, alignItems: 'center', ...cardShadow }}>
            <Ionicons name="notifications-off-outline" size={32} color="#ccc" />
            <Text style={{ marginTop: 8, fontSize: 13, color: '#6B7280' }}>No notifications yet</Text>
          </View>
        ) : (
          notifications.map((n) => (
            <View key={n.id} style={styles.notificationCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                {!n.isRead && <View style={styles.dotActive} />}
                <Text style={styles.notificationTitle}>{n.title}</Text>
              </View>
              <Text style={styles.notificationDesc}>{n.description}</Text>
              <Text style={styles.notificationTime}>{getTimeAgo(n.createdAt)}</Text>
            </View>
          ))
        )}

        {/* Contacts - Expandable */}
        <Text style={styles.sectionTitle}>Contacts</Text>
        
        {/* Home Affairs Contact */}
        <View style={styles.contactContainer}>
          <Pressable
            style={styles.contactCard}
            onPress={() => toggleContact('homeAffairs')}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
              <View style={styles.contactIcon}>
                <Ionicons name="call-outline" size={18} color="#E67E22" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.contactName}>{provincialContacts.homeAffairs.name}</Text>
                <Text style={styles.contactDept}>Provincial Offices</Text>
              </View>
            </View>
            <Ionicons 
              name={expandedContact === 'homeAffairs' ? "chevron-up" : "chevron-down"} 
              size={20} 
              color="#666" 
            />
          </Pressable>
          
          {expandedContact === 'homeAffairs' && (
            <View style={styles.provinceList}>
              {provincialContacts.homeAffairs.provinces.map((province, index) => (
                <View key={index}>
                  <Pressable
                    style={styles.provinceCard}
                    onPress={() => toggleProvince(`homeAffairs-${index}`)}
                  >
                    <Text style={styles.provinceName}>{province.name}</Text>
                    <Ionicons 
                      name={expandedProvince === `homeAffairs-${index}` ? "chevron-up" : "chevron-down"} 
                      size={18} 
                      color="#999" 
                    />
                  </Pressable>
                  
                  {expandedProvince === `homeAffairs-${index}` && (
                    <View style={styles.provinceDetails}>
                      <Text style={styles.provinceOffice}>{province.office}</Text>
                      <Text style={styles.provincePhone}>{province.phone}</Text>
                      <Pressable
                        style={styles.callBtn}
                        onPress={() => {
                          const tel = `tel:${province.phone.replace(/\s+/g, '')}`
                          Linking.openURL(tel)
                        }}
                      >
                        <Text style={styles.callBtnText}>Call</Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>

        {/* SARS Contact */}
        <View style={styles.contactContainer}>
          <Pressable
            style={styles.contactCard}
            onPress={() => toggleContact('sars')}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
              <View style={[styles.contactIcon, { backgroundColor: contactColors.homeAffairs + '22' }]}>
  <Ionicons name="call-outline" size={18} color={contactColors.homeAffairs} />
</View>
              <View style={{ flex: 1 }}>
                <Text style={styles.contactName}>{provincialContacts.sars.name}</Text>
                <Text style={styles.contactDept}>Tax Services</Text>
              </View>
            </View>
            <Ionicons 
              name={expandedContact === 'sars' ? "chevron-up" : "chevron-down"} 
              size={20} 
              color="#666" 
            />
          </Pressable>
          
          {expandedContact === 'sars' && (
            <View style={styles.provinceList}>
              {provincialContacts.sars.provinces.map((province, index) => (
                <View key={index}>
                  <Pressable
                    style={styles.provinceCard}
                    onPress={() => toggleProvince(`sars-${index}`)}
                  >
                    <Text style={styles.provinceName}>{province.name}</Text>
                    <Ionicons 
                      name={expandedProvince === `sars-${index}` ? "chevron-up" : "chevron-down"} 
                      size={18} 
                      color="#999" 
                    />
                  </Pressable>
                  
                  {expandedProvince === `sars-${index}` && (
                    <View style={styles.provinceDetails}>
                      <Text style={styles.provinceOffice}>{province.office}</Text>
                      <Text style={styles.provincePhone}>{province.phone}</Text>
                      <Pressable
                        style={styles.callBtn}
                        onPress={() => {
                          const tel = `tel:${province.phone.replace(/\s+/g, '')}`
                          Linking.openURL(tel)
                        }}
                      >
                        <Text style={styles.callBtnText}>Call</Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>

        {/* eNatis Contact */}
        <View style={styles.contactContainer}>
          <Pressable
            style={styles.contactCard}
            onPress={() => toggleContact('enatis')}
          >
            
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
              <View style={styles.contactIcon}>
                <Ionicons name="call-outline" size={18} color="#E67E22" />
              </View>
              <View style={{ flex: 1 }}>
  <Text style={styles.contactName}>{provincialContacts.homeAffairs.name}</Text>
  <Text style={styles.contactDept}>Provincial Offices</Text>
  <Text style={styles.expandHint}>Tap to see all provinces</Text>
              </View>
            </View>
            <Ionicons 
              name={expandedContact === 'enatis' ? "chevron-up" : "chevron-down"} 
              size={20} 
              color="#666" 
            />
          </Pressable>
          
          {expandedContact === 'enatis' && (
            <View style={styles.provinceList}>
              {provincialContacts.enatis.provinces.map((province, index) => (
                <View key={index}>
                  <Pressable
                    style={styles.provinceCard}
                    onPress={() => toggleProvince(`enatis-${index}`)}
                  >
                    <Text style={styles.provinceName}>{province.name}</Text>
                    <Ionicons 
                      name={expandedProvince === `enatis-${index}` ? "chevron-up" : "chevron-down"} 
                      size={18} 
                      color="#999" 
                    />
                  </Pressable>
                  
                  {expandedProvince === `enatis-${index}` && (
                    <View style={styles.provinceDetails}>
                      <Text style={styles.provinceOffice}>{province.office}</Text>
                      <Text style={styles.provincePhone}>{province.phone}</Text>
                      <Pressable
                        style={styles.callBtn}
                        onPress={() => {
                          const tel = `tel:${province.phone.replace(/\s+/g, '')}`
                          Linking.openURL(tel)
                        }}
                      >
                        <Text style={styles.callBtnText}>Call</Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
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

  welcomeCard: { margin: 16, padding: 30, backgroundColor: '#fff', borderRadius: 14, flexDirection: 'row', alignItems: 'center', gap: 12, ...cardShadow },
  avatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#1A2B4A', alignItems: 'center', justifyContent: 'center' },
  welcomeHi: { fontSize: 20, color: '#1A2B4A', fontWeight: '700' },
  welcomeSub: { fontSize: 16, color: '#5A6C7D' },

  sectionTitle: { marginTop: 24, marginHorizontal: 16, marginBottom: 12, fontSize: 16, fontWeight: '700', color: '#222', letterSpacing: 0.3 },
  rowBetween: { marginHorizontal: 16, marginTop: 10, marginBottom: 6, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  viewAll: { color: '#de6c0fff', fontWeight: '600' },

  servicesGrid: { flexDirection: 'row', gap: 12, paddingHorizontal: 16 },
  serviceCard: { flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 12, alignItems: 'center', ...cardShadow },
  serviceIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  serviceText: { fontSize: 14, color: '#222', fontWeight: '600' },
  serviceDesc: { fontSize: 11, color: '#6B7280', marginTop: 2 },

  notificationCard: { marginHorizontal: 16, marginBottom: 10, backgroundColor: '#fff', borderRadius: 12, padding: 12, ...cardShadow },
  dotActive: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#de6c0fff', marginRight: 6 },
  notificationTitle: { fontSize: 14, fontWeight: '700', color: '#1A2B4A' },
  notificationDesc: { fontSize: 13, color: '#334155', marginBottom: 6 },
  notificationTime: { fontSize: 12, color: '#5A6C7D' },
  expandHint: { fontSize: 11, color: '#9CA3AF', marginTop: 2, fontStyle: 'italic' },

  contactContainer: { marginHorizontal: 16, marginBottom: 12 },
  contactCard: { 
    backgroundColor: '#fff', 
    borderRadius: 12, 
    padding: 12, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    ...cardShadow 
  },
  contactIcon: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#ed7e2f22', alignItems: 'center', justifyContent: 'center' },
  contactName: { fontSize: 14, fontWeight: '700', color: '#37291fff' },
  contactDept: { fontSize: 12, color: '#80756bff' },
  
  provinceList: { 
    backgroundColor: '#F9FAFB', 
    borderBottomLeftRadius: 12, 
    borderBottomRightRadius: 12, 
    overflow: 'hidden',
    marginTop: 2
  },
  provinceCard: { 
    backgroundColor: '#fff', 
    padding: 14, 
    borderBottomWidth: 1, 
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  provinceName: { fontSize: 13, fontWeight: '600', color: '#374151' },
  
  provinceDetails: { 
    backgroundColor: '#F9FAFB', 
    padding: 14,
    paddingLeft: 28,
    borderLeftWidth: 3,
    borderLeftColor: '#E67E22'
  },
  provinceOffice: { fontSize: 12, color: '#6B7280', marginBottom: 4 },
  provincePhone: { fontSize: 13, color: '#E67E22', marginBottom: 10, fontWeight: '600' },
  
  callBtn: { 
    backgroundColor: '#f8ebe6ff', 
    paddingHorizontal: 14, 
    paddingVertical: 8, 
    borderRadius: 10,
    alignSelf: 'flex-start'
  },
  callBtnText: { color: '#E67E22', fontWeight: '700', fontSize: 13 },
})
