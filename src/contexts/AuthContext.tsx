import { Session } from '@supabase/supabase-js'
import * as SecureStore from 'expo-secure-store'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export interface UserProfile {
  id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  created_at: string
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    console.log('🔐 AuthContext: Initializing...')
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('🔐 AuthContext: Session fetched:', { 
        hasSession: !!session, 
        userId: session?.user?.id 
      })
      setSession(session)
      if (session?.user) {
        fetchUserProfile(session.user.id)
      } else {
        console.log('🔐 AuthContext: No session found')
        setLoading(false)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('🔐 AuthContext: Auth state changed:', { 
        event: _event, 
        hasSession: !!session 
      })
      setSession(session)
      if (session?.user) {
        fetchUserProfile(session.user.id)
      } else {
        setUser(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('🔐 AuthContext: Fetching profile for user:', userId)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('🔐 AuthContext: Error fetching profile:', error)
      } else {
        console.log('🔐 AuthContext: Profile fetched successfully:', {
          id: data.id,
          firstName: data.first_name,
          email: data.email
        })
        setUser(data)
      }
    } catch (error) {
      console.error('🔐 AuthContext: Exception fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setSession(null)
      setUser(null)
    } catch (error) {
      console.error('Error signing out:', error)
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

  const value: AuthContextType = {
    session,
    user,
    loading,
    signOut,
    checkPinExists,
    verifyPin,
    savePin,
    updateUserProfile,
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