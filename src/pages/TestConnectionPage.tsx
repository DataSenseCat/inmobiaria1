import { useState, useEffect } from 'react'
import { supabase, testConnection } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestConnectionPage() {
  const [connectionStatus, setConnectionStatus] = useState<string>('Testing...')
  const [details, setDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const runConnectionTest = async () => {
    setLoading(true)
    setConnectionStatus('Testing connection...')
    
    try {
      // Test basic connection
      const result = await testConnection()
      
      if (result.success) {
        setConnectionStatus('✅ Connection successful!')
        
        // Test table access
        const { data: properties, error: propsError } = await supabase
          .from('properties')
          .select('id, title')
          .limit(1)
        
        const { data: leads, error: leadsError } = await supabase
          .from('leads')
          .select('id')
          .limit(1)
        
        setDetails({
          connection: 'Success',
          properties: {
            accessible: !propsError,
            error: propsError?.message,
            count: properties?.length || 0
          },
          leads: {
            accessible: !leadsError,
            error: leadsError?.message,
            count: leads?.length || 0
          }
        })
      } else {
        setConnectionStatus(`❌ Connection failed: ${result.error}`)
        setDetails({ error: result.error })
      }
    } catch (err) {
      setConnectionStatus(`❌ Error: ${err instanceof Error ? err.message : String(err)}`)
      setDetails({ error: err })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    runConnectionTest()
  }, [])

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Database Connection Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-lg font-medium">
            Status: {connectionStatus}
          </div>
          
          {loading && (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          )}
          
          {details && (
            <div className="bg-gray-100 p-4 rounded-lg">
              <pre className="text-sm overflow-auto">
                {JSON.stringify(details, null, 2)}
              </pre>
            </div>
          )}
          
          <Button onClick={runConnectionTest} disabled={loading}>
            Run Test Again
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/'}
          >
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
