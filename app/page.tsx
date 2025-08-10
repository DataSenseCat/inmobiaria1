export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🏠 Inmobiliaria Catamarca
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Las mejores propiedades en Catamarca
        </p>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Sistema Inmobiliario</h2>
          <p className="text-gray-700 mb-4">
            Plataforma completa con Next.js 14, Supabase y Builder.io
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-green-100 p-3 rounded">
              ✅ Next.js 14 funcionando
            </div>
            <div className="bg-yellow-100 p-3 rounded">
              ⚠️ Supabase: Necesita migraciones
            </div>
            <div className="bg-blue-100 p-3 rounded">
              🔧 Builder.io: Configurar API key
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
