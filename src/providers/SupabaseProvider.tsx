import { createContext, useContext, useEffect, useState } from 'react'
import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Fallback values for development if environment variables are missing
const fallbackUrl = 'https://xtcdvnzcryshjwwggfrk.supabase.co'
const fallbackKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0Y2R2bnpjcnlzaGp3d2dnZnJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3OTE2NzAsImV4cCI6MjA3MDM2NzY3MH0.u-cwoiuT8xSg4fkFLuHw_GTmA9DI5xLPDhpHiGDS8MI'

const finalUrl = supabaseUrl || fallbackUrl
const finalKey = supabaseKey || fallbackKey

interface SupabaseContextType {
  supabase: SupabaseClient
  user: User | null
  session: Session | null
  loading: boolean
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined)

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => createClient(finalUrl, finalKey))
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase])

  const value = {
    supabase,
    user,
    session,
    loading,
  }

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  )
}

export function useSupabase() {
  const context = useContext(SupabaseContext)
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider')
  }
  return context
}
