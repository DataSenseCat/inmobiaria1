import { useSupabase } from '../providers/SupabaseProvider'
import { useEffect, useState } from 'react'

export default function AuthDebugPage() {
  const { user, session, loading, supabase } = useSupabase()
  const [userProfile, setUserProfile] = useState<any>(null)
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileError, setProfileError] = useState<string>('')

  useEffect(() => {
    if (user && !loading) {
      setProfileLoading(true)
      supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()
        .then(({ data, error }) => {
          if (error) {
            setProfileError(error.message)
          } else {
            setUserProfile(data)
          }
          setProfileLoading(false)
        })
    }
  }, [user, loading, supabase])

  if (loading) return <div>Cargando autenticación...</div>

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Debug de Autenticación</h1>
      
      <div className="space-y-4">
        <div className="border p-4 rounded">
          <h2 className="text-lg font-semibold">Estado de autenticación</h2>
          <p>Usuario autenticado: {user ? 'Sí' : 'No'}</p>
          <p>Sesión activa: {session ? 'Sí' : 'No'}</p>
          <p>Cargando: {loading ? 'Sí' : 'No'}</p>
        </div>

        {user && (
          <div className="border p-4 rounded">
            <h2 className="text-lg font-semibold">Datos del usuario (auth)</h2>
            <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
        )}

        {session && (
          <div className="border p-4 rounded">
            <h2 className="text-lg font-semibold">Datos de la sesión</h2>
            <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>
        )}

        <div className="border p-4 rounded">
          <h2 className="text-lg font-semibold">Perfil del usuario (tabla users)</h2>
          {profileLoading && <p>Cargando perfil...</p>}
          {profileError && <p className="text-red-500">Error: {profileError}</p>}
          {userProfile && (
            <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
              {JSON.stringify(userProfile, null, 2)}
            </pre>
          )}
          {!profileLoading && !profileError && !userProfile && user && (
            <p className="text-yellow-600">No se encontró perfil en la tabla users</p>
          )}
        </div>

        <div className="border p-4 rounded">
          <h2 className="text-lg font-semibold">Acciones</h2>
          <div className="space-x-2">
            <button 
              onClick={() => supabase.auth.signOut()}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Cerrar Sesión
            </button>
            <a 
              href="/auth/sign-in"
              className="bg-blue-500 text-white px-4 py-2 rounded inline-block"
            >
              Iniciar Sesión
            </a>
            <a 
              href="/admin"
              className="bg-green-500 text-white px-4 py-2 rounded inline-block"
            >
              Ir a Admin
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
