import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSupabase } from '../providers/SupabaseProvider'
import QuickStart from './QuickStart'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { AlertCircle, User, Database } from 'lucide-react'

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, supabase } = useSupabase()
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [checkingRole, setCheckingRole] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (loading) return

    if (!user) {
      setCheckingRole(false)
      return
    }

    // Check user role
    const checkAdminRole = async () => {
      try {
        const { data: profile, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single()

        if (error) {
          console.error('Error checking user role:', error)
          setError(`Error al verificar permisos: ${error.message}`)
          setIsAdmin(false)
          return
        }

        if (!profile || profile.role !== 'admin') {
          setError(profile ? 'No tienes permisos de administrador' : 'Usuario no encontrado en la base de datos')
          setIsAdmin(false)
          return
        }

        setIsAdmin(true)
        setError(null)
      } catch (error) {
        console.error('Error checking user role:', error)
        setError(error instanceof Error ? error.message : 'Error desconocido')
        setIsAdmin(false)
      } finally {
        setCheckingRole(false)
      }
    }

    checkAdminRole()
  }, [user, loading, supabase, navigate, location.pathname])

  // Show loading while checking auth and role
  if (loading || checkingRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Verificando permisos...</p>
        </div>
      </div>
    )
  }

  // Show authentication required if not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-800">
                <User className="h-5 w-5" />
                <span>Acceso Restringido</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-red-700">
                Necesitas estar autenticado para acceder a esta página.
              </p>
              <div className="flex space-x-2">
                <Button
                  onClick={() => navigate(`/auth/sign-in?redirectedFrom=${encodeURIComponent(location.pathname)}`)}
                >
                  Iniciar Sesión
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/demo-admin')}
                >
                  Demo Admin
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/')}
                >
                  Volver al Inicio
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Show admin diagnosis if user is not admin or there are errors
  if (!isAdmin || error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-4xl mx-auto border-orange-200 bg-orange-50 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-orange-800">
                <AlertCircle className="h-5 w-5" />
                <span>Permisos de Administrador Requeridos</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-orange-700">
                Para acceder a <strong>{location.pathname}</strong> necesitas permisos de administrador.
              </p>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <p className="text-red-700 text-sm">
                    <strong>Error:</strong> {error}
                  </p>
                </div>
              )}
              <p className="text-orange-600 text-sm">
                Usa el diagnóstico a continuación para solucionar el problema:
              </p>
            </CardContent>
          </Card>

          <QuickAdminSetup />
        </div>
      </div>
    )
  }

  return <>{children}</>
}
