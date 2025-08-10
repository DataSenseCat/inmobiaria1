import { createClient } from '@/lib/supabase/server'

export default async function DebugAdminPage() {
  const supabase = createClient()

  try {
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      return (
        <div className="min-h-screen bg-background p-8">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Debug: Error de Autenticación</h1>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">Error: {authError.message}</p>
            </div>
            <div className="mt-4">
              <a href="/auth/sign-in" className="text-blue-600 hover:underline">
                → Ir a Iniciar Sesión
              </a>
            </div>
          </div>
        </div>
      )
    }

    if (!user) {
      return (
        <div className="min-h-screen bg-background p-8">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Debug: Usuario No Autenticado</h1>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800">No hay usuario autenticado</p>
            </div>
            <div className="mt-4">
              <a href="/auth/sign-in" className="text-blue-600 hover:underline">
                → Ir a Iniciar Sesión
              </a>
            </div>
          </div>
        </div>
      )
    }

    // Check if user has profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold">Debug: Estado de Autenticación</h1>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h2 className="font-semibold text-green-800 mb-2">Usuario Autenticado ✓</h2>
            <div className="text-sm text-green-700 space-y-1">
              <p><strong>ID:</strong> {user.id}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Created:</strong> {new Date(user.created_at).toLocaleString()}</p>
            </div>
          </div>

          {profileError ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h2 className="font-semibold text-red-800 mb-2">Error de Perfil</h2>
              <p className="text-red-700 text-sm">{profileError.message}</p>
              <div className="mt-3">
                <p className="text-red-700 text-sm">
                  <strong>Solución:</strong> Necesitas configurar tu perfil como administrador.
                </p>
              </div>
            </div>
          ) : profile ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h2 className="font-semibold text-blue-800 mb-2">Perfil Encontrado ✓</h2>
              <div className="text-sm text-blue-700 space-y-1">
                <p><strong>Nombre:</strong> {profile.name || 'Sin nombre'}</p>
                <p><strong>Rol:</strong> {profile.role || 'Sin rol'}</p>
                <p><strong>Created:</strong> {new Date(profile.created_at).toLocaleString()}</p>
              </div>
              
              {profile.role === 'admin' || profile.role === 'agent' ? (
                <div className="mt-3">
                  <a 
                    href="/admin" 
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                  >
                    → Ir al Panel de Administración
                  </a>
                </div>
              ) : (
                <div className="mt-3 bg-yellow-100 border border-yellow-300 rounded p-3">
                  <p className="text-yellow-800 text-sm">
                    <strong>Problema:</strong> Tu rol actual es "{profile.role || 'ninguno'}". 
                    Necesitas rol "admin" o "agent" para acceder al panel.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h2 className="font-semibold text-yellow-800 mb-2">Sin Perfil</h2>
              <p className="text-yellow-700 text-sm">No se encontró perfil para este usuario.</p>
            </div>
          )}

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h2 className="font-semibold text-gray-800 mb-2">Configuración Manual de Admin</h2>
            <p className="text-gray-700 text-sm mb-3">
              Si necesitas convertirte en administrador, ejecuta este SQL en tu base de datos:
            </p>
            <code className="block bg-gray-800 text-green-400 p-3 rounded text-sm font-mono">
              {`INSERT INTO profiles (user_id, name, role, created_at)
VALUES ('${user.id}', 'Administrador', 'admin', NOW())
ON CONFLICT (user_id) 
DO UPDATE SET role = 'admin';`}
            </code>
          </div>

          <div className="flex gap-4 text-sm">
            <a href="/" className="text-blue-600 hover:underline">← Volver al Inicio</a>
            <a href="/configurar-db" className="text-blue-600 hover:underline">Configurar Base de Datos</a>
          </div>
        </div>
      </div>
    )
  } catch (error: any) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Debug: Error Crítico</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">Error inesperado: {error.message}</p>
          </div>
        </div>
      </div>
    )
  }
}
