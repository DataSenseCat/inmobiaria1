import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSupabase } from '../providers/SupabaseProvider'
import AdminDiagnosis from './AdminDiagnosis'
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

  // Don't render children if not authenticated or not admin
  if (!user || !isAdmin) {
    return null
  }

  return <>{children}</>
}
