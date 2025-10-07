import axios from 'axios'

// Configure your backend API URL
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
}

export interface WelcomeResponse {
  message: string
  user: WelcomeUserInfo
}

/**
 * Fetch welcome message and user info from backend
 */
export const fetchWelcomeData = async (userId: string): Promise<WelcomeResponse> => {
  try {
    console.log('🔍 API Configuration:', {
      baseURL: API_BASE_URL,
      endpoint: `/api/home/welcome/${userId}`,
      fullURL: `${API_BASE_URL}/api/home/welcome/${userId}`,
    })
    
    const response = await api.get<WelcomeResponse>(`/api/home/welcome/${userId}`)
    console.log('✅ Welcome API Response:', response.data)
    return response.data
  } catch (error: any) {
    console.error('❌ Error fetching welcome data:', {
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

export default api
