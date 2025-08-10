import { createClient } from '@supabase/supabase-js'
import { Database } from './types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Fallback values for development if environment variables are missing
const fallbackUrl = 'https://xtcdvnzcryshjwwggfrk.supabase.co'
const fallbackKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0Y2R2bnpjcnlzaGp3d2dnZnJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3OTE2NzAsImV4cCI6MjA3MDM2NzY3MH0.u-cwoiuT8xSg4fkFLuHw_GTmA9DI5xLPDhpHiGDS8MI'

const finalUrl = supabaseUrl || fallbackUrl
const finalKey = supabaseKey || fallbackKey

console.log('Supabase Configuration:', {
  hasUrl: !!finalUrl,
  hasKey: !!finalKey,
  url: finalUrl?.substring(0, 30) + '...',
  usingFallback: !supabaseUrl || !supabaseKey
})

if (!finalUrl || !finalKey) {
  console.error('Missing Supabase environment variables, using fallback configuration')
}

export const supabase = createClient<Database>(finalUrl, finalKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

// Test connection function
export const testConnection = async () => {
  try {
    console.log('Testing Supabase connection...')
    const { data, error } = await supabase.from('properties').select('count').limit(1)

    if (error) {
      console.error('Supabase connection test failed:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      })

      // Check if it's a table not found error
      if (error.code === 'PGRST116' || error.message.includes('relation') || error.message.includes('does not exist')) {
        return { success: false, error: 'Tablas de la base de datos no existen. Usando datos de ejemplo.' }
      }

      return { success: false, error: error.message }
    }

    console.log('Supabase connection test successful')
    return { success: true, data }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err)
    console.error('Supabase connection test error:', {
      message: errorMessage,
      error: err,
      stack: err instanceof Error ? err.stack : undefined
    })
    return { success: false, error: err instanceof Error ? err.message : String(err) }
  }
}

// Initialize connection test
testConnection()

export { createClient }
export default supabase
