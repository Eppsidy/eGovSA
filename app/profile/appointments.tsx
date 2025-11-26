import { Ionicons } from '@expo/vector-icons'
import React, { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, Alert, Modal, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native'
import Header from '../../src/components/Header'
import { useAuth } from '../../src/contexts/AuthContext'
import { useThemeColor } from '../../src/hooks/useThemeColor'
import { Appointment as AppointmentType, getUserAppointments } from '../../src/lib/api'

export default function AppointmentsScreen() {
  const colors = useThemeColor()
  const { user } = useAuth()
  const [appointments, setAppointments] = useState<AppointmentType[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedQR, setSelectedQR] = useState<AppointmentType | null>(null)

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
      <View style={[styles.page, { backgroundColor: colors.background }]}>
        <Header />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading appointments...</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={[styles.page, { backgroundColor: colors.background }]}>
      <Header />
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.accent]}
            tintColor={colors.accent}
          />
        }
      >
        <Text style={[styles.title, { color: colors.text }]}>Appointments</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>Scheduled visits</Text>
        
        {appointments.length === 0 ? (
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Ionicons name="calendar-outline" size={48} color={colors.textMuted} style={{ alignSelf: 'center', marginBottom: 12 }} />
            <Text style={[styles.empty, { color: colors.text }]}>No upcoming appointments.</Text>
            <Text style={[styles.smallNote, { color: colors.textSecondary }]}>Schedule a visit for services like Smart ID, Passport, or testing centers.</Text>
          </View>
        ) : (
          appointments.map((appointment) => (
            <View key={appointment.id} style={[styles.appointmentCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.appointmentHeader}>
                <View style={styles.iconContainer}>
                  <Ionicons name="calendar" size={24} color="#E67E22" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.serviceType, { color: colors.text }]}>{appointment.serviceType}</Text>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>{appointment.status}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.appointmentDetails}>
                <View style={styles.detailRow}>
                  <Ionicons name="calendar-outline" size={16} color={colors.textMuted} />
                  <Text style={[styles.detailText, { color: colors.textSecondary }]}>{formatDate(appointment.appointmentDate)}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Ionicons name="time-outline" size={16} color={colors.textMuted} />
                  <Text style={[styles.detailText, { color: colors.textSecondary }]}>{formatTime(appointment.appointmentDate, appointment.appointmentTime)}</Text>
                </View>

                {appointment.location && (
                  <View style={styles.detailRow}>
                    <Ionicons name="location-outline" size={16} color={colors.textMuted} />
                    <Text style={[styles.detailText, { color: colors.textSecondary }]}>{appointment.location}</Text>
                  </View>
                )}

                {appointment.notes && (
                  <View style={styles.notesContainer}>
                    <Ionicons name="information-circle-outline" size={16} color="#f59e0b" />
                    <Text style={styles.notesText}>{appointment.notes}</Text>
                  </View>
                )}

                <Pressable 
                  style={[styles.qrContainer, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}
                  onPress={() => setSelectedQR(appointment)}
                >
                  <View style={[styles.qrPlaceholder, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Ionicons name="qr-code-outline" size={60} color={colors.textMuted} />
                  </View>
                  <Text style={[styles.qrLabel, { color: colors.textSecondary }]}>Tap to enlarge</Text>
                  <Text style={[styles.qrId, { color: colors.textMuted }]}>#{appointment.id.slice(0, 8)}</Text>
                </Pressable>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* QR Code Modal */}
      <Modal
        visible={!!selectedQR}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedQR(null)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setSelectedQR(null)}
        >
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Appointment QR Code</Text>
              <Pressable onPress={() => setSelectedQR(null)}>
                <Ionicons name="close-circle" size={32} color={colors.textMuted} />
              </Pressable>
            </View>
            
            {selectedQR && (
              <View style={styles.qrModalContainer}>
                <View style={[styles.qrLarge, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Ionicons name="qr-code-outline" size={200} color={colors.text} />
                </View>
                <Text style={[styles.modalServiceType, { color: colors.text }]}>{selectedQR.serviceType}</Text>
                <Text style={[styles.modalAppointmentId, { color: colors.textSecondary }]}>ID: {selectedQR.id}</Text>
                <View style={styles.modalDetails}>
                  <Text style={[styles.modalDetailText, { color: colors.textSecondary }]}>
                    📅 {formatDate(selectedQR.appointmentDate)}
                  </Text>
                  <Text style={[styles.modalDetailText, { color: colors.textSecondary }]}>
                    🕐 {formatTime(selectedQR.appointmentDate, selectedQR.appointmentTime)}
                  </Text>
                  {selectedQR.location && (
                    <Text style={[styles.modalDetailText, { color: colors.textSecondary }]}>
                      📍 {selectedQR.location}
                    </Text>
                  )}
                </View>
                <Text style={[styles.modalInstruction, { color: colors.textMuted }]}>
                  Show this QR code at the office for quick check-in
                </Text>
              </View>
            )}
          </View>
        </Pressable>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  content: { padding: 16 },
  title: { fontSize: 18, fontWeight: '800' },
  subtitle: { fontSize: 12, marginBottom: 12 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  card: { borderRadius: 12, padding: 16, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  empty: { fontSize: 14, fontWeight: '700', marginBottom: 6 },
  smallNote: { fontSize: 12 },
  appointmentCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
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
  qrContainer: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 12,
  },
  qrPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  qrLabel: {
    fontSize: 10,
    marginTop: 4,
    fontWeight: '600',
  },
  qrId: {
    fontSize: 9,
    marginTop: 2,
    fontFamily: 'monospace',
  },
  serviceType: {
    fontSize: 16,
    fontWeight: '700',
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
    flex: 1,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  qrModalContainer: {
    alignItems: 'center',
  },
  qrLarge: {
    width: 240,
    height: 240,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderStyle: 'dashed',
    marginBottom: 16,
  },
  modalServiceType: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  modalAppointmentId: {
    fontSize: 12,
    fontFamily: 'monospace',
    marginBottom: 16,
  },
  modalDetails: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  modalDetailText: {
    fontSize: 14,
  },
  modalInstruction: {
    fontSize: 13,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 8,
  },
})
