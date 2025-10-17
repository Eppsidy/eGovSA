import { Ionicons } from '@expo/vector-icons'
import { useFocusEffect, useRouter } from 'expo-router'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, Pressable, RefreshControl, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native'
import Header from '../../src/components/Header'
import { useAuth } from '../../src/contexts/AuthContext'
import { fetchProfile, registerPushToken, updateNotificationSettings } from '../../src/lib/api'
import { checkNotificationPermissions, registerForPushNotificationsAsync } from '../../src/lib/pushNotifications'

export default function ProfileScreen() {
  const { user, signOut, refreshUser } = useAuth()
  const router = useRouter()
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [updatingNotifications, setUpdatingNotifications] = useState(false)

  // Initialize notification state from user profile
  useEffect(() => {
    if (user?.push_notifications_enabled !== undefined) {
      setNotificationsEnabled(user.push_notifications_enabled)
    }
  }, [user?.push_notifications_enabled])

  // Refresh profile data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log('Profile screen focused - refreshing user data')
      refreshUser()
      // Also fetch from backend to ensure we have latest data
      if (user?.id) {
        fetchProfile(user.id).catch(err => {
          console.error('Failed to fetch profile on focus:', err)
        })
      }
    }, [user?.id])
  )

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await refreshUser()
    // Also fetch from backend
    if (user?.id) {
      try {
        await fetchProfile(user.id)
      } catch (error) {
        console.error('Failed to fetch profile on refresh:', error)
      }
    }
    setRefreshing(false)
  }, [user?.id])

  const handleNotificationToggle = async (value: boolean) => {
    if (!user?.id) {
      Alert.alert('Error', 'User not found. Please log in again.')
      return
    }

    setUpdatingNotifications(true)

    try {
      if (value) {
        // Enabling notifications - request permission and register token
        const hasPermission = await checkNotificationPermissions()
        
        if (!hasPermission) {
          // Request permission (this will return null in Expo Go but won't crash)
          const token = await registerForPushNotificationsAsync()
          
          if (!token) {
            // Check if we're in Expo Go by looking for the warning message
            const isExpoGo = process.env.EXPO_PUBLIC_APP_VARIANT !== 'development'
            
            Alert.alert(
              isExpoGo ? 'Expo Go Limitation' : 'Permission Denied',
              isExpoGo 
                ? 'Push notifications are not supported in Expo Go (SDK 53+). The setting will be saved, but you need to use a development build to test push notifications. See PUSH_NOTIFICATIONS_SETUP.md for instructions.'
                : 'Push notifications require permission. Please enable notifications in your device settings.',
              [{ text: 'OK' }]
            )
            
            // Still save the preference to the backend even if token registration failed
            // This allows the setting to be ready when user installs a development build
            await updateNotificationSettings(user.id, true)
            setNotificationsEnabled(true)
            await refreshUser()
            setUpdatingNotifications(false)
            return
          }

          // Register token with backend (only if we got a valid token)
          await registerPushToken(user.id, token)
        }

        // Update notification setting
        await updateNotificationSettings(user.id, true)
        setNotificationsEnabled(true)
        
        Alert.alert('Success', 'Push notifications enabled successfully!')
      } else {
        // Disabling notifications
        await updateNotificationSettings(user.id, false)
        setNotificationsEnabled(false)
        
        Alert.alert('Success', 'Push notifications disabled.')
      }

      // Refresh user data
      await refreshUser()
    } catch (error: any) {
      console.error('Error updating notification settings:', error)
      Alert.alert(
        'Error',
        'Failed to update notification settings. Please try again.'
      )
      // Revert the toggle state
      setNotificationsEnabled(!value)
    } finally {
      setUpdatingNotifications(false)
    }
  }

  const fullName = useMemo(() => {
    const fn = user?.first_name?.trim()
    const ln = user?.last_name?.trim()
    const name = [fn, ln].filter(Boolean).join(' ')
    console.log('Profile: fullName computed:', { fn, ln, name, fullName: user?.full_name })
    return name || user?.full_name || 'User'
  }, [user])

  const idNumber = useMemo(() => {
    console.log('Profile: idNumber from user:', user?.id_number)
    return user?.id_number || null
  }, [user])

  const email = user?.email || null
  const phone = user?.phone || null
  
  console.log('Profile: user data:', { 
    email, 
    phone, 
    id_number: user?.id_number,
    gender: user?.gender,
    dateOfBirth: user?.date_of_birth 
  })
  const gender = user?.gender || null
  const dateOfBirth = user?.date_of_birth || null
  const residentialAddress = user?.residential_address || null
  
  const memberSince = useMemo(() => {
    const iso = user?.created_at
    if (!iso) return null
    try {
      const d = new Date(iso)
      const dd = String(d.getDate()).padStart(2, '0')
      const mm = String(d.getMonth() + 1).padStart(2, '0')
      const yyyy = d.getFullYear()
      return `${dd}/${mm}/${yyyy}`
    } catch {
      return null
    }
  }, [user?.created_at])

  const signOutNow = async () => {
    try {
      await signOut()
      router.replace('/login/login-email' as any)
    } catch (e) {
      // no-op; surface errors in a toast in future
    }
  }

  return (
    <View style={styles.page}>
      <Header />

      <ScrollView 
        contentContainerStyle={{ paddingBottom: 120 }} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor="#E67E22"
            colors={["#E67E22"]}
          />
        }
      >
        {/* Profile header card */}
        <View style={styles.cardProfile}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={26} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={styles.name}>{fullName}</Text>
              <View style={styles.verifiedPill}>
                <Ionicons name="checkmark-circle" size={14} color="#fff" />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            </View>
            <View style={{ marginTop: 8, gap: 4 }}>
              {idNumber && <DetailRow icon="card-outline" label={`ID: ${idNumber}`} />}
              {email && <DetailRow icon="mail-outline" label={email} />}
              {phone && <DetailRow icon="call-outline" label={phone} />}
              {gender && <DetailRow icon="person-outline" label={`Gender: ${gender}`} />}
              {dateOfBirth && <DetailRow icon="calendar-outline" label={`DOB: ${dateOfBirth}`} />}
              {residentialAddress && <DetailRow icon="location-outline" label={residentialAddress} />}
              {memberSince && <DetailRow icon="time-outline" label={`Member since ${memberSince}`} />}
            </View>
          </View>

          <TouchableOpacity accessibilityRole="button" hitSlop={8} onPress={() => router.push('/profile/personal-info' as any)}>
            <Ionicons name="pencil" size={18} color="#64748b" />
          </TouchableOpacity>
        </View>

        {/* Account */}
        <SectionTitle title="Account" />
        <View style={styles.cardList}>
          <ListItem
            icon="person-circle-outline"
            title="Personal Information"
            subtitle="Update your details"
            onPress={() => router.push('profile/personal-info' as any)}
          />
          <ListItem
            icon="notifications-outline"
            title="Notifications"
            subtitle={notificationsEnabled ? 'Push notifications enabled' : 'Push notifications disabled'}
            right={() => (
              <Switch
                value={notificationsEnabled}
                onValueChange={handleNotificationToggle}
                disabled={updatingNotifications}
                trackColor={{ false: '#e5e7eb', true: '#f2dfc7ff' }}
                thumbColor={notificationsEnabled ? '#E67E22' : '#9ca3af'}
              />
            )}
          />
        </View>

        {/* Services */}
        <SectionTitle title="Services" />
        <View style={styles.cardList}>
          <ListItem icon="card-outline" title="Payment Methods" subtitle="Cards & bank accounts" onPress={() => router.push('/profile/payment-methods' as any)} />
          <ListItem icon="location-outline" title="Addresses" subtitle="Home & business addresses" onPress={() => router.push('/profile/addresses' as any)} />
          <ListItem icon="calendar-outline" title="Appointments" subtitle="Scheduled visits" onPress={() => router.push('/profile/appointments' as any)} />
        </View>

        {/* Support */}
        <SectionTitle title="Support" />
        <View style={styles.cardList}>
          <ListItem icon="help-circle-outline" title="Help Center" subtitle="FAQs and guides" onPress={() => router.push('/profile/help-center' as any)} />
          <ListItem icon="document-text-outline" title="Terms & Privacy" subtitle="Legal information" onPress={() => router.push('/profile/terms-privacy' as any)} />
        </View>

        {/* Footer */}
        <Pressable style={styles.signOutBtn} onPress={signOutNow}>
          <Ionicons name="exit-outline" color="#fff" size={18} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </Pressable>
      </ScrollView>
    </View>
  )
}

function SectionTitle({ title }: { title: string }) {
  return <Text style={styles.sectionTitle}>{title}</Text>
}

function DetailRow({ icon, label }: { icon: React.ComponentProps<typeof Ionicons>['name']; label: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <Ionicons name={icon} size={14} color="#64748b" />
      <Text style={styles.detailText}>{label}</Text>
    </View>
  )
}

function ListItem({
  icon,
  title,
  subtitle,
  onPress,
  right,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name']
  title: string
  subtitle?: string
  onPress?: () => void
  right?: () => React.ReactNode
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.itemRow, pressed && { opacity: 0.9 }]}>
      <View style={styles.itemLeftIcon}>
        <Ionicons name={icon} size={18} color="#1f2937" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.itemTitle}>{title}</Text>
        {!!subtitle && <Text style={styles.itemSubtitle}>{subtitle}</Text>}
      </View>
      {right ? (
        right()
      ) : (
        <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
      )}
    </Pressable>
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

  sectionTitle: { marginTop: 12, marginHorizontal: 16, marginBottom: 8, fontSize: 12, fontWeight: '800', color: '#6b7280' },

  cardProfile: {
  margin: 16,
  backgroundColor: '#fff',
  borderRadius: 16,
  padding: 16,
  flexDirection: 'row',
  alignItems: 'flex-start',
  gap: 12,
  ...cardShadow,
},

  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#1A2B4A', alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 17, fontWeight: '800', color: '#111827' },
  
  verifiedPill: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 4,
  backgroundColor: '#E67E22',
  paddingHorizontal: 10,
  paddingVertical: 4,
  borderRadius: 20,
},
verifiedText: {
  color: '#fff',
  fontSize: 11,
  fontWeight: '700',
  letterSpacing: 0.2,
},
  detailText: { fontSize: 12, color: '#475569' },

  cardList: { marginHorizontal: 16, backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden', ...cardShadow },
 itemRow: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 12,
  paddingHorizontal: 16,
  paddingVertical: 14,
  borderBottomColor: '#f1f5f9',
  borderBottomWidth: StyleSheet.hairlineWidth,
},
itemLeftIcon: {
  width: 32,
  height: 32,
  borderRadius: 16,
  backgroundColor: '#f9fafb',
  alignItems: 'center',
  justifyContent: 'center',
},
itemTitle: {
  fontSize: 14,
  fontWeight: '700',
  color: '#1e293b',
},
itemSubtitle: {
  fontSize: 11,
  color: '#6b7280',
  marginTop: 1,
},


  signOutBtn: {
  margin: 16,
  paddingVertical: 14,
  borderRadius: 12,
  backgroundColor: '#E67E22',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  shadowColor: '#E67E22',
  shadowOpacity: 0.3,
  shadowRadius: 6,
  elevation: 3,
},
signOutText: { 
  color: '#fff', 
  fontWeight: '800', 
  fontSize: 14,
},

})
