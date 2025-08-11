import { supabase } from '../src/lib/supabase/client'

async function seedDatabase() {
  console.log('🌱 Testing database connection...')
  
  try {
    // Test 1: Check if users table exists and user is admin
    const { data: adminUser, error: adminError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'insumoscatamarca@gmail.com')
      .single()

    if (adminError) {
      console.error('❌ Error checking admin user:', adminError.message)
    } else {
      console.log('✅ Admin user found:')
      console.log(`   - Email: ${adminUser.email}`)
      console.log(`   - Role: ${adminUser.role}`)
      console.log(`   - ID: ${adminUser.id}`)
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
