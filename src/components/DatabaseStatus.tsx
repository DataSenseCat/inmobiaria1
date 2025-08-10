import { useState, useEffect } from 'react'
import { testConnection } from '@/lib/supabase/client'
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react'

export default function DatabaseStatus() {
  const [status, setStatus] = useState<'loading' | 'connected' | 'error'>('loading')
  const [message, setMessage] = useState('Conectando...')

  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = async () => {
    setStatus('loading')
    setMessage('Verificando conexión a la base de datos...')
    
    try {
      const result = await testConnection()
      
      if (result.success) {
        setStatus('connected')
        setMessage('Base de datos conectada correctamente')
      } else {
        setStatus('error')
        setMessage(result.error || 'Error de conexión')
      }
    } catch (err) {
      setStatus('error')
      setMessage(err instanceof Error ? err.message : 'Error desconocido')
    }
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center space-x-2 text-blue-600 text-sm">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>{message}</span>
      </div>
    )
  }

  if (status === 'connected') {
    return (
      <div className="flex items-center space-x-2 text-green-600 text-sm">
        <CheckCircle className="h-4 w-4" />
        <span>{message}</span>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-2 text-orange-600 text-sm">
      <AlertCircle className="h-4 w-4" />
      <span>{message}</span>
    </div>
  )
}
