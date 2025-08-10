'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { Loader2, CheckCircle, AlertCircle, User, Shield } from 'lucide-react'

export default function ConfigurarAdminPage() {
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [name, setName] = useState('')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !user) {
        router.push('/auth/sign-in')
        return
      }

      setUser(user)

      // Check for existing profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      setProfile(profile)
      if (profile?.name) {
        setName(profile.name)
      }
    } catch (error) {
      console.error('Error checking user:', error)
    }
  }

  const setupAdmin = async () => {
    if (!user) return
    
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          name: name || 'Administrador',
          role: 'admin',
          created_at: new Date().toISOString()
        })

      if (error) throw error

      setMessage('¡Perfil de administrador configurado exitosamente!')
      setTimeout(() => {
        router.push('/admin')
      }, 2000)
    } catch (error: any) {
      console.error('Error setting up admin:', error)
      setError(error.message || 'Error al configurar administrador')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center p-6">
            <Loader2 className="h-6 w-6 animate-spin" />
          </CardContent>
        </Card>
      </div>
    )
  }

  const isAlreadyAdmin = profile?.role === 'admin' || profile?.role === 'agent'

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {isAlreadyAdmin ? (
              <CheckCircle className="h-12 w-12 text-green-500" />
            ) : (
              <Shield className="h-12 w-12 text-blue-500" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold">
            {isAlreadyAdmin ? 'Acceso de Administrador' : 'Configurar Administrador'}
          </CardTitle>
          <CardDescription>
            {isAlreadyAdmin 
              ? 'Ya tienes acceso al panel de administración'
              : 'Configura tu perfil como administrador del sistema'
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* User Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-gray-500" />
              <div>
                <p className="font-medium">{user.email}</p>
                <p className="text-sm text-gray-500">Usuario actual</p>
              </div>
            </div>
          </div>

          {/* Profile Status */}
          {profile ? (
            <div className={`rounded-lg p-4 ${isAlreadyAdmin ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
              <div className="flex items-center gap-3">
                {isAlreadyAdmin ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                )}
                <div>
                  <p className={`font-medium ${isAlreadyAdmin ? 'text-green-800' : 'text-yellow-800'}`}>
                    {profile.name} - Rol: {profile.role}
                  </p>
                  <p className={`text-sm ${isAlreadyAdmin ? 'text-green-600' : 'text-yellow-600'}`}>
                    {isAlreadyAdmin ? 'Acceso autorizado' : 'Necesita actualización de rol'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-800">Sin perfil</p>
                  <p className="text-sm text-blue-600">Necesitas crear un perfil de administrador</p>
                </div>
              </div>
            </div>
          )}

          {/* Name input for new admins */}
          {!isAlreadyAdmin && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Administrador
              </label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre completo"
                className="w-full"
              />
            </div>
          )}

          {/* Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {message && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-green-800 text-sm">{message}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {isAlreadyAdmin ? (
              <Button 
                onClick={() => router.push('/admin')}
                className="w-full"
              >
                <Shield className="h-4 w-4 mr-2" />
                Ir al Panel de Administración
              </Button>
            ) : (
              <Button
                onClick={setupAdmin}
                disabled={loading || !name.trim()}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Configurando...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Configurar como Administrador
                  </>
                )}
              </Button>
            )}
            
            <Button
              variant="outline"
              onClick={() => router.push('/')}
              className="w-full"
            >
              Volver al Inicio
            </Button>
          </div>

          {!isAlreadyAdmin && (
            <div className="text-center">
              <p className="text-xs text-gray-500">
                Al configurarte como administrador tendrás acceso completo al sistema
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
