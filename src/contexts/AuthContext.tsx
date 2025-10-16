import { Session } from '@supabase/supabase-js'
import * as SecureStore from 'expo-secure-store'
import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'

export interface UserProfile {
  id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  created_at: string
  full_name?: string
  avatar_url?: string
  date_of_birth?: string
  is_verified?: boolean
  residential_address?: string
  postal_address?: string
  id_number?: string
  profile_photo_url?: string
  gender?: string
  push_notifications_enabled?: boolean
  push_token?: string
}


interface AuthContextType {
  session: Session | null
  user: UserProfile | null
  loading: boolean
  signOut: () => Promise<void>
  checkPinExists: () => Promise<boolean>
  verifyPin: (pin: string) => Promise<boolean>
  savePin: (pin: string) => Promise<void>
  updateUserProfile: (profile: Partial<UserProfile>) => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const isInitialMount = useRef(true)
  const isExplicitSignOut = useRef(false)

  useEffect(() => {
    // Get initial session
    console.log('AuthContext: Initializing...')
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log('AuthContext: Session fetched:', { 
        hasSession: !!session, 
        userId: session?.user?.id 
      })
      setSession(session)
      if (session?.user) {
        await fetchUserProfile(session.user.id)
      } else {
        console.log('AuthContext: No session found, checking for stored email...')
        // Try to fetch user profile using stored email (for PIN-based auth)
        try {
          const storedEmail = await SecureStore.getItemAsync('userEmail')
          console.log('AuthContext: Stored email check result:', { storedEmail })
          if (storedEmail) {
            console.log('AuthContext: Found stored email, fetching profile...')
            await fetchUserProfileByEmail(storedEmail)
          } else {
            console.log('AuthContext: No stored email found')
            setLoading(false)
          }
        } catch (error) {
          console.error('AuthContext: Error checking stored email:', error)
          setLoading(false)
        }
      }
      isInitialMount.current = false
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('AuthContext: Auth state changed:', { 
        event: _event, 
        hasSession: !!session,
        isInitialMount: isInitialMount.current,
        isExplicitSignOut: isExplicitSignOut.current
      })
      
      // Skip the initial SIGNED_OUT event that fires on mount
      if (isInitialMount.current) {
        console.log('AuthContext: Skipping auth change - initial mount')
        return
      }
      
      setSession(session)
      if (session?.user) {
        fetchUserProfile(session.user.id)
      } else {
        // No session - only clear user if this was an explicit sign-out
        if (_event === 'SIGNED_OUT' && isExplicitSignOut.current) {
          console.log('AuthContext: User explicitly signed out, clearing state')
          isExplicitSignOut.current = false // Reset flag FIRST
          setUser(null)
          setLoading(false)
        } else {
          // Check for stored email (PIN-based auth)
          console.log('AuthContext: No session after auth change, checking stored email...')
          try {
            const storedEmail = await SecureStore.getItemAsync('userEmail')
            console.log('AuthContext: Stored email check:', { storedEmail })
            if (storedEmail) {
              console.log('AuthContext: Found stored email after auth change, fetching profile...')
              await fetchUserProfileByEmail(storedEmail)
            } else {
              console.log('AuthContext: No stored email after auth change')
              setUser(null)
              setLoading(false)
            }
          } catch (error) {
            console.error('AuthContext: Error checking stored email after auth change:', error)
            setUser(null)
            setLoading(false)
          }
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('AuthContext: Fetching profile for user:', userId)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('AuthContext: Error fetching profile:', error)
      } else {
        console.log('AuthContext: Profile fetched successfully:', {
          id: data.id,
          firstName: data.first_name,
          email: data.email,
          phone: data.phone,
          id_number: data.id_number,
          gender: data.gender,
          allFields: data
        })
        setUser(data)
      }
    } catch (error) {
      console.error('AuthContext: Exception fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserProfileByEmail = async (email: string) => {
    try {
      console.log('AuthContext: Fetching profile by email:', email)
      
      // Use RPC function which has SECURITY DEFINER to bypass RLS
      const { data, error } = await supabase
        .rpc('get_profile_by_email', { p_email: email })
        .maybeSingle()

      console.log('AuthContext: RPC query response:', { data, error, hasData: !!data })

      if (error) {
        console.error('AuthContext: Error fetching profile by email:', error)
      } else if (data) {
        console.log('AuthContext: Profile fetched successfully by email:', {
          id: (data as any).id,
          firstName: (data as any).first_name,
          email: (data as any).email,
          phone: (data as any).phone,
          id_number: (data as any).id_number,
          gender: (data as any).gender,
          date_of_birth: (data as any).date_of_birth,
          residential_address: (data as any).residential_address,
          allFields: data
        })
        setUser(data as UserProfile)
      } else {
        console.log('AuthContext: No profile found for email:', email)
        console.log('AuthContext: This may indicate the RPC function needs to be created/updated in Supabase')
      }
    } catch (error) {
      console.error('AuthContext: Exception fetching profile by email:', error)
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      isExplicitSignOut.current = true // Set flag before signing out
      await supabase.auth.signOut()
      // Clear stored email for PIN-based auth
      await SecureStore.deleteItemAsync('userEmail')
      // Clear all cached profile data
      if (user?.id) {
        await SecureStore.deleteItemAsync(`userProfile_${user.id}`)
        await SecureStore.deleteItemAsync(`welcome_${user.id}`)
      }
      setSession(null)
      setUser(null)
    } catch (error) {
      console.error('Error signing out:', error)
      isExplicitSignOut.current = false // Reset flag on error
    }
  }

  const checkPinExists = async (): Promise<boolean> => {
    try {
      const pin = await SecureStore.getItemAsync('userPin')
      return pin !== null
    } catch (error) {
      console.error('Error checking PIN:', error)
      return false
    }
  }

  const verifyPin = async (inputPin: string): Promise<boolean> => {
    try {
      const storedPin = await SecureStore.getItemAsync('userPin')
      return storedPin === inputPin
    } catch (error) {
      console.error('Error verifying PIN:', error)
      return false
    }
  }

  const savePin = async (pin: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync('userPin', pin)
    } catch (error) {
      console.error('Error saving PIN:', error)
      throw error
    }
  }

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    if (user) {
      setUser({ ...user, ...profile })
    }
  }

  const refreshUser = async () => {
    console.log('AuthContext: Manual refresh requested')
    try {
      const storedEmail = await SecureStore.getItemAsync('userEmail')
      if (storedEmail) {
        console.log('AuthContext: Refreshing user with stored email:', storedEmail)
        await fetchUserProfileByEmail(storedEmail)
      } else {
        console.log('AuthContext: No stored email for refresh')
      }
    } catch (error) {
      console.error('AuthContext: Error refreshing user:', error)
    }
  }

  const value: AuthContextType = {
    session,
    user,
    loading,
    signOut,
    checkPinExists,
    verifyPin,
    savePin,
    updateUserProfile,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}