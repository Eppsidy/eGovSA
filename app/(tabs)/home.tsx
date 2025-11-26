import { Ionicons } from '@expo/vector-icons'
import { Link, useRouter } from 'expo-router'
import React, { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, Alert, ImageBackground, Linking, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Header from '../../src/components/Header'
import { useAuth } from '../../src/contexts/AuthContext'
import { useThemeColor } from '../../src/hooks/useThemeColor'
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
  name: 'eNatis Contact Center',
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
  const colors = useThemeColor()
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

  const formatTimestamp = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    
    // Check if it's today
    const isToday = date.toDateString() === now.toDateString()
    
    // Check if it's yesterday
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)
    const isYesterday = date.toDateString() === yesterday.toDateString()
    
    // Format time as HH:MM AM/PM
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const ampm = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours % 12 || 12
    const displayMinutes = minutes.toString().padStart(2, '0')
    const timeString = `${displayHours}:${displayMinutes} ${ampm}`
    
    if (isToday) {
      return `Today at ${timeString}`
    } else if (isYesterday) {
      return `Yesterday at ${timeString}`
    } else {
      // Format as "Oct 21, 2025 at 2:30 PM"
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const month = monthNames[date.getMonth()]
      const day = date.getDate()
      const year = date.getFullYear()
      return `${month} ${day}, ${year} at ${timeString}`
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
    key: 'appointments',
    title: 'My Appointments',
    subtitle: 'View and manage your scheduled visits',
    image: { uri: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=2068&auto=format&fit=crop' },
    color: '#8B5CF6',
    icon: 'calendar',
    onPress: () => router.push('/profile/appointments' as any),
  },
  {
    key: 'applications',
    title: 'My Applications',
    subtitle: 'Track your submitted applications',
    image: { uri: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2070&auto=format&fit=crop' },
    color: '#3B82F6',
    icon: 'document-text',
    onPress: () => router.push('/(tabs)/applications' as any),
  },
  {
    key: 'services',
    title: 'All Services',
    subtitle: 'Browse government services',
    image: { uri: 'https://images.unsplash.com/photo-1523292562811-8fa7962a78c8?q=80&w=2070&auto=format&fit=crop' },
    color: '#10B981',
    icon: 'grid',
    onPress: () => router.push('/(tabs)/services' as any),
  },
] as const

  return (
    <View style={[styles.page, { backgroundColor: colors.background }]}>
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
        <View style={[styles.welcomeCard, { backgroundColor: colors.card }]}>
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
                <Text style={[styles.welcomeHi, { color: colors.text }]}>
                  {welcomeData?.message || `Hi ${user?.first_name ? `, ${user.first_name}` : ', User'}`}
                </Text>
                <Text style={[styles.welcomeSub, { color: colors.textSecondary }]}>Welcome back to eGov SA</Text>
              </>
            )}
          </View>
          <Ionicons name="shield-checkmark-outline" size={22} color="#fff" />
        </View>

        {/* Quick Access - Appointments */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Access</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScroll}
        >
          {services.map((service) => (
            <TouchableOpacity 
              key={service.key}
              style={styles.appointmentFeatureCard}
              onPress={service.onPress}
              activeOpacity={0.9}
            >
              <ImageBackground
                source={service.image}
                style={styles.cardImageBackground}
                imageStyle={{ borderRadius: 16 }}
              >
                <View style={styles.cardOverlay}>
                  <View style={[styles.appointmentIconCircle, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                    <Ionicons name={service.icon as any} size={32} color="#fff" />
                  </View>
                  <View style={styles.appointmentContent}>
                    <Text style={styles.appointmentTitle}>{service.title}</Text>
                    <Text style={styles.appointmentSubtitle}>{service.subtitle}</Text>
                    <View style={styles.appointmentButton}>
                      <Text style={[styles.appointmentButtonText, { color: service.color }]}>View</Text>
                      <Ionicons name="arrow-forward" size={16} color={service.color} />
                    </View>
                  </View>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Notifications */}
        <View style={styles.rowBetween}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Notifications</Text>
          <Link href={'/notifications' as any} style={[styles.viewAll, { color: colors.accentHover }]}>View All ▸</Link>
        </View>

        {loadingNotifications ? (
          <View style={{ marginHorizontal: 16, marginBottom: 10, backgroundColor: colors.card, borderRadius: 12, padding: 20, alignItems: 'center', ...cardShadow }}>
            <ActivityIndicator size="small" color={colors.success} />
            <Text style={{ marginTop: 8, fontSize: 12, color: colors.textTertiary }}>Loading notifications...</Text>
          </View>
        ) : notifications.length === 0 ? (
          <View style={{ marginHorizontal: 16, marginBottom: 10, backgroundColor: colors.card, borderRadius: 12, padding: 20, alignItems: 'center', ...cardShadow }}>
            <Ionicons name="notifications-off-outline" size={32} color={colors.textMuted} />
            <Text style={{ marginTop: 8, fontSize: 13, color: colors.textTertiary }}>No notifications yet</Text>
          </View>
        ) : (
          notifications.map((n) => (
            <View key={n.id} style={[styles.notificationCard, { backgroundColor: colors.card }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                {!n.isRead && <View style={styles.dotActive} />}
                <Text style={[styles.notificationTitle, { color: colors.text }]}>{n.title}</Text>
              </View>
              <Text style={[styles.notificationDesc, { color: colors.textSecondary }]}>{n.description}</Text>
              <Text style={[styles.notificationTime, { color: colors.textTertiary }]}>{formatTimestamp(n.createdAt)}</Text>
            </View>
          ))
        )}

        {/* Contacts - Expandable */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Contacts</Text>
        
        {/* Home Affairs Contact */}
        <View style={styles.contactContainer}>
          <Pressable
            style={[styles.contactCard, { backgroundColor: colors.card }]}
            onPress={() => toggleContact('homeAffairs')}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
              <View style={[styles.contactIcon, { backgroundColor: colors.contactIconBg }]}>
                <Ionicons name="call-outline" size={18} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.contactName, { color: colors.text }]}>{provincialContacts.homeAffairs.name}</Text>
                <Text style={[styles.contactDept, { color: colors.textSecondary }]}>Provincial Offices</Text>
              </View>
            </View>
            <Ionicons 
              name={expandedContact === 'homeAffairs' ? "chevron-up" : "chevron-down"} 
              size={20} 
              color="#666" 
            />
          </Pressable>
          
          {expandedContact === 'homeAffairs' && (
            <View style={[styles.provinceList, { backgroundColor: colors.cardHover }]}>
              {provincialContacts.homeAffairs.provinces.map((province, index) => (
                <View key={index}>
                  <Pressable
                    style={[styles.provinceCard, { backgroundColor: colors.card, borderBottomColor: colors.border }]}
                    onPress={() => toggleProvince(`homeAffairs-${index}`)}
                  >
                    <Text style={[styles.provinceName, { color: colors.text }]}>{province.name}</Text>
                    <Ionicons 
                      name={expandedProvince === `homeAffairs-${index}` ? "chevron-up" : "chevron-down"} 
                      size={18} 
                      color="#999" 
                    />
                  </Pressable>
                  
                  {expandedProvince === `homeAffairs-${index}` && (
                    <View style={[styles.provinceDetails, { backgroundColor: colors.cardHover, borderLeftColor: colors.primary }]}>
                      <Text style={[styles.provinceOffice, { color: colors.textTertiary }]}>{province.office}</Text>
                      <Text style={[styles.provincePhone, { color: colors.primary }]}>{province.phone}</Text>
                      <Pressable
                        style={[styles.callBtn, { backgroundColor: colors.primaryLight }]}
                        onPress={() => {
                          const tel = `tel:${province.phone.replace(/\s+/g, '')}`
                          Linking.openURL(tel)
                        }}
                      >
                        <Text style={[styles.callBtnText, { color: colors.primary }]}>Call</Text>
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
            style={[styles.contactCard, { backgroundColor: colors.card }]}
            onPress={() => toggleContact('sars')}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
              <View style={[styles.contactIcon, { backgroundColor: colors.contactIconBg }]}>
  <Ionicons name="call-outline" size={18} color={colors.primary} />
</View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.contactName, { color: colors.text }]}>{provincialContacts.sars.name}</Text>
                <Text style={[styles.contactDept, { color: colors.textSecondary }]}>Tax Services</Text>
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
            style={[styles.contactCard, { backgroundColor: colors.card }]}
            onPress={() => toggleContact('enatis')}
          >
            
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
              <View style={[styles.contactIcon, { backgroundColor: colors.contactIconBg }]}>
                <Ionicons name="call-outline" size={18} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
  <Text style={[styles.contactName, { color: colors.text }]}>{provincialContacts.enatis.name}</Text>
  <Text style={[styles.contactDept, { color: colors.textSecondary }]}>Provincial Offices</Text>
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
  page: { flex: 1 },

  welcomeCard: { margin: 16, padding: 30, borderRadius: 14, flexDirection: 'row', alignItems: 'center', gap: 12, ...cardShadow },
  avatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#1A2B4A', alignItems: 'center', justifyContent: 'center' },
  welcomeHi: { fontSize: 20, fontWeight: '700' },
  welcomeSub: { fontSize: 16 },

  sectionTitle: { marginTop: 24, marginHorizontal: 16, marginBottom: 12, fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },
  rowBetween: { marginHorizontal: 16, marginTop: 10, marginBottom: 6, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  viewAll: { fontWeight: '600' },

  servicesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingHorizontal: 16 },
  serviceCard: { width: '47%', borderRadius: 12, padding: 12, alignItems: 'center', ...cardShadow },
  serviceIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  serviceText: { fontSize: 14, fontWeight: '600' },
  serviceDesc: { fontSize: 11, marginTop: 2 },

  horizontalScroll: {
    paddingHorizontal: 16,
    gap: 16,
  },
  appointmentFeatureCard: {
    width: 320,
    height: 180,
    borderRadius: 16,
    ...cardShadow,
    overflow: 'hidden',
  },
  cardImageBackground: {
    width: '100%',
    height: '100%',
  },
  cardOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  appointmentIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  appointmentContent: {
    flex: 1,
    minWidth: 0,
  },
  appointmentTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
    flexWrap: 'wrap',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
  },
  appointmentSubtitle: {
    fontSize: 13,
    color: '#E9D5FF',
    marginBottom: 12,
    flexWrap: 'wrap',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
  },
  appointmentButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  appointmentButtonText: {
    fontWeight: '700',
    fontSize: 13,
  },

  notificationCard: { marginHorizontal: 16, marginBottom: 10, borderRadius: 12, padding: 12, ...cardShadow },
  dotActive: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#de6c0fff', marginRight: 6 },
  notificationTitle: { fontSize: 14, fontWeight: '700' },
  notificationDesc: { fontSize: 13, marginBottom: 6 },
  notificationTime: { fontSize: 12 },
  expandHint: { fontSize: 11, marginTop: 2, fontStyle: 'italic' },

  contactContainer: { marginHorizontal: 16, marginBottom: 12 },
  contactCard: { 
    borderRadius: 12, 
    padding: 12, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    ...cardShadow 
  },
  contactIcon: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  contactName: { fontSize: 14, fontWeight: '700' },
  contactDept: { fontSize: 12 },
  
  provinceList: { 
    borderBottomLeftRadius: 12, 
    borderBottomRightRadius: 12, 
    overflow: 'hidden',
    marginTop: 2
  },
  provinceCard: { 
    padding: 14, 
    borderBottomWidth: 1, 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  provinceName: { fontSize: 13, fontWeight: '600' },
  
  provinceDetails: { 
    padding: 14,
    paddingLeft: 28,
    borderLeftWidth: 3,
  },
  provinceOffice: { fontSize: 12, marginBottom: 4 },
  provincePhone: { fontSize: 13, marginBottom: 10, fontWeight: '600' },
  
  callBtn: { 
    paddingHorizontal: 14, 
    paddingVertical: 8, 
    borderRadius: 10,
    alignSelf: 'flex-start'
  },
  callBtnText: { fontWeight: '700', fontSize: 13 },
})
