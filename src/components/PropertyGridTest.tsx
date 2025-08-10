import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

export default function PropertyGridTest() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testExactQuery = async () => {
    setLoading(true)
    try {
      console.log('Testing exact PropertyGrid query...')
      
      let query = supabase
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
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .range(0, 5)

      const { data, error } = await query
      
      console.log('Query result:', { data, error })
      setResult({ success: !error, data, error, count: data?.length })
    } catch (err) {
      console.error('Query failed:', err)
      setResult({ success: false, error: err })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <h3 className="font-semibold text-yellow-900 mb-3">PropertyGrid Query Test</h3>
      
      <Button onClick={testExactQuery} disabled={loading}>
        {loading ? 'Testing...' : 'Test PropertyGrid Query'}
      </Button>
      
      {result && (
        <div className="mt-4">
          <div className={`p-3 rounded ${result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            <strong>Status:</strong> {result.success ? 'Success' : 'Failed'}
            {result.count !== undefined && <span> - Found {result.count} properties</span>}
          </div>
          
          <details className="mt-2">
            <summary className="cursor-pointer text-yellow-700 hover:text-yellow-900">
              Show Raw Result
            </summary>
            <pre className="mt-2 text-xs bg-white p-2 rounded border overflow-auto max-h-60">
              {JSON.stringify(result, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  )
}
