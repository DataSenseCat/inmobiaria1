import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { getErrorMessage } from '@/lib/utils/errorUtils'

export default function SimpleConnectionTest() {
  const [status, setStatus] = useState('Testing...')
  const [details, setDetails] = useState<any>(null)

  useEffect(() => {
    testConnection()
  }, [])

  const testConnection = async () => {
    try {
      console.log('🔍 Starting connection test...')
      setStatus('Testing connection...')

      // Test 1: Simple count query
      const { data: countData, error: countError } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })

      if (countError) {
        console.error('Count query failed:', {
          message: countError.message,
          code: countError.code,
          details: countError.details
        })
        setStatus(`❌ Count query failed: ${getErrorMessage(countError)}`)
        setDetails(countError)
        return
      }

      console.log('✅ Count query successful')

      // Test 2: Actual data query
      const { data: properties, error: propertiesError } = await supabase
        .from('properties')
        .select('id, title, active')
        .eq('active', true)
        .limit(3)

      if (propertiesError) {
        console.error('Properties query failed:', {
          message: propertiesError.message,
          code: propertiesError.code,
          details: propertiesError.details
        })
        setStatus(`❌ Properties query failed: ${getErrorMessage(propertiesError)}`)
        setDetails(propertiesError)
        return
      }

      console.log('✅ Properties query successful, found:', properties?.length)

      // Test 3: Join query with images
      const { data: joinData, error: joinError } = await supabase
        .from('properties')
        .select(`
          id,
          title,
          images (
            id,
            url
          )
        `)
        .eq('active', true)
        .limit(2)

      if (joinError) {
        console.error('Join query failed:', {
          message: joinError.message,
          code: joinError.code,
          details: joinError.details
        })
        setStatus(`❌ Join query failed: ${getErrorMessage(joinError)}`)
        setDetails(joinError)
        return
      }

      console.log('✅ Join query successful')
      setStatus('✅ All tests passed! Database connection working correctly.')
      setDetails({
        countData,
        propertiesCount: properties?.length || 0,
        joinDataCount: joinData?.length || 0,
        sampleData: properties?.slice(0, 2)
      })

    } catch (error) {
      const errorMessage = getErrorMessage(error)
      console.error('❌ Connection test failed:', error)
      setStatus(`❌ Connection test failed: ${errorMessage}`)
      setDetails(error)
    }
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h3 className="font-semibold text-blue-900 mb-2">Database Connection Status</h3>
      <p className="text-blue-800 mb-2">{status}</p>
      
      {details && (
        <details className="mt-3">
          <summary className="cursor-pointer text-blue-700 hover:text-blue-900">
            Show Details
          </summary>
          <pre className="mt-2 text-xs bg-white p-2 rounded border overflow-auto max-h-40">
            {JSON.stringify(details, null, 2)}
          </pre>
        </details>
      )}
      
      <button
        onClick={testConnection}
        className="mt-3 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
      >
        Test Again
      </button>
    </div>
  )
}
