import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, CheckCircle, User, Copy, ExternalLink } from 'lucide-react'

export default function DemoAdminPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const [credentials, setCredentials] = useState({
    email: 'test@test.com',
    password: 'test123456'
  })

  // SQL script that the user needs to run
  const sqlScript = `-- SCRIPT SIMPLE PARA CREAR ADMIN
-- Ejecuta esto en Supabase SQL Editor

-- 1. Crear tabla users si no existe
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'agent', 'user')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Crear políticas básicas para properties
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can manage all properties" ON properties;
CREATE POLICY "Admins can manage all properties" ON properties
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

-- 3. Hacer admin al usuario actual (ejecuta esto DESPUÉS de autenticarte)
INSERT INTO users (id, email, role, full_name)
SELECT 
    auth.uid(),
    auth.email(),
    'admin',
    'Admin Usuario'
ON CONFLICT (id) 
DO UPDATE SET 
    role = 'admin',
    updated_at = NOW();

-- ¡LISTO! Recarga la página después de ejecutar esto.`

  const createQuickAdmin = async () => {
    setLoading(true)
    setError('')
    setMessage('Iniciando sesión con credenciales de prueba...')

    try {
      // Step 1: Try to sign in with test credentials
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      })

      if (signInError) {
        if (signInError.message.includes('Invalid')) {
          setMessage('Las credenciales no existen. Creando cuenta...')
          
          // Try to create the account
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: credentials.email,
            password: credentials.password,
            options: {
              data: {
                full_name: 'Admin Usuario'
              }
            }
          })

          if (signUpError) {
            throw new Error(`Error creando cuenta: ${signUpError.message}`)
          }

          setMessage('Cuenta creada. Inicia sesión manualmente y ejecuta el script SQL.')
        } else {
          throw signInError
        }
      } else {
        setMessage('¡Autenticado exitosamente! Ahora ejecuta el script SQL para hacerte admin.')
      }

      setMessage(prev => prev + '\n\nAhora necesitas ejecutar el script SQL en Supabase para obtener permisos de admin.')

    } catch (err: any) {
      console.error('Error:', err)
      setError(`Error: ${err.message}`)
      setMessage('Si tienes problemas, sigue las instrucciones manuales de abajo.')
    } finally {
      setLoading(false)
    }
  }

  const goToAdminPanel = () => {
    navigate('/admin')
  }

  const goToLogin = () => {
    navigate('/auth/sign-in')
  }

  const copyScript = () => {
    navigator.clipboard.writeText(sqlScript)
    setMessage('¡Script SQL copiado! Pégalo en Supabase SQL Editor.')
  }

  const copyCredentials = () => {
    const text = `Email: ${credentials.email}\nContraseña: ${credentials.password}`
    navigator.clipboard.writeText(text)
    setMessage('¡Credenciales copiadas!')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Solución Rápida - Admin Demo</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Status Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-3">
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          {message && (
            <div className="bg-blue-50 border border-blue-200 rounded p-3">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
                <p className="text-blue-700 text-sm whitespace-pre-line">{message}</p>
              </div>
            </div>
          )}

          {/* Quick Solution */}
          <div className="bg-green-50 border border-green-200 rounded p-4">
            <h3 className="font-bold text-green-800 mb-3">🎯 SOLUCIÓN RÁPIDA (3 pasos)</h3>
            
            <div className="space-y-4">
              {/* Step 1 */}
              <div className="flex items-start space-x-3">
                <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-green-800">Autenticarse</h4>
                  <p className="text-green-700 text-sm mb-2">Usa estas credenciales de prueba:</p>
                  <div className="bg-white p-2 rounded border font-mono text-sm">
                    <div><strong>Email:</strong> {credentials.email}</div>
                    <div><strong>Contraseña:</strong> {credentials.password}</div>
                  </div>
                  <div className="flex space-x-2 mt-2">
                    <Button size="sm" onClick={createQuickAdmin} disabled={loading}>
                      {loading ? 'Procesando...' : 'Auto-Login'}
                    </Button>
                    <Button size="sm" variant="outline" onClick={goToLogin}>
                      Login Manual
                    </Button>
                    <Button size="sm" variant="outline" onClick={copyCredentials}>
                      <Copy className="h-3 w-3 mr-1" />
                      Copiar
                    </Button>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start space-x-3">
                <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-green-800">Ejecutar Script SQL</h4>
                  <p className="text-green-700 text-sm mb-2">Copia y ejecuta este script en Supabase SQL Editor:</p>
                  <div className="bg-gray-900 text-green-400 p-3 rounded text-xs overflow-auto max-h-40 font-mono">
                    {sqlScript}
                  </div>
                  <div className="flex space-x-2 mt-2">
                    <Button size="sm" onClick={copyScript}>
                      <Copy className="h-3 w-3 mr-1" />
                      Copiar Script
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.open('https://xtcdvnzcryshjwwggfrk.supabase.co/project/default/sql', '_blank')}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Abrir SQL Editor
                    </Button>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start space-x-3">
                <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-green-800">Probar Panel Admin</h4>
                  <p className="text-green-700 text-sm mb-2">Después de ejecutar el script, accede al panel:</p>
                  <Button onClick={goToAdminPanel}>
                    Ir al Panel Admin
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Manual Instructions */}
          <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
            <h3 className="font-bold text-yellow-800 mb-3">📋 INSTRUCCIONES MANUALES (si falla lo anterior)</h3>
            <ol className="list-decimal list-inside space-y-2 text-yellow-700 text-sm">
              <li>Ve a <a href="/auth/sign-in" className="underline">página de login</a></li>
              <li>Crea una cuenta nueva o usa: {credentials.email} / {credentials.password}</li>
              <li>Ve a <a href="https://xtcdvnzcryshjwwggfrk.supabase.co/project/default/sql" target="_blank" className="underline">Supabase SQL Editor</a></li>
              <li>Ejecuta el script SQL (usa el botón "Copiar Script")</li>
              <li>Recarga <a href="/admin" className="underline">el panel admin</a></li>
            </ol>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => navigate('/')}>
              🏠 Inicio
            </Button>
            <Button variant="outline" onClick={() => navigate('/auth/sign-in')}>
              🔑 Login
            </Button>
            <Button variant="outline" onClick={() => navigate('/admin')}>
              ⚡ Panel Admin
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              🔄 Recargar
            </Button>
          </div>

          <div className="text-xs text-gray-500 bg-gray-100 p-3 rounded">
            <strong>IMPORTANTE:</strong> Esta es una solución simplificada para demostración. 
            El problema principal es que Supabase está rechazando emails o hay restricciones de dominio. 
            Esta solución omite la complejidad innecesaria y te da acceso directo al panel admin.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
