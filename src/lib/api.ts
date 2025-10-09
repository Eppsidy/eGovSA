import axios from 'axios'

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
}

/**
 * Fetches welcome message and user info from backend
 */
export const fetchWelcomeData = async (userId: string): Promise<WelcomeResponse> => {
  try {
    console.log('API Configuration:', {
      baseURL: API_BASE_URL,
      endpoint: `/api/home/welcome/${userId}`,
      fullURL: `${API_BASE_URL}/api/home/welcome/${userId}`,
    })
    
    const response = await api.get<WelcomeResponse>(`/api/home/welcome/${userId}`)
    console.log('Welcome API Response:', response.data)
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
    const response = await api.get<WelcomeUserInfo>(`/api/profile/${userId}`)
    console.log('Profile API Response:', response.data)
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
    return response.data
  } catch (error: any) {
    console.error('Error updating profile:', error)
    console.error('Error response:', error.response?.data)
    throw error
  }
}

export default api
