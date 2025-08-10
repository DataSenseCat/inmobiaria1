import { supabase, testConnection } from '../src/lib/supabase/client'

async function testDatabaseConnection() {
  console.log('🔍 Testing database connection...')
  
  // First test the basic connection
  const connectionResult = await testConnection()
  console.log('Connection test result:', connectionResult)
  
  if (!connectionResult.success) {
    console.error('❌ Connection failed:', connectionResult.error)
    
    // Try to diagnose the issue
    console.log('\n🔍 Attempting to diagnose the issue...')
    
    try {
      // Test basic supabase service
      const { data, error } = await supabase.auth.getSession()
      console.log('Auth service test:', { hasData: !!data, error })
      
      // Test if we can reach the database at all
      const { data: pingData, error: pingError } = await supabase.rpc('ping').limit(1)
      console.log('RPC ping test:', { pingData, pingError })
      
    } catch (err) {
      console.error('Detailed error:', err)
    }
    
    return
  }
  
  console.log('✅ Connection successful!')
  
  // Test if tables exist
  console.log('\n🔍 Testing table access...')
  
  try {
    const { data: properties, error: propsError } = await supabase
      .from('properties')
      .select('id, title')
      .limit(1)
    
    console.log('Properties table test:', { 
      hasData: !!properties, 
      count: properties?.length || 0, 
      error: propsError 
    })
    
    const { data: leads, error: leadsError } = await supabase
      .from('leads')
      .select('id, name')
      .limit(1)
    
    console.log('Leads table test:', { 
      hasData: !!leads, 
      count: leads?.length || 0, 
      error: leadsError 
    })
    
  } catch (err) {
    console.error('Table access error:', err)
  }
}

testDatabaseConnection()
