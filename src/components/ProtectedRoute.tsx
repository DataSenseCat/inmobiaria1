import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSupabase } from '../providers/SupabaseProvider'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useSupabase()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!loading && !user) {
      // Redirect to sign-in with the current path as redirect
      navigate(`/auth/sign-in?redirectedFrom=${encodeURIComponent(location.pathname)}`)
    }
  }, [user, loading, navigate, location.pathname])

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    )
  }

  // Don't render children if not authenticated
  if (!user) {
    return null
  }

  return <>{children}</>
}
