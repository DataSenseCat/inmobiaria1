import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, CheckCircle, User, RefreshCw, Copy } from 'lucide-react'

export default function DemoAdminPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: 'demo@example.com',
    password: 'demo123456',
    fullName: 'Administrador Demo'
  })

  // Predefined demo accounts to try
  const demoAccounts = [
    { email: 'demo@example.com', password: 'demo123456' },
    { email: 'test@test.com', password: 'test123456' },
    { email: 'admin@test.com', password: 'admin123456' }
  ]

  const generateRandomEmail = () => {
    const randomString = Math.random().toString(36).substr(2, 9)
    return `demo${randomString}@example.com`
  }

  const createDemoAdmin = async () => {
    setLoading(true)
    setError('')
    setMessage('')

    // List of emails to try (current form data + predefined accounts + random)
    const emailsToTry = [
      formData.email,
      ...demoAccounts.map(acc => acc.email),
      generateRandomEmail()
    ]

    let successfulEmail = ''
    let successfulPassword = formData.password

    for (let i = 0; i < emailsToTry.length; i++) {
      const currentEmail = emailsToTry[i]
      
      // Use the password from predefined accounts if available
      const accountMatch = demoAccounts.find(acc => acc.email === currentEmail)
      const currentPassword = accountMatch ? accountMatch.password : formData.password
      
      try {
        setMessage(`Intentando crear usuario ${i + 1}/${emailsToTry.length}: ${currentEmail}`)
        
        // Try to create user
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: currentEmail,
          password: currentPassword,
          options: {
            data: {
              full_name: formData.fullName
            }
          }
        })

        if (authError) {
          // If user already exists, try to sign in
          if (authError.message.includes('already') || authError.message.includes('registered')) {
            setMessage(`Usuario ${currentEmail} ya existe, iniciando sesión...`)
            
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
              email: currentEmail,
              password: currentPassword
            })

            if (signInError) {
              // If sign in fails, try next email
              if (i < emailsToTry.length - 1) {
                setMessage(`Error al iniciar sesión con ${currentEmail}, probando siguiente...`)
                continue
              }
              throw signInError
            }
            
            successfulEmail = currentEmail
            successfulPassword = currentPassword
            break
            
          } else if (authError.message.includes('invalid') || authError.message.includes('not allowed')) {
            // If email is invalid or not allowed, try next one
            if (i < emailsToTry.length - 1) {
              setMessage(`Email ${currentEmail} no permitido, probando siguiente...`)
              continue
            }
            throw new Error(`Todos los emails fueron rechazados. Error: ${authError.message}`)
          } else {
            throw authError
          }
        } else {
          // Success creating new user
          successfulEmail = currentEmail
          successfulPassword = currentPassword
          setMessage(`Usuario creado exitosamente: ${currentEmail}`)
          break
        }
      } catch (err: any) {
        if (i < emailsToTry.length - 1) {
          setMessage(`Error con ${currentEmail}: ${err.message}. Probando siguiente...`)
          continue
        }
        // If this is the last email and it failed, throw the error
        throw err
      }
    }

    if (!successfulEmail) {
      throw new Error('No se pudo crear ningún usuario demo')
    }

    // Update form data with successful credentials
    setFormData(prev => ({ 
      ...prev, 
      email: successfulEmail,
      password: successfulPassword
    }))

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('No se pudo obtener el usuario autenticado')
      }

      setMessage('Configurando permisos de administrador...')

      // Create/update user profile as admin
      const { error: profileError } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          email: successfulEmail,
          full_name: formData.fullName,
          role: 'admin'
        })

      if (profileError) {
        console.warn('Error creating user profile:', profileError)
        setMessage('Usuario creado, pero hubo un problema configurando permisos. Ejecuta el script SQL para completar la configuración.')
      } else {
        setMessage('¡Administrador creado exitosamente! Redirigiendo al panel...')
        
        // Redirect to admin panel after delay
        setTimeout(() => {
          navigate('/admin')
        }, 2000)
        
        return // Exit function here on success
      }

    } catch (err: any) {
      console.error('Error creating demo admin:', err)
      setError(`Error: ${err.message || 'Error desconocido'}`)
    } finally {
      setLoading(false)
    }
  }

  const copyCredentials = () => {
    const text = `Email: ${formData.email}\nContraseña: ${formData.password}`
    navigator.clipboard.writeText(text)
  }

  const tryPredefinedAccount = (account: typeof demoAccounts[0]) => {
    setFormData(prev => ({
      ...prev,
      email: account.email,
      password: account.password
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Demo Admin - Crear Administrador</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-gray-600">
            Esta página crea un usuario administrador de demostración. Si un email falla, 
            automáticamente probará con otros emails hasta encontrar uno que funcione.
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="font-semibold">Configuración Actual</h3>
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

            <div className="space-y-3">
              <h3 className="font-semibold">Cuentas Demo Predefinidas</h3>
              <p className="text-xs text-gray-500">Haz clic para usar estas credenciales probadas:</p>
              {demoAccounts.map((account, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="w-full text-left justify-start"
                  onClick={() => tryPredefinedAccount(account)}
                >
                  <div className="text-xs">
                    <div>{account.email}</div>
                    <div className="text-gray-500">{account.password}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={createDemoAdmin} 
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Creando Admin Demo...
                </>
              ) : (
                'Crear Admin Demo'
              )}
            </Button>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Button 
                variant="outline"
                onClick={() => navigate('/auth/sign-in')}
              >
                Login Normal
              </Button>
              
              <Button 
                variant="outline"
                onClick={copyCredentials}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copiar Credenciales
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => navigate('/')}
              >
                Volver al Inicio
              </Button>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
              <h4 className="font-semibold text-yellow-800 mb-2">Información Importante:</h4>
              <ul className="text-xs text-yellow-700 space-y-1">
                <li>• Si un email es rechazado, se probará automáticamente con otros</li>
                <li>• Las credenciales exitosas se mostrarán para uso futuro</li>
                <li>• Esta funcionalidad es solo para demostración y desarrollo</li>
                <li>• En producción, los administradores deben crearse de forma segura</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
