export default function ConfigurarDBPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              🏠 Configurar Base de Datos
            </h1>
            <p className="text-xl text-gray-600">
              Sigue estos pasos para activar tu aplicación inmobiliaria
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Pasos */}
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-blue-600">
                📋 Pasos de Configuración
              </h2>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Abrir Supabase</h3>
                    <p className="text-gray-600 mb-2">
                      Ve a <a href="https://app.supabase.com" target="_blank" className="text-blue-600 hover:underline">app.supabase.com</a>
                    </p>
                    <p className="text-sm text-gray-500">
                      Usa las credenciales que ya están configuradas en la app
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">SQL Editor</h3>
                    <p className="text-gray-600">
                      En el menú lateral, haz click en "SQL Editor"
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Ejecutar Script</h3>
                    <p className="text-gray-600 mb-2">
                      Copia y pega el script SQL y haz click en "Run"
                    </p>
                    <button 
                      onClick={() => window.open('/init-database.sql', '_blank')}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                    >
                      📄 Abrir Script SQL
                    </button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">¡Listo!</h3>
                    <p className="text-gray-600">
                      Tu aplicación inmobiliaria estará completamente funcional
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Lo que obtienes */}
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-green-600">
                ✨ Lo que Obtienes
              </h2>
              
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">🏠 5 Propiedades de Ejemplo</h3>
                  <p className="text-green-700 text-sm">
                    Casas, departamentos, lotes y locales en Catamarca
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">👥 2 Agentes Inmobiliarios</h3>
                  <p className="text-blue-700 text-sm">
                    María González y Carlos Rodríguez con contactos
                  </p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-800 mb-2">🖼️ Imágenes de Propiedades</h3>
                  <p className="text-purple-700 text-sm">
                    Fotos profesionales de cada propiedad
                  </p>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-yellow-800 mb-2">🔒 Seguridad Configurada</h3>
                  <p className="text-yellow-700 text-sm">
                    Row Level Security (RLS) y políticas de acceso
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">📊 Funcionalidades Incluidas</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>✅ Listado y filtrado de propiedades</li>
                  <li>✅ Formularios de contacto</li>
                  <li>✅ Integración WhatsApp</li>
                  <li>✅ Panel de administración</li>
                  <li>✅ Gestión de leads</li>
                  <li>✅ Upload de imágenes</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <a 
              href="/"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
            >
              ← Volver a la App
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
