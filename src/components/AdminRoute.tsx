import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSupabase } from '../providers/SupabaseProvider'

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, supabase } = useSupabase()
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [checkingRole, setCheckingRole] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (loading) return

    if (!user) {
      navigate(`/auth/sign-in?redirectedFrom=${encodeURIComponent(location.pathname)}`)
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

        if (error || !profile || profile.role !== 'admin') {
          setIsAdmin(false)
          navigate('/?error=access_denied')
          return
        }

        setIsAdmin(true)
      } catch (error) {
        console.error('Error checking user role:', error)
        setIsAdmin(false)
        navigate('/?error=role_check_failed')
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
