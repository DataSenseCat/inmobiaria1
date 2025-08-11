import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, CheckCircle, User } from 'lucide-react'

export default function DemoAdminPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: 'admin@inmobiliaria.com',
    password: 'admin123',
    fullName: 'Administrador Demo'
  })

  const createDemoAdmin = async () => {
    setLoading(true)
    setError('')
    setMessage('')

    try {
      // Step 1: Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName
          }
        }
      })

      if (authError) {
        // If user already exists, try to sign in
        if (authError.message.includes('already')) {
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password
          })

          if (signInError) throw signInError
          
          setMessage('Usuario ya existe, iniciando sesión...')
          
          // Check if user is already admin
          const { data: existingProfile } = await supabase
            .from('users')
            .select('role')
            .eq('id', signInData.user.id)
            .single()

          if (existingProfile?.role === 'admin') {
            setMessage('Ya eres administrador. Redirigiendo...')
            setTimeout(() => navigate('/admin'), 2000)
            return
          }
        } else {
          throw authError
        }
      }

      const userId = authData?.user?.id || (await supabase.auth.getUser()).data.user?.id

      if (!userId) {
        throw new Error('No se pudo obtener el ID del usuario')
      }

      // Step 2: Create/update user profile as admin
      const { error: profileError } = await supabase
        .from('users')
        .upsert({
          id: userId,
          email: formData.email,
          full_name: formData.fullName,
          role: 'admin'
        })

      if (profileError) throw profileError

      setMessage('¡Administrador creado exitosamente! Redirigiendo al panel...')
      
      // Redirect to admin panel after short delay
      setTimeout(() => {
        navigate('/admin')
      }, 2000)

    } catch (err: any) {
      console.error('Error creating demo admin:', err)
      setError(err.message || 'Error al crear administrador')
    } finally {
      setLoading(false)
    }
  }

  const runQuickSetup = async () => {
    setLoading(true)
    setError('')
    setMessage('Ejecutando configuración completa...')

    try {
      // Execute the setup SQL
      const setupSQL = `
        -- Create users table if not exists
        CREATE TABLE IF NOT EXISTS users (
            id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
            email TEXT UNIQUE NOT NULL,
            full_name TEXT,
            phone TEXT,
            role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'agent', 'user')),
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        -- Create developments table if not exists
        CREATE TABLE IF NOT EXISTS developments (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name TEXT NOT NULL,
            description TEXT,
            address TEXT,
            city TEXT NOT NULL,
            total_units INTEGER,
            available_units INTEGER,
            price_from DECIMAL,
            price_to DECIMAL,
            delivery_date DATE,
            status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'construction', 'completed', 'delivered')),
            featured BOOLEAN DEFAULT false,
            active BOOLEAN DEFAULT true,
            agent_id UUID REFERENCES users(id),
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        -- Enable RLS
        ALTER TABLE users ENABLE ROW LEVEL SECURITY;
        ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
        ALTER TABLE developments ENABLE ROW LEVEL SECURITY;

        -- Create policies
        DROP POLICY IF EXISTS "Admins can manage all properties" ON properties;
        CREATE POLICY "Admins can manage all properties" ON properties
            FOR ALL USING (
                EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
            );

        DROP POLICY IF EXISTS "Developments are viewable by everyone" ON developments;
        DROP POLICY IF EXISTS "Admins can manage developments" ON developments;
        CREATE POLICY "Developments are viewable by everyone" ON developments
            FOR SELECT USING (active = true);
        CREATE POLICY "Admins can manage developments" ON developments
            FOR ALL USING (
                EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
            );
      `

      // Note: We can't execute this SQL from the frontend, so we'll show instructions
      setMessage(`
        Configuración preparada. Por favor:
        1. Ve a Supabase SQL Editor
        2. Ejecuta el script que aparece en el panel admin
        3. Luego usa el botón "Crear Admin Demo"
      `)

    } catch (err: any) {
      setError(err.message || 'Error en configuración')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Demo Admin - Crear Administrador</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Esta página te permite crear un usuario administrador de demostración para probar todas las funcionalidades.
          </p>

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
                <p className="text-blue-700 text-sm">{message}</p>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="fullName">Nombre Completo</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Button 
              onClick={createDemoAdmin} 
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Creando...' : 'Crear Admin Demo'}
            </Button>

            <Button 
              variant="outline"
              onClick={() => navigate('/auth/sign-in')}
              className="w-full"
            >
              Ir a Login Normal
            </Button>

            <Button 
              variant="outline"
              onClick={() => navigate('/')}
              className="w-full"
            >
              Volver al Inicio
            </Button>
          </div>

          <div className="border-t pt-4">
            <p className="text-xs text-gray-500">
              <strong>Nota:</strong> Esta funcionalidad es solo para demostración. 
              En producción, los administradores deben crearse de forma segura.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
