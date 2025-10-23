import { Ionicons } from '@expo/vector-icons'
import { Stack } from 'expo-router'
import React, { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, Alert, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useAuth } from '../src/contexts/AuthContext'
import { getActiveUserNotifications, markNotificationAsRead, Notification as NotificationType } from '../src/lib/api'

export default function NotificationsScreen() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<NotificationType[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchNotifications = useCallback(async () => {
    if (!user?.id) return

    try {
      const data = await getActiveUserNotifications(user.id)
      setNotifications(data)
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
      Alert.alert('Error', 'Failed to load notifications. Please try again.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [user?.id])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    fetchNotifications()
  }, [fetchNotifications])

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId)
      // Update local state
      setNotifications(prev => prev.map(n => 
        n.id === notificationId ? { ...n, isRead: true } : n
      ))
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

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

  const getNotificationIcon = (type: string): string => {
    switch (type) {
      case 'APPOINTMENT_CREATED':
        return 'calendar'
      case 'APPLICATION_UPDATE':
        return 'document-text'
      case 'DOCUMENT_READY':
        return 'checkmark-circle'
      default:
        return 'notifications'
    }
  }

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <Stack.Screen options={{ 
          headerShown: true, 
          title: 'Notifications',
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerShadowVisible: false,
        }} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#27AE60" />
          <Text style={{ marginTop: 16, fontSize: 16, color: '#6B7280' }}>Loading notifications...</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Stack.Screen options={{ 
        headerShown: true, 
        title: 'Notifications',
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerShadowVisible: false,
      }} />
      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#27AE60']}
            tintColor="#27AE60"
          />
        }
      >
        {notifications.length === 0 ? (
          <View style={{ alignItems: 'center', paddingVertical: 48 }}>
            <Ionicons name="notifications-off-outline" size={64} color="#ccc" />
            <Text style={{ fontSize: 16, color: '#6B7280', marginTop: 16 }}>No notifications yet</Text>
            <Text style={{ fontSize: 14, color: '#9CA3AF', marginTop: 8 }}>
              You'll see updates about your applications and appointments here
            </Text>
          </View>
        ) : (
          notifications.map((n) => (
            <TouchableOpacity
              key={n.id}
              style={[styles.card, !n.isRead && styles.unreadCard]}
              onPress={() => !n.isRead && handleMarkAsRead(n.id)}
              activeOpacity={0.7}
            >
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={[styles.iconContainer, !n.isRead && styles.unreadIcon]}>
                  <Ionicons 
                    name={getNotificationIcon(n.notificationType) as any} 
                    size={20} 
                    color={!n.isRead ? '#27AE60' : '#6B7280'} 
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Text style={[styles.title, !n.isRead && styles.unreadTitle]}>{n.title}</Text>
                    {!n.isRead && (
                      <View style={styles.unreadBadge} />
                    )}
                  </View>
                  <Text style={styles.desc}>{n.description}</Text>
                  <Text style={styles.time}>{formatTimestamp(n.createdAt)}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  card: { 
    backgroundColor: '#f6f8fb', 
    padding: 14, 
    borderRadius: 12, 
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  unreadCard: {
    backgroundColor: '#fff',
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadIcon: {
    backgroundColor: '#DCFCE7',
  },
  title: { 
    fontSize: 14, 
    fontWeight: '700', 
    color: '#1f2937', 
    marginBottom: 4,
  },
  unreadTitle: {
    color: '#111827',
  },
  desc: { 
    fontSize: 12, 
    color: '#374151', 
    marginBottom: 6,
    lineHeight: 18,
  },
  time: { 
    fontSize: 11, 
    color: '#6b7280',
  },
  unreadBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#27AE60',
  },
})
