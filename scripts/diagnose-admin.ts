import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xtcdvnzcryshjwwggfrk.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0Y2R2bnpjcnlzaGp3d2dnZnJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3OTE2NzAsImV4cCI6MjA3MDM2NzY3MH0.u-cwoiuT8xSg4fkFLuHw_GTmA9DI5xLPDhpHiGDS8MI'

const supabase = createClient(supabaseUrl, supabaseKey)

async function diagnoseAdmin() {
  console.log('🔍 Diagnosing admin permissions...\n')
  
  try {
    // 1. Check if tables exist
    console.log('📋 Checking table structure...')
    
    const tables = ['users', 'properties', 'agents', 'developments']
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('count')
          .limit(1)
        
        if (error) {
          console.log(`❌ Table '${table}': ${error.message}`)
        } else {
          console.log(`✅ Table '${table}': accessible`)
        }
      } catch (err) {
        console.log(`❌ Table '${table}': ${err}`)
      }
    }
    
    // 2. Check users table structure and data
    console.log('\n👥 Checking users...')
    try {
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('*')
        .limit(10)
      
      if (usersError) {
        console.log(`❌ Users query error: ${usersError.message}`)
      } else {
        console.log(`✅ Found ${users?.length || 0} users total`)
        
        if (users && users.length > 0) {
          console.log('\n📋 User details:')
          users.forEach((user, index) => {
            console.log(`   ${index + 1}. Email: ${user.email}`)
            console.log(`      Role: ${user.role}`)
            console.log(`      ID: ${user.id}`)
            console.log(`      Created: ${user.created_at}`)
            console.log('')
          })
          
          const adminUsers = users.filter(u => u.role === 'admin')
          console.log(`🔑 Admin users: ${adminUsers.length}`)
        } else {
          console.log('⚠️  No users found in database')
        }
      }
    } catch (err) {
      console.log(`❌ Users check failed: ${err}`)
    }
    
    // 3. Test property operations (without authentication)
    console.log('\n🏠 Testing property operations...')
    try {
      // Test read
      const { data: properties, error: readError } = await supabase
        .from('properties')
        .select('*')
        .limit(1)
      
      if (readError) {
        console.log(`❌ Properties read error: ${readError.message}`)
      } else {
        console.log(`✅ Properties read: ${properties?.length || 0} properties found`)
      }
      
      // Test write (this should fail for anonymous users)
      const { data: insertData, error: insertError } = await supabase
        .from('properties')
        .insert({
          title: 'Test Property',
          city: 'Test City',
          type: 'casa',
          operation: 'venta',
          featured: false,
          active: true
        })
        .select()
      
      if (insertError) {
        console.log(`❌ Properties insert error (expected): ${insertError.message}`)
        if (insertError.message.includes('RLS') || insertError.message.includes('policy')) {
          console.log(`   ℹ️  This is expected - RLS policies are working`)
        }
      } else {
        console.log(`⚠️  Properties insert succeeded unexpectedly: ${insertData}`)
      }
      
    } catch (err) {
      console.log(`❌ Property operations test failed: ${err}`)
    }
    
    // 4. Check RLS policies
    console.log('\n🔒 Checking RLS policies...')
    try {
      const { data: policies, error: policiesError } = await supabase.rpc('get_table_policies', {
        table_name: 'properties'
      })
      
      if (policiesError) {
        console.log(`❌ RLS policies check failed: ${policiesError.message}`)
      } else {
        console.log(`✅ RLS policies: ${policies?.length || 0} policies found`)
      }
    } catch (err) {
      console.log(`ℹ️  RLS policies check not available: ${err}`)
    }
    
    console.log('\n🎯 Summary and Recommendations:')
    console.log('1. If no admin users exist, create one at /setup-admin')
    console.log('2. If properties insert failed with RLS error, that\'s normal')
    console.log('3. Admin users need to be authenticated to perform CRUD operations')
    console.log('4. Check browser console for detailed error messages')
    
  } catch (err) {
    console.error('❌ Diagnosis failed:', err)
  }
}

diagnoseAdmin()
