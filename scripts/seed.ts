import { createClient } from '@supabase/supabase-js'

// Direct configuration for Node.js environment
const supabaseUrl = 'https://xtcdvnzcryshjwwggfrk.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0Y2R2bnpjcnlzaGp3d2dnZnJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3OTE2NzAsImV4cCI6MjA3MDM2NzY3MH0.u-cwoiuT8xSg4fkFLuHw_GTmA9DI5xLPDhpHiGDS8MI'

const supabase = createClient(supabaseUrl, supabaseKey)

async function seedDatabase() {
  console.log('🌱 Testing database connection...')
  
  try {
    // Test 1: Check if users table exists and user is admin (without single())
    const { data: adminUsers, error: adminError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'insumoscatamarca@gmail.com')

    if (adminError) {
      console.error('❌ Error checking admin user:', adminError.message)
    } else {
      console.log(`✅ Found ${adminUsers?.length || 0} users with email insumoscatamarca@gmail.com`)
      if (adminUsers && adminUsers.length > 0) {
        const adminUser = adminUsers[0]
        console.log(`   - Email: ${adminUser.email}`)
        console.log(`   - Role: ${adminUser.role}`)
        console.log(`   - ID: ${adminUser.id}`)
      }
    }

    // Test 2: Check if basic tables exist
    const { data: properties, error: propsError } = await supabase
      .from('properties')
      .select('count')
      .limit(1)

    if (propsError) {
      console.error('❌ Properties table error:', propsError.message)
    } else {
      console.log('✅ Properties table accessible')
    }

    const { data: agents, error: agentsError } = await supabase
      .from('agents')
      .select('count')
      .limit(1)

    if (agentsError) {
      console.error('❌ Agents table error:', agentsError.message)
    } else {
      console.log('✅ Agents table accessible')
    }

    console.log('\n🎉 Database connection test completed!')
    
  } catch (error) {
    console.error('❌ Unexpected error:', error)
    process.exit(1)
  }
}

seedDatabase()
