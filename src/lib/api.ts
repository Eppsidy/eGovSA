import axios from 'axios'
import * as SecureStore from 'expo-secure-store'

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface WelcomeUserInfo {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  fullName: string
  avatarUrl?: string
  dateOfBirth?: string
  isVerified?: boolean
  residentialAddress?: string
  postalAddress?: string
  idNumber?: string
  profilePhotoUrl?: string
  gender?: string
  pushNotificationsEnabled?: boolean
  pushToken?: string
}

export interface WelcomeResponse {
  message: string
  user: WelcomeUserInfo
}

export interface UpdateProfileRequest {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  fullName?: string
  dateOfBirth?: string
  gender?: string
  idNumber?: string
  residentialAddress?: string
  postalAddress?: string
  avatarUrl?: string
  profilePhotoUrl?: string
  pushNotificationsEnabled?: boolean
  pushToken?: string
}

/**
 * Fetches welcome message and user info from backend
 */
export const fetchWelcomeData = async (userId: string): Promise<WelcomeResponse> => {
  try {
    const cachedWelcome = await SecureStore.getItemAsync(`welcome_${userId}`)
    if (cachedWelcome) {
      console.log('Welcome data fetched from SecureStore cache')
      const parsed = JSON.parse(cachedWelcome)
      // Return cached data but fetch fresh data in background
      setTimeout(() => {
        api.get<WelcomeResponse>(`/api/home/welcome/${userId}`)
          .then(response => {
            SecureStore.setItemAsync(`welcome_${userId}`, JSON.stringify(response.data))
          })
          .catch(() => {})
      }, 0)
      return parsed
    }

    console.log('API Configuration:', {
      baseURL: API_BASE_URL,
      endpoint: `/api/home/welcome/${userId}`,
      fullURL: `${API_BASE_URL}/api/home/welcome/${userId}`,
    })
    
    const response = await api.get<WelcomeResponse>(`/api/home/welcome/${userId}`)
    console.log('Welcome API Response:', response.data)
    
    // Cache the response
    await SecureStore.setItemAsync(`welcome_${userId}`, JSON.stringify(response.data))
    
    return response.data
  } catch (error: any) {
    console.error('Error fetching welcome data:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        baseURL: error.config?.baseURL,
      }
    })
    throw error
  }
}

/**
 * Fetches full profile data from backend
 */
export const fetchProfile = async (userId: string): Promise<WelcomeUserInfo> => {
  try {
    // Try to get cached profile first
    const cachedProfile = await SecureStore.getItemAsync(`userProfile_${userId}`)
    if (cachedProfile) {
      console.log('Profile fetched from SecureStore cache')
      const parsed = JSON.parse(cachedProfile)
      // Return cached data but fetch fresh data in background
      setTimeout(() => {
        api.get<WelcomeUserInfo>(`/api/profile/${userId}`)
          .then(response => {
            SecureStore.setItemAsync(`userProfile_${userId}`, JSON.stringify(response.data))
          })
          .catch(() => {})
      }, 0)
      return parsed
    }

    // If not in cache, fetch from API
    const response = await api.get<WelcomeUserInfo>(`/api/profile/${userId}`)
    console.log('Profile API Response:', response.data)
    
    // Cache the response
    await SecureStore.setItemAsync(`userProfile_${userId}`, JSON.stringify(response.data))
    
    return response.data
  } catch (error: any) {
    console.error('Error fetching profile:', error)
    throw error
  }
}

/**
 * Updates profile information
 */
export const updateProfile = async (userId: string, data: UpdateProfileRequest): Promise<WelcomeUserInfo> => {
  try {
    console.log('API updateProfile called with:', {
      userId,
      data,
      idNumber: data.idNumber,
      phone: data.phone
    })
    const response = await api.put<WelcomeUserInfo>(`/api/profile/${userId}`, data)
    console.log('Update Profile API Response:', response.data)
    console.log('Response idNumber:', response.data.idNumber)
    
    // Update SecureStore cache
    await SecureStore.setItemAsync(`userProfile_${userId}`, JSON.stringify(response.data))
    
    return response.data
  } catch (error: any) {
    console.error('Error updating profile:', error)
    console.error('Error response:', error.response?.data)
    throw error
  }
}

// ============================================
// Applications API
// ============================================

export interface ApplicationDocument {
  id: string
  applicationId: string
  documentType: string
  fileName: string
  fileUrl: string
  fileSize: number
  uploadedAt: string
}

export interface Application {
  id: string
  userId: string
  serviceType: string
  referenceNumber: string
  status: 'In Progress' | 'Under Review' | 'Pending Payment' | 'Completed' | 'Rejected'
  currentStep: string
  applicationData: string // JSON string
  submittedAt: string
  expectedCompletionDate: string
  completedAt?: string
  createdAt: string
  updatedAt: string
  documents: ApplicationDocument[]
}

export interface CreateApplicationRequest {
  serviceType: string
  applicationData: string // JSON string with form data
}

/**
 * Create a new application
 */
export const createApplication = async (userId: string, request: CreateApplicationRequest): Promise<Application> => {
  try {
    const response = await api.post<Application>(`/api/applications?userId=${userId}`, request)
    console.log('Create Application Response:', response.data)
    return response.data
  } catch (error: any) {
    console.error('Error creating application:', error)
    throw error
  }
}

/**
 * Get all applications for a user
 */
export const getUserApplications = async (userId: string): Promise<Application[]> => {
  try {
    const response = await api.get<Application[]>(`/api/applications/user/${userId}`)
    console.log('User Applications Response:', response.data)
    return response.data
  } catch (error: any) {
    console.error('Error fetching applications:', error)
    throw error
  }
}

/**
 * Get applications by status
 */
export const getUserApplicationsByStatus = async (userId: string, status: string): Promise<Application[]> => {
  try {
    const response = await api.get<Application[]>(`/api/applications/user/${userId}/status/${status}`)
    return response.data
  } catch (error: any) {
    console.error('Error fetching applications by status:', error)
    throw error
  }
}

/**
 * Get applications by multiple statuses (for Active tab)
 */
export const getUserApplicationsByStatuses = async (userId: string, statuses: string[]): Promise<Application[]> => {
  try {
    const response = await api.post<Application[]>(`/api/applications/user/${userId}/statuses`, statuses)
    return response.data
  } catch (error: any) {
    console.error('Error fetching applications by statuses:', error)
    throw error
  }
}

/**
 * Get single application by ID
 */
export const getApplicationById = async (id: string): Promise<Application> => {
  try {
    const response = await api.get<Application>(`/api/applications/${id}`)
    return response.data
  } catch (error: any) {
    console.error('Error fetching application:', error)
    throw error
  }
}

/**
 * Update application status
 */
export const updateApplicationStatus = async (
  id: string, 
  status: string, 
  currentStep?: string
): Promise<Application> => {
  try {
    const response = await api.patch<Application>(`/api/applications/${id}/status`, {
      status,
      currentStep,
    })
    return response.data
  } catch (error: any) {
    console.error('Error updating application status:', error)
    throw error
  }
}

/**
 * Add document to application
 */
export const addApplicationDocument = async (
  applicationId: string, 
  document: Omit<ApplicationDocument, 'id' | 'uploadedAt'>
): Promise<ApplicationDocument> => {
  try {
    const response = await api.post<ApplicationDocument>(
      `/api/applications/${applicationId}/documents`, 
      document
    )
    return response.data
  } catch (error: any) {
    console.error('Error adding document:', error)
    throw error
  }
}

// ============================================
// Services API
// ============================================

export interface ServiceInfo {
  id: string
  serviceName: string
  description: string
  category: string
  requiredDocuments: string // JSON array
  processingTimeDays: number
  fees: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

/**
 * Get all active services
 */
export const getAllServices = async (): Promise<ServiceInfo[]> => {
  try {
    const response = await api.get<ServiceInfo[]>('/api/services')
    return response.data
  } catch (error: any) {
    console.error('Error fetching services:', error)
    throw error
  }
}

/**
 * Get services by category
 */
export const getServicesByCategory = async (category: string): Promise<ServiceInfo[]> => {
  try {
    const response = await api.get<ServiceInfo[]>(`/api/services/category/${category}`)
    return response.data
  } catch (error: any) {
    console.error('Error fetching services by category:', error)
    throw error
  }
}

// ============================================
// Appointments API
// ============================================

export interface Appointment {
  id: string
  userId: string
  applicationId?: string
  appointmentDate: string // ISO date string
  appointmentTime?: string
  serviceType: string
  location?: string
  locationAddress?: string
  status: string // Scheduled, Completed, Cancelled, Rescheduled
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface CreateAppointmentRequest {
  userId: string
  applicationId?: string
  appointmentDate: string
  appointmentTime?: string
  serviceType: string
  location?: string
  locationAddress?: string
  status?: string
  notes?: string
}

/**
 * Create a new appointment
 */
export const createAppointment = async (appointmentData: CreateAppointmentRequest): Promise<Appointment> => {
  try {
    const response = await api.post<Appointment>('/api/appointments', appointmentData)
    return response.data
  } catch (error: any) {
    console.error('Error creating appointment:', error)
    throw error
  }
}

/**
 * Get all appointments for a user
 */
export const getUserAppointments = async (userId: string): Promise<Appointment[]> => {
  try {
    const response = await api.get<Appointment[]>(`/api/appointments/user/${userId}`)
    return response.data
  } catch (error: any) {
    console.error('Error fetching appointments:', error)
    throw error
  }
}

/**
 * Get appointments by status
 */
export const getUserAppointmentsByStatus = async (userId: string, status: string): Promise<Appointment[]> => {
  try {
    const response = await api.get<Appointment[]>(`/api/appointments/user/${userId}/status/${status}`)
    return response.data
  } catch (error: any) {
    console.error('Error fetching appointments by status:', error)
    throw error
  }
}

/**
 * Update appointment status
 */
export const updateAppointmentStatus = async (appointmentId: string, status: string): Promise<Appointment> => {
  try {
    const response = await api.patch<Appointment>(`/api/appointments/${appointmentId}/status`, { status })
    return response.data
  } catch (error: any) {
    console.error('Error updating appointment status:', error)
    throw error
  }
}

// ============================================
// Notification API Functions
// ============================================

export interface Notification {
  id: string
  userId: string
  title: string
  description: string
  notificationType: string
  relatedId?: string
  isRead: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateNotificationRequest {
  userId: string
  title: string
  description: string
  notificationType: string
  relatedId?: string
}

/**
 * Create a new notification
 */
export const createNotification = async (notificationData: CreateNotificationRequest): Promise<Notification> => {
  try {
    const response = await api.post<Notification>('/api/notifications', notificationData)
    return response.data
  } catch (error: any) {
    console.error('Error creating notification:', error)
    throw error
  }
}

/**
 * Get all notifications for a user
 */
export const getUserNotifications = async (userId: string): Promise<Notification[]> => {
  try {
    const response = await api.get<Notification[]>(`/api/notifications/user/${userId}`)
    return response.data
  } catch (error: any) {
    console.error('Error fetching notifications:', error)
    throw error
  }
}

/**
 * Get active notifications for a user
 */
export const getActiveUserNotifications = async (userId: string): Promise<Notification[]> => {
  try {
    const response = await api.get<Notification[]>(`/api/notifications/user/${userId}/active`)
    return response.data
  } catch (error: any) {
    console.error('Error fetching active notifications:', error)
    throw error
  }
}

/**
 * Get unread notifications for a user
 */
export const getUnreadUserNotifications = async (userId: string): Promise<Notification[]> => {
  try {
    const response = await api.get<Notification[]>(`/api/notifications/user/${userId}/unread`)
    return response.data
  } catch (error: any) {
    console.error('Error fetching unread notifications:', error)
    throw error
  }
}

/**
 * Get unread notification count for a user
 */
export const getUnreadNotificationCount = async (userId: string): Promise<number> => {
  try {
    const response = await api.get<{ unreadCount: number }>(`/api/notifications/user/${userId}/unread-count`)
    return response.data.unreadCount
  } catch (error: any) {
    console.error('Error fetching unread count:', error)
    throw error
  }
}

/**
 * Mark notification as read
 */
export const markNotificationAsRead = async (notificationId: string): Promise<Notification> => {
  try {
    const response = await api.patch<Notification>(`/api/notifications/${notificationId}/read`)
    return response.data
  } catch (error: any) {
    console.error('Error marking notification as read:', error)
    throw error
  }
}

/**
 * Mark all notifications as read for a user
 */
export const markAllNotificationsAsRead = async (userId: string): Promise<void> => {
  try {
    await api.patch(`/api/notifications/user/${userId}/read-all`)
  } catch (error: any) {
    console.error('Error marking all notifications as read:', error)
    throw error
  }
}

/**
 * Delete a notification
 */
export const deleteNotification = async (notificationId: string): Promise<void> => {
  try {
    await api.delete(`/api/notifications/${notificationId}`)
  } catch (error: any) {
    console.error('Error deleting notification:', error)
    throw error
  }
}

/**
 * Clear all cached data for a user
 */
export const clearUserCache = async (userId: string): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(`userProfile_${userId}`)
    await SecureStore.deleteItemAsync(`welcome_${userId}`)
    console.log('User cache cleared successfully')
  } catch (error: any) {
    console.error('Error clearing user cache:', error)
  }
}

// ============================================
// Payment Methods API
// ============================================

export interface PaymentMethod {
  id: string
  userId: string
  methodType: string // 'card' or 'bank_account'
  provider: string // e.g., 'Visa', 'Mastercard', 'FNB'
  lastFour: string
  cardholderName: string
  expiryDate: string // Format: MM/YY
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export interface CreatePaymentMethodRequest {
  methodType: string
  provider: string
  lastFour: string
  cardholderName: string
  expiryDate: string
  isDefault?: boolean
}

/**
 * Create a new payment method
 */
export const createPaymentMethod = async (
  userId: string, 
  paymentMethodData: CreatePaymentMethodRequest
): Promise<PaymentMethod> => {
  try {
    const response = await api.post<PaymentMethod>(
      `/api/payment-methods/user/${userId}`, 
      paymentMethodData
    )
    console.log('Create Payment Method Response:', response.data)
    return response.data
  } catch (error: any) {
    console.error('Error creating payment method:', error)
    throw error
  }
}

/**
 * Get all payment methods for a user
 */
export const getUserPaymentMethods = async (userId: string): Promise<PaymentMethod[]> => {
  try {
    const response = await api.get<PaymentMethod[]>(`/api/payment-methods/user/${userId}`)
    console.log('User Payment Methods Response:', response.data)
    return response.data
  } catch (error: any) {
    console.error('Error fetching payment methods:', error)
    throw error
  }
}

/**
 * Get a specific payment method by ID
 */
export const getPaymentMethodById = async (id: string): Promise<PaymentMethod> => {
  try {
    const response = await api.get<PaymentMethod>(`/api/payment-methods/${id}`)
    return response.data
  } catch (error: any) {
    console.error('Error fetching payment method:', error)
    throw error
  }
}

/**
 * Update a payment method
 */
export const updatePaymentMethod = async (
  id: string, 
  paymentMethodData: CreatePaymentMethodRequest
): Promise<PaymentMethod> => {
  try {
    const response = await api.put<PaymentMethod>(
      `/api/payment-methods/${id}`, 
      paymentMethodData
    )
    console.log('Update Payment Method Response:', response.data)
    return response.data
  } catch (error: any) {
    console.error('Error updating payment method:', error)
    throw error
  }
}

/**
 * Delete a payment method
 */
export const deletePaymentMethod = async (id: string): Promise<void> => {
  try {
    await api.delete(`/api/payment-methods/${id}`)
    console.log('Payment method deleted successfully')
  } catch (error: any) {
    console.error('Error deleting payment method:', error)
    throw error
  }
}

/**
 * Set a payment method as default
 */
export const setPaymentMethodAsDefault = async (id: string): Promise<PaymentMethod> => {
  try {
    const response = await api.patch<PaymentMethod>(`/api/payment-methods/${id}/set-default`)
    console.log('Set Default Payment Method Response:', response.data)
    return response.data
  } catch (error: any) {
    console.error('Error setting default payment method:', error)
    throw error
  }
}

// ============================================
// Notification Settings API
// ============================================

/**
 * Update notification settings (push notifications enabled/disabled)
 */
export const updateNotificationSettings = async (
  userId: string,
  enabled: boolean,
  pushToken?: string
): Promise<WelcomeUserInfo> => {
  try {
    const data: UpdateProfileRequest = {
      pushNotificationsEnabled: enabled,
    }
    if (pushToken) {
      data.pushToken = pushToken
    }
    const response = await updateProfile(userId, data)
    console.log('Notification settings updated:', { enabled, hasPushToken: !!pushToken })
    return response
  } catch (error: any) {
    console.error('Error updating notification settings:', error)
    throw error
  }
}

/**
 * Register push notification token
 */
export const registerPushToken = async (userId: string, pushToken: string): Promise<WelcomeUserInfo> => {
  try {
    const response = await updateProfile(userId, { pushToken })
    console.log('Push token registered:', pushToken)
    return response
  } catch (error: any) {
    console.error('Error registering push token:', error)
    throw error
  }
}

export default api
