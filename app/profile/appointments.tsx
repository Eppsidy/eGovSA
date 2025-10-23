import { Ionicons } from '@expo/vector-icons'
import React, { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, Alert, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native'
import Header from '../../src/components/Header'
import { useAuth } from '../../src/contexts/AuthContext'
import { Appointment as AppointmentType, getUserAppointments } from '../../src/lib/api'

export default function AppointmentsScreen() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState<AppointmentType[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchAppointments = useCallback(async () => {
    if (!user?.id) return

    try {
      const data = await getUserAppointments(user.id)
      // Filter to show only upcoming/scheduled appointments
      const upcoming = data.filter(apt => apt.status === 'Scheduled')
      setAppointments(upcoming)
    } catch (error) {
      console.error('Failed to fetch appointments:', error)
      Alert.alert('Error', 'Failed to load appointments. Please try again.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [user?.id])

  useEffect(() => {
    fetchAppointments()
  }, [fetchAppointments])

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    fetchAppointments()
  }, [fetchAppointments])

  const formatDate = (isoString: string): string => {
    const date = new Date(isoString)
    return date.toLocaleDateString('en-ZA', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const formatTime = (isoString: string, timeString?: string): string => {
    if (timeString) return timeString
    const date = new Date(isoString)
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  if (loading) {
    return (
      <View style={styles.page}>
        <Header />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#27AE60" />
          <Text style={styles.loadingText}>Loading appointments...</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.page}>
      <Header />
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#E67E22']}
            tintColor="#E67E22"
          />
        }
      >
        <Text style={styles.title}>Appointments</Text>
        <Text style={styles.subtitle}>Scheduled visits</Text>
        
        {appointments.length === 0 ? (
          <View style={styles.card}>
            <Ionicons name="calendar-outline" size={48} color="#ccc" style={{ alignSelf: 'center', marginBottom: 12 }} />
            <Text style={styles.empty}>No upcoming appointments.</Text>
            <Text style={styles.smallNote}>Schedule a visit for services like Smart ID, Passport, or testing centers.</Text>
          </View>
        ) : (
          appointments.map((appointment) => (
            <View key={appointment.id} style={styles.appointmentCard}>
              <View style={styles.appointmentHeader}>
                <View style={styles.iconContainer}>
                  <Ionicons name="calendar" size={24} color="#E67E22" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.serviceType}>{appointment.serviceType}</Text>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>{appointment.status}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.appointmentDetails}>
                <View style={styles.detailRow}>
                  <Ionicons name="calendar-outline" size={16} color="#6b7280" />
                  <Text style={styles.detailText}>{formatDate(appointment.appointmentDate)}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Ionicons name="time-outline" size={16} color="#6b7280" />
                  <Text style={styles.detailText}>{formatTime(appointment.appointmentDate, appointment.appointmentTime)}</Text>
                </View>

                {appointment.location && (
                  <View style={styles.detailRow}>
                    <Ionicons name="location-outline" size={16} color="#6b7280" />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.detailText}>{appointment.location}</Text>
                      {appointment.locationAddress && (
                        <Text style={styles.addressText}>{appointment.locationAddress}</Text>
                      )}
                    </View>
                  </View>
                )}

                {appointment.notes && (
                  <View style={styles.notesContainer}>
                    <Ionicons name="information-circle-outline" size={16} color="#f59e0b" />
                    <Text style={styles.notesText}>{appointment.notes}</Text>
                  </View>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#f6f8fb' },
  content: { padding: 16 },
  title: { fontSize: 18, fontWeight: '800', color: '#111827' },
  subtitle: { fontSize: 12, color: '#6b7280', marginBottom: 12 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  empty: { fontSize: 14, fontWeight: '700', color: '#1f2937', marginBottom: 6 },
  smallNote: { fontSize: 12, color: '#6b7280' },
  appointmentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  appointmentHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceType: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E40AF',
  },
  appointmentDetails: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  addressText: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  notesContainer: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 8,
    marginTop: 4,
  },
  notesText: {
    fontSize: 13,
    color: '#92400E',
    flex: 1,
  },
})
