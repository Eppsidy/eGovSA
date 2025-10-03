import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useMemo, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native'
import Header from '../../src/components/Header'
import { useAuth } from '../../src/contexts/AuthContext'

export default function ProfileScreen() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  const fullName = useMemo(() => {
    const fn = user?.first_name?.trim()
    const ln = user?.last_name?.trim()
    const name = [fn, ln].filter(Boolean).join(' ')
    return name || 'Thabo Mthembu'
  }, [user])

  const idNumber = useMemo(() => {
    // Placeholder SA ID if none available. Your backend can supply a real value later.
    const raw = user?.id
    // If looks like a UUID, present a short version to avoid overflowing the UI
    if (raw && raw.includes('-')) return `${raw.slice(0, 8)}…`
    return raw || '8901234567890'
  }, [user])

  const email = user?.email || 'thabo.mthembu@email.com'
  const phone = user?.phone || '+27 82 123 4567'
  const memberSince = useMemo(() => {
    const iso = user?.created_at
    if (!iso) return '15/03/2022'
    try {
      const d = new Date(iso)
      const dd = String(d.getDate()).padStart(2, '0')
      const mm = String(d.getMonth() + 1).padStart(2, '0')
      const yyyy = d.getFullYear()
      return `${dd}/${mm}/${yyyy}`
    } catch {
      return '15/03/2022'
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

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {/* Profile header card */}
        <View style={styles.cardProfile}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={26} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={styles.name}>{fullName}</Text>
              <View style={styles.verifiedPill}>
                <Ionicons name="checkmark-circle" size={14} color="#16a34a" />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            </View>
            <View style={{ marginTop: 8, gap: 4 }}>
              <DetailRow icon="card-outline" label={`ID: ${idNumber}`} />
              <DetailRow icon="mail-outline" label={email} />
              <DetailRow icon="call-outline" label={phone} />
              <DetailRow icon="calendar-outline" label={`Member since ${memberSince}`} />
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
            onPress={() => router.push('/personal-info' as any)}
          />
          <ListItem
            icon="notifications-outline"
            title="Notifications"
            subtitle="Manage your alerts"
            right={() => (
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#e5e7eb', true: '#c7f2d5' }}
                thumbColor={notificationsEnabled ? '#16a34a' : '#9ca3af'}
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
          <Ionicons name="exit-outline" color="#dc2626" size={18} />
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
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    ...cardShadow,
  },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#0a7ea4', alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 16, fontWeight: '800', color: '#111827' },
  verifiedPill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#e8fbea', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  verifiedText: { color: '#166534', fontSize: 11, fontWeight: '800' },
  detailText: { fontSize: 12, color: '#475569' },

  cardList: { marginHorizontal: 16, backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden', ...cardShadow },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 12, borderBottomColor: '#eef2f7', borderBottomWidth: StyleSheet.hairlineWidth },
  itemLeftIcon: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center' },
  itemTitle: { fontSize: 13, fontWeight: '700', color: '#1f2937' },
  itemSubtitle: { fontSize: 11, color: '#6b7280' },

  signOutBtn: { margin: 16, paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: '#fecaca', backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  signOutText: { color: '#dc2626', fontWeight: '800' },
})
