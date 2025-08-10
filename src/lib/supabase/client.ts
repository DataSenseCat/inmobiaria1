import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Fallback values for development if environment variables are missing
const fallbackUrl = 'https://xtcdvnzcryshjwwggfrk.supabase.co'
const fallbackKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0Y2R2bnpjcnlzaGp3d2dnZnJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3OTE2NzAsImV4cCI6MjA3MDM2NzY3MH0.u-cwoiuT8xSg4fkFLuHw_GTmA9DI5xLPDhpHiGDS8MI'

const finalUrl = supabaseUrl || fallbackUrl
const finalKey = supabaseKey || fallbackKey

if (!finalUrl || !finalKey) {
  console.error('Missing Supabase environment variables, using fallback configuration')
}

export const supabase = createClient(finalUrl, finalKey)

export { createClient }
export default supabase
