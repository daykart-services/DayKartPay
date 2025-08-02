import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  isAdmin: boolean
  loading: boolean
  signUp: (email: string, password: string, referralCode?: string) => Promise<any>
  signIn: (email: string, password: string) => Promise<any>
  signOut: () => Promise<void>
  adminLogin: (email: string, password: string) => boolean
  adminLogout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Check for admin session
    const adminSession = localStorage.getItem('admin_session')
    if (adminSession === 'true') {
      setIsAdmin(true)
    }

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, referralCode?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: undefined,
      }
    })
    
    // Create profile after successful signup
    if (data.user && !error) {
      setUser(data.user)
      
      // Create user profile
      try {
        // Generate referral code for new user
        const userReferralCode = `DK${data.user.id.slice(0, 8).toUpperCase()}`
        
        let referrerId = null
        if (referralCode) {
          referrerId = await getReferrerIdByCode(referralCode)
        }
        
        await supabase
          .from('profiles')
          .insert([
            { 
              id: data.user.id, 
              email: data.user.email || email,
              is_admin: false,
              referral_code: userReferralCode,
              referred_by: referrerId
            }
          ])
      } catch (profileError) {
        console.error('Error creating profile:', profileError)
      }
    }
    
    return { data, error }
  }

  const getReferrerIdByCode = async (referralCode: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('referral_code', referralCode)
        .single()
      
      if (error || !data) return null
      return data.id
    } catch (error) {
      console.error('Error finding referrer:', error)
      return null
    }
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const adminLogin = (email: string, password: string) => {
    if (email === 'admin@daykart.com' && password === 'admin123') {
      setIsAdmin(true)
      localStorage.setItem('admin_session', 'true')
      return true
    }
    return false
  }

  const adminLogout = () => {
    setIsAdmin(false)
    localStorage.removeItem('admin_session')
  }

  const value = {
    user,
    isAdmin,
    loading,
    signUp,
    signIn,
    signOut,
    adminLogin,
    adminLogout
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}