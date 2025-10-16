import { Ionicons } from '@expo/vector-icons'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import Header from '../../src/components/Header'
import { useAuth } from '../../src/contexts/AuthContext'
import {
  createPaymentMethod,
  deletePaymentMethod,
  getUserPaymentMethods,
  setPaymentMethodAsDefault,
  updatePaymentMethod,
  type CreatePaymentMethodRequest,
  type PaymentMethod
} from '../../src/lib/api'

export default function PaymentMethodsScreen() {
  const { user } = useAuth()
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Form state
  const [formData, setFormData] = useState<CreatePaymentMethodRequest>({
    methodType: 'card',
    provider: '',
    lastFour: '',
    cardholderName: '',
    expiryDate: '',
    isDefault: false,
  })

  useEffect(() => {
    if (user?.id) {
      loadPaymentMethods()
    }
  }, [user])

  const loadPaymentMethods = async () => {
    if (!user?.id) return
    
    try {
      setLoading(true)
      const methods = await getUserPaymentMethods(user.id)
      setPaymentMethods(methods)
    } catch (error) {
      console.error('Error loading payment methods:', error)
      Alert.alert('Error', 'Failed to load payment methods')
    } finally {
      setLoading(false)
    }
  }

  const handleAddNew = () => {
    setEditingMethod(null)
    setFormData({
      methodType: 'card',
      provider: '',
      lastFour: '',
      cardholderName: '',
      expiryDate: '',
      isDefault: paymentMethods.length === 0, // Auto-set as default if first method
    })
    setModalVisible(true)
  }

  const handleEdit = (method: PaymentMethod) => {
    setEditingMethod(method)
    setFormData({
      methodType: method.methodType,
      provider: method.provider,
      lastFour: method.lastFour,
      cardholderName: method.cardholderName,
      expiryDate: method.expiryDate,
      isDefault: method.isDefault,
    })
    setModalVisible(true)
  }

  const handleSubmit = async () => {
    if (!user?.id) return

    // Validation
    if (!formData.provider || !formData.lastFour || !formData.cardholderName || !formData.expiryDate) {
      Alert.alert('Error', 'Please fill in all required fields')
      return
    }

    if (formData.lastFour.length !== 4 || !/^\d+$/.test(formData.lastFour)) {
      Alert.alert('Error', 'Last four digits must be exactly 4 numbers')
      return
    }

    if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      Alert.alert('Error', 'Expiry date must be in MM/YY format')
      return
    }

    try {
      setSubmitting(true)
      
      if (editingMethod) {
        // Update existing
        await updatePaymentMethod(editingMethod.id, formData)
        Alert.alert('Success', 'Payment method updated successfully')
      } else {
        // Create new
        await createPaymentMethod(user.id, formData)
        Alert.alert('Success', 'Payment method added successfully')
      }

      setModalVisible(false)
      await loadPaymentMethods()
    } catch (error) {
      console.error('Error saving payment method:', error)
      Alert.alert('Error', 'Failed to save payment method')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = (method: PaymentMethod) => {
    Alert.alert(
      'Delete Payment Method',
      `Are you sure you want to delete this ${method.methodType}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePaymentMethod(method.id)
              Alert.alert('Success', 'Payment method deleted')
              await loadPaymentMethods()
            } catch (error) {
              console.error('Error deleting payment method:', error)
              Alert.alert('Error', 'Failed to delete payment method')
            }
          },
        },
      ]
    )
  }

  const handleSetDefault = async (method: PaymentMethod) => {
    if (method.isDefault) return

    try {
      await setPaymentMethodAsDefault(method.id)
      Alert.alert('Success', 'Default payment method updated')
      await loadPaymentMethods()
    } catch (error) {
      console.error('Error setting default:', error)
      Alert.alert('Error', 'Failed to set as default')
    }
  }

  const formatExpiryDate = (text: string) => {
    // Remove non-digits
    const digits = text.replace(/\D/g, '')
    
    // Format as MM/YY
    if (digits.length <= 2) {
      return digits
    } else {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`
    }
  }

  return (
    <View style={styles.page}>
      <Header />
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Payment Methods</Text>
            <Text style={styles.subtitle}>Cards & bank accounts</Text>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={handleAddNew}>
            <Ionicons name="add-circle" size={28} color="#3b82f6" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3b82f6" />
          </View>
        ) : paymentMethods.length === 0 ? (
          <View style={styles.card}>
            <Text style={styles.empty}>No payment methods added yet.</Text>
            <Text style={styles.smallNote}>Add your card or bank account to pay for government services.</Text>
          </View>
        ) : (
          <View style={styles.methodsList}>
            {paymentMethods.map((method) => (
              <View key={method.id} style={styles.methodCard}>
                <View style={styles.methodHeader}>
                  <View style={styles.methodIcon}>
                    <Ionicons 
                      name={method.methodType === 'card' ? 'card' : 'wallet'} 
                      size={24} 
                      color="#3b82f6" 
                    />
                  </View>
                  <View style={styles.methodInfo}>
                    <Text style={styles.methodProvider}>{method.provider}</Text>
                    <Text style={styles.methodDetails}>
                      {method.methodType === 'card' ? '••••' : 'Account'} {method.lastFour}
                    </Text>
                    <Text style={styles.methodExpiry}>Expires {method.expiryDate}</Text>
                  </View>
                  {method.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultText}>Default</Text>
                    </View>
                  )}
                </View>

                <View style={styles.methodFooter}>
                  <Text style={styles.methodCardholder}>{method.cardholderName}</Text>
                  <View style={styles.methodActions}>
                    {!method.isDefault && (
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => handleSetDefault(method)}
                      >
                        <Text style={styles.actionButtonText}>Set Default</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => handleEdit(method)}
                    >
                      <Ionicons name="create-outline" size={18} color="#6b7280" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => handleDelete(method)}
                    >
                      <Ionicons name="trash-outline" size={18} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Add/Edit Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingMethod ? 'Edit Payment Method' : 'Add Payment Method'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Method Type */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Method Type</Text>
                <View style={styles.methodTypeButtons}>
                  <TouchableOpacity
                    style={[
                      styles.methodTypeButton,
                      formData.methodType === 'card' && styles.methodTypeButtonActive,
                    ]}
                    onPress={() => setFormData({ ...formData, methodType: 'card' })}
                  >
                    <Ionicons 
                      name="card" 
                      size={20} 
                      color={formData.methodType === 'card' ? '#3b82f6' : '#6b7280'} 
                    />
                    <Text style={[
                      styles.methodTypeText,
                      formData.methodType === 'card' && styles.methodTypeTextActive,
                    ]}>
                      Card
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.methodTypeButton,
                      formData.methodType === 'bank_account' && styles.methodTypeButtonActive,
                    ]}
                    onPress={() => setFormData({ ...formData, methodType: 'bank_account' })}
                  >
                    <Ionicons 
                      name="wallet" 
                      size={20} 
                      color={formData.methodType === 'bank_account' ? '#3b82f6' : '#6b7280'} 
                    />
                    <Text style={[
                      styles.methodTypeText,
                      formData.methodType === 'bank_account' && styles.methodTypeTextActive,
                    ]}>
                      Bank Account
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Provider */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>
                  {formData.methodType === 'card' ? 'Card Provider' : 'Bank Name'} *
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder={formData.methodType === 'card' ? 'Visa, Mastercard, etc.' : 'FNB, Standard Bank, etc.'}
                  value={formData.provider}
                  onChangeText={(text) => setFormData({ ...formData, provider: text })}
                />
              </View>

              {/* Cardholder Name */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>
                  {formData.methodType === 'card' ? 'Cardholder Name' : 'Account Holder Name'} *
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Full name as on card/account"
                  value={formData.cardholderName}
                  onChangeText={(text) => setFormData({ ...formData, cardholderName: text })}
                />
              </View>

              {/* Last Four Digits */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>
                  {formData.methodType === 'card' ? 'Last 4 Digits' : 'Last 4 of Account Number'} *
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="1234"
                  value={formData.lastFour}
                  onChangeText={(text) => {
                    const digits = text.replace(/\D/g, '').slice(0, 4)
                    setFormData({ ...formData, lastFour: digits })
                  }}
                  keyboardType="numeric"
                  maxLength={4}
                />
              </View>

              {/* Expiry Date */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Expiry Date (MM/YY) *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="12/25"
                  value={formData.expiryDate}
                  onChangeText={(text) => {
                    const formatted = formatExpiryDate(text)
                    setFormData({ ...formData, expiryDate: formatted })
                  }}
                  keyboardType="numeric"
                  maxLength={5}
                />
              </View>

              {/* Set as Default */}
              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => setFormData({ ...formData, isDefault: !formData.isDefault })}
              >
                <Ionicons
                  name={formData.isDefault ? 'checkbox' : 'square-outline'}
                  size={24}
                  color="#3b82f6"
                />
                <Text style={styles.checkboxLabel}>Set as default payment method</Text>
              </TouchableOpacity>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>
                    {editingMethod ? 'Update' : 'Add'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#f6f8fb' },
  content: { padding: 16 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: { fontSize: 18, fontWeight: '800', color: '#111827' },
  subtitle: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  addButton: {
    padding: 4,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  empty: { fontSize: 14, fontWeight: '700', color: '#1f2937', marginBottom: 6 },
  smallNote: { fontSize: 12, color: '#6b7280' },
  methodsList: {
    gap: 12,
  },
  methodCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  methodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  methodInfo: {
    flex: 1,
  },
  methodProvider: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  methodDetails: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  methodExpiry: {
    fontSize: 12,
    color: '#9ca3af',
  },
  defaultBadge: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  defaultText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#3b82f6',
  },
  methodFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 12,
  },
  methodCardholder: {
    fontSize: 12,
    color: '#6b7280',
    flex: 1,
  },
  methodActions: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  actionButton: {
    padding: 4,
  },
  actionButtonText: {
    fontSize: 12,
    color: '#3b82f6',
    fontWeight: '600',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  modalBody: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#fff',
  },
  methodTypeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  methodTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  methodTypeButtonActive: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff',
  },
  methodTypeText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '600',
  },
  methodTypeTextActive: {
    color: '#3b82f6',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#374151',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  cancelButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  submitButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
})
