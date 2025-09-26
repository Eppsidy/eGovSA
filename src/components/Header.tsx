import { Ionicons } from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type HeaderProps = {
  title?: string
  subtitle?: string
  badgeCount?: number
  onPressBell?: () => void
}

export default function Header({
  title = 'eGov SA',
  subtitle = 'Government Services',
  badgeCount = 2,
  onPressBell,
}: HeaderProps) {
  return (
    <SafeAreaView edges={['top']} style={styles.safeTop}>
      <StatusBar style="dark" />
      <View style={styles.headerBar}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>SA</Text>
          </View>
          <View>
            <Text style={styles.appName}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>
        </View>

        <TouchableOpacity onPress={onPressBell} style={styles.bellWrap} accessibilityRole="button" accessibilityLabel="Notifications">
          <Ionicons name="notifications-outline" size={22} color="#222" />
          {badgeCount > 0 ? (
            <View style={styles.badge}><Text style={styles.badgeText}>{badgeCount}</Text></View>
          ) : null}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const shadow = {
  shadowColor: '#000',
  shadowOpacity: 0.08,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 3 },
  elevation: 3,
}

const styles = StyleSheet.create({
  safeTop: { backgroundColor: '#fff' },
  headerBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 6, paddingBottom: 10, backgroundColor: '#fff', ...shadow },
  logoCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#2F80ED22', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  logoText: { fontSize: 12, fontWeight: '700', color: '#2F80ED' },
  appName: { fontSize: 16, fontWeight: '700', color: '#222' },
  subtitle: { fontSize: 11, color: '#667085' },
  bellWrap: { position: 'relative', padding: 6 },
  badge: { position: 'absolute', right: 0, top: -2, backgroundColor: '#E11D48', minWidth: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
})
