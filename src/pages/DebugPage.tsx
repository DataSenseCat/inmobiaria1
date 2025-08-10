import { useState, useEffect } from 'react'
import { supabase, testConnection } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, Loader2, RefreshCw } from 'lucide-react'

export default function DebugPage() {
  const [connectionStatus, setConnectionStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [testing, setTesting] = useState(false)
  const [tables, setTables] = useState<any[]>([])

  useEffect(() => {
    testConnectionStatus()
  }, [])

  const testConnectionStatus = async () => {
    setTesting(true)
    setConnectionStatus('loading')
    
    try {
      const result = await testConnection()
      
      if (result.success) {
        setConnectionStatus('success')
        setErrorMessage('')
        
        // Try to list tables
        try {
          const { data: tablesData, error } = await supabase.rpc('get_schema_tables')
          if (!error) {
            setTables(tablesData || [])
          }
        } catch (e) {
          console.log('Could not fetch table list:', e)
        }
      } else {
        setConnectionStatus('error')
        setErrorMessage(result.error || 'Unknown error')
      }
    } catch (err) {
      setConnectionStatus('error')
      setErrorMessage(err instanceof Error ? err.message : String(err))
    } finally {
      setTesting(false)
    }
  }

  const testBasicQuery = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('id, title')
        .limit(1)
      
      if (error) {
        alert(`Error en consulta: ${error.message}`)
      } else {
        alert(`Consulta exitosa. Registros encontrados: ${data?.length || 0}`)
      }
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Debug Supabase Connection</h1>
        
        {/* Connection Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {connectionStatus === 'loading' && <Loader2 className="w-5 h-5 animate-spin" />}
              {connectionStatus === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
              {connectionStatus === 'error' && <XCircle className="w-5 h-5 text-red-500" />}
              <span>Estado de Conexión</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Estado:</span>
                <span className={`font-semibold ${
                  connectionStatus === 'success' ? 'text-green-600' : 
                  connectionStatus === 'error' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {connectionStatus === 'loading' && 'Probando...'}
                  {connectionStatus === 'success' && 'Conectado'}
                  {connectionStatus === 'error' && 'Error de conexión'}
                </span>
              </div>
              
              {errorMessage && (
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <p className="text-red-700 text-sm">{errorMessage}</p>
                </div>
              )}
              
              <div className="flex space-x-2">
                <Button 
                  onClick={testConnectionStatus}
                  disabled={testing}
                  size="sm"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Probar Conexión
                </Button>
                
                <Button 
                  onClick={testBasicQuery}
                  disabled={connectionStatus !== 'success'}
                  variant="outline"
                  size="sm"
                >
                  Probar Consulta
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Environment Variables */}
        <Card>
          <CardHeader>
            <CardTitle>Variables de Entorno</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 font-mono text-sm">
              <div className="flex justify-between">
                <span>VITE_SUPABASE_URL:</span>
                <span className={import.meta.env.VITE_SUPABASE_URL ? 'text-green-600' : 'text-red-600'}>
                  {import.meta.env.VITE_SUPABASE_URL ? '✓ Configurada' : '✗ No configurada'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>VITE_SUPABASE_ANON_KEY:</span>
                <span className={import.meta.env.VITE_SUPABASE_ANON_KEY ? 'text-green-600' : 'text-red-600'}>
                  {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✓ Configurada' : '✗ No configurada'}
                </span>
              </div>
              {(!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) && (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mt-4">
                  <p className="text-yellow-700 text-sm">
                    Se están usando valores de fallback. Para usar tu propia base de datos, 
                    configura las variables de entorno VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Supabase Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Configuración Actual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 font-mono text-sm">
              <div>
                <span className="font-semibold">URL:</span> {import.meta.env.VITE_SUPABASE_URL || 'https://xtcdvnzcryshjwwggfrk.supabase.co (fallback)'}
              </div>
              <div>
                <span className="font-semibold">Usando fallback:</span> {
                  (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) ? 'Sí' : 'No'
                }
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tables Information */}
        {tables.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Tablas Disponibles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {tables.map((table, index) => (
                  <div key={index} className="bg-gray-50 p-2 rounded">
                    {table.table_name}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Instrucciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Para usar tu propia base de datos Supabase:</h4>
                <ol className="list-decimal list-inside space-y-1 ml-4">
                  <li>Crea un proyecto en supabase.com</li>
                  <li>Ve a Settings → API</li>
                  <li>Copia la URL del proyecto y la clave anon/public</li>
                  <li>Crea un archivo .env.local en la raíz del proyecto</li>
                  <li>Agrega las variables:
                    <pre className="bg-gray-100 p-2 rounded mt-1">
{`VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima`}
                    </pre>
                  </li>
                  <li>Reinicia el servidor de desarrollo</li>
                </ol>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Para crear las tablas necesarias:</h4>
                <p>Ejecuta el SQL en el editor de Supabase para crear las tablas properties, developments, leads, etc.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
