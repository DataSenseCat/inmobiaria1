import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useSupabase } from '@/providers/SupabaseProvider'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle, 
  AlertCircle, 
  Database, 
  User, 
  Shield, 
  Copy,
  ExternalLink,
  RefreshCw
} from 'lucide-react'

export default function SetupAdminPage() {
  const { user, supabase } = useSupabase()
  const [loading, setLoading] = useState(false)
  const [adminEmail, setAdminEmail] = useState('')
  const [status, setStatus] = useState<{
    tablesExist: boolean
    userInDb: boolean
    isAdmin: boolean
  }>({
    tablesExist: false,
    userInDb: false,
    isAdmin: false
  })
  const [message, setMessage] = useState('')

  useEffect(() => {
    checkStatus()
    if (user?.email) {
      setAdminEmail(user.email)
    }
  }, [user, supabase])

  const checkStatus = async () => {
    try {
      setLoading(true)
      
      // Verificar si la tabla users existe
      const { data: tables } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .eq('table_name', 'users')

      const tablesExist = tables && tables.length > 0

      let userInDb = false
      let isAdmin = false

      if (tablesExist && user) {
        // Verificar si el usuario existe en la tabla users
        const { data: userProfile } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()

        if (userProfile) {
          userInDb = true
          isAdmin = userProfile.role === 'admin'
        }
      }

      setStatus({ tablesExist, userInDb, isAdmin })
    } catch (error) {
      console.error('Error checking status:', error)
    } finally {
      setLoading(false)
    }
  }

  const createUserProfile = async () => {
    if (!user) return

    try {
      setLoading(true)
      setMessage('')

      const { error } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || '',
          role: 'admin'
        })

      if (error) throw error

      setMessage('✅ Perfil de usuario creado exitosamente como administrador')
      checkStatus()
    } catch (error: any) {
      setMessage(`❌ Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const makeAdmin = async () => {
    if (!user) return

    try {
      setLoading(true)
      setMessage('')

      const { error } = await supabase
        .from('users')
        .update({ role: 'admin' })
        .eq('id', user.id)

      if (error) throw error

      setMessage('✅ Usuario convertido a administrador exitosamente')
      checkStatus()
    } catch (error: any) {
      setMessage(`❌ Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const sqlSetupScript = `-- Ejecutar en Supabase SQL Editor
-- 1. Crear las tablas necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'agent', 'user')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Configurar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 3. Crear políticas
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON users
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

-- 4. Convertir tu usuario en admin (reemplaza con tu email)
UPDATE users SET role = 'admin' WHERE email = '${adminEmail}';`

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setMessage('📋 SQL copiado al portapapeles')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Configuración de Administrador
          </h1>
          <p className="text-gray-600">
            Configura el primer usuario administrador para acceder al panel de control
          </p>
        </div>

        {/* Estado actual */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Estado Actual del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Tablas de la base de datos</span>
                <Badge variant={status.tablesExist ? "default" : "destructive"}>
                  {status.tablesExist ? (
                    <><CheckCircle className="w-4 h-4 mr-1" /> Configuradas</>
                  ) : (
                    <><AlertCircle className="w-4 h-4 mr-1" /> No configuradas</>
                  )}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span>Usuario en base de datos</span>
                <Badge variant={status.userInDb ? "default" : "secondary"}>
                  {status.userInDb ? (
                    <><CheckCircle className="w-4 h-4 mr-1" /> Existe</>
                  ) : (
                    <><User className="w-4 h-4 mr-1" /> No existe</>
                  )}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span>Permisos de administrador</span>
                <Badge variant={status.isAdmin ? "default" : "secondary"}>
                  {status.isAdmin ? (
                    <><Shield className="w-4 h-4 mr-1" /> Admin</>
                  ) : (
                    <><User className="w-4 h-4 mr-1" /> Usuario normal</>
                  )}
                </Badge>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={checkStatus}
                  disabled={loading}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Verificar Estado
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mensajes */}
        {message && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 text-sm">{message}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Usuario actual */}
        {user && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Usuario Actual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <Label>Email</Label>
                  <Input
                    value={user.email || ''}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
                <div>
                  <Label>ID de Usuario</Label>
                  <Input
                    value={user.id}
                    disabled
                    className="bg-gray-50 font-mono text-xs"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Acciones rápidas */}
        {user && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {!status.tablesExist && (
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <h3 className="font-semibold text-orange-800 mb-2">
                      ⚠️ Base de datos no configurada
                    </h3>
                    <p className="text-orange-700 text-sm mb-3">
                      Necesitas ejecutar el script SQL en Supabase SQL Editor primero.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open('https://app.supabase.com', '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Abrir Supabase
                    </Button>
                  </div>
                )}

                {status.tablesExist && !status.userInDb && (
                  <div>
                    <Button
                      onClick={createUserProfile}
                      disabled={loading}
                      className="w-full"
                    >
                      Crear Perfil de Usuario como Admin
                    </Button>
                    <p className="text-sm text-gray-600 mt-2">
                      Esto creará tu perfil en la base de datos con permisos de administrador.
                    </p>
                  </div>
                )}

                {status.tablesExist && status.userInDb && !status.isAdmin && (
                  <div>
                    <Button
                      onClick={makeAdmin}
                      disabled={loading}
                      className="w-full"
                    >
                      Convertir en Administrador
                    </Button>
                    <p className="text-sm text-gray-600 mt-2">
                      Esto te otorgará permisos de administrador.
                    </p>
                  </div>
                )}

                {status.isAdmin && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h3 className="font-semibold text-green-800 mb-2">
                      ✅ ¡Configuración completada!
                    </h3>
                    <p className="text-green-700 text-sm mb-3">
                      Ya tienes permisos de administrador. Puedes acceder al panel de control.
                    </p>
                    <Button
                      onClick={() => window.location.href = '/admin'}
                      className="w-full"
                    >
                      Ir al Panel de Administración
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Script SQL */}
        <Card>
          <CardHeader>
            <CardTitle>Script SQL para Supabase</CardTitle>
            <p className="text-sm text-gray-600">
              Ejecuta este script en el SQL Editor de Supabase si las tablas no están configuradas.
            </p>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
                {sqlSetupScript}
              </pre>
              <Button
                variant="outline"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(sqlSetupScript)}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copiar
              </Button>
            </div>
            <div className="mt-4 flex gap-2">
              <Button
                variant="outline"
                onClick={() => window.open('https://app.supabase.com', '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Abrir Supabase SQL Editor
              </Button>
              <Button
                variant="outline"
                onClick={() => copyToClipboard(sqlSetupScript)}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copiar Script
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Instrucciones */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Instrucciones Paso a Paso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold">Registrarse o Iniciar Sesión</h3>
                  <p className="text-sm text-gray-600">
                    Ve a la página de login y crea una cuenta o inicia sesión con tu cuenta existente.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold">Configurar Base de Datos</h3>
                  <p className="text-sm text-gray-600">
                    Ejecuta el script SQL en Supabase SQL Editor para crear las tablas necesarias.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold">Crear Perfil de Admin</h3>
                  <p className="text-sm text-gray-600">
                    Usa el botón "Crear Perfil de Usuario como Admin" o ejecuta el script SQL.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  4
                </div>
                <div>
                  <h3 className="font-semibold">Acceder al Panel</h3>
                  <p className="text-sm text-gray-600">
                    Una vez configurado, podrás acceder al panel de administración en /admin.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
