import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getErrorMessage, logError, handleSupabaseError } from '@/lib/utils/errorUtils'

export default function DebugConnectionPage() {
  const [results, setResults] = useState<any[]>([])

  const addResult = (test: string, result: any) => {
    setResults(prev => [...prev, { test, result, timestamp: new Date().toLocaleTimeString() }])
  }

  const testBasicConnection = async () => {
    try {
      console.log('Testing basic Supabase connection...')
      const { data, error } = await supabase.from('properties').select('count').limit(1)
      
      if (error) {
        console.error('Basic connection test failed:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        })
        addResult('Basic Connection', { 
          success: false, 
          error: getErrorMessage(error),
          details: error 
        })
      } else {
        addResult('Basic Connection', { success: true, data })
      }
    } catch (err) {
      logError(err, 'testBasicConnection')
      addResult('Basic Connection', { 
        success: false, 
        error: getErrorMessage(err) 
      })
    }
  }

  const testPropertiesQuery = async () => {
    try {
      console.log('Testing properties query...')
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          images (
            id,
            url,
            alt,
            order_index
          ),
          agents (
            name,
            phone,
            email
          )
        `)
        .eq('active', true)
        .limit(3)

      if (error) {
        const errorMessage = handleSupabaseError(error, 'Properties query failed')
        addResult('Properties Query', { 
          success: false, 
          error: errorMessage,
          details: error 
        })
      } else {
        addResult('Properties Query', { 
          success: true, 
          count: data?.length || 0,
          data: data?.slice(0, 2) // Show first 2 properties
        })
      }
    } catch (err) {
      logError(err, 'testPropertiesQuery')
      addResult('Properties Query', { 
        success: false, 
        error: getErrorMessage(err) 
      })
    }
  }

  const testSimpleSelect = async () => {
    try {
      console.log('Testing simple select...')
      const { data, error } = await supabase
        .from('properties')
        .select('id, title, active')
        .limit(3)

      if (error) {
        const errorMessage = handleSupabaseError(error, 'Simple select failed')
        addResult('Simple Select', { 
          success: false, 
          error: errorMessage,
          details: error 
        })
      } else {
        addResult('Simple Select', { 
          success: true, 
          count: data?.length || 0,
          data 
        })
      }
    } catch (err) {
      logError(err, 'testSimpleSelect')
      addResult('Simple Select', { 
        success: false, 
        error: getErrorMessage(err) 
      })
    }
  }

  const runAllTests = async () => {
    setResults([])
    await testBasicConnection()
    await testSimpleSelect()
    await testPropertiesQuery()
  }

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Debug Supabase Connection</CardTitle>
          <p className="text-gray-600">Test various database operations to identify issues</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button onClick={runAllTests}>Run All Tests</Button>
            <Button variant="outline" onClick={testBasicConnection}>Basic Connection</Button>
            <Button variant="outline" onClick={testSimpleSelect}>Simple Select</Button>
            <Button variant="outline" onClick={testPropertiesQuery}>Properties Query</Button>
          </div>

          {results.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Test Results:</h3>
              {results.map((result, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{result.test}</h4>
                    <span className="text-sm text-gray-500">{result.timestamp}</span>
                  </div>
                  <pre className="text-sm overflow-auto bg-white p-3 rounded border">
                    {JSON.stringify(result.result, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6">
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/'}
            >
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
