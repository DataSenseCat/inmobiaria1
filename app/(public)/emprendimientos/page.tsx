import { Suspense } from 'react'
import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { DevelopmentCard } from '@/components/developments/DevelopmentCard'

export const metadata: Metadata = {
  title: 'Emprendimientos Inmobiliarios - Catamarca',
  description: 'Descubre los últimos emprendimientos inmobiliarios en Catamarca. Complejos residenciales, barrios cerrados y más.',
  openGraph: {
    title: 'Emprendimientos - Inmobiliaria Catamarca',
    description: 'Explora nuestros emprendimientos inmobiliarios de vanguardia',
    type: 'website'
  }
}

export const revalidate = 3600 // Revalidate every hour

async function getDevelopments() {
  const supabase = createClient()
  
  const { data: developments, error } = await supabase
    .from('developments')
    .select(`
      *,
      agents (
        name,
        phone,
        email
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching developments:', error)
    return []
  }

  return developments || []
}

export default async function EmprendimientosPage() {
  const developments = await getDevelopments()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Emprendimientos Inmobiliarios
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Descubre los desarrollos inmobiliarios más innovadores de Catamarca. 
              Desde complejos residenciales hasta barrios cerrados de lujo.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-400">3</div>
                <div className="text-gray-300">Emprendimientos Activos</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-400">150+</div>
                <div className="text-gray-300">Unidades Disponibles</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-400">5</div>
                <div className="text-gray-300">Años de Experiencia</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        {developments.length > 0 ? (
          <>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Nuestros Emprendimientos
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Cada emprendimiento está diseñado pensando en tu calidad de vida y 
                representa una excelente oportunidad de inversión.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {developments.map((development) => (
                <Suspense 
                  key={development.id} 
                  fallback={
                    <div className="bg-white rounded-lg shadow-md h-96 animate-pulse">
                      <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                      <div className="p-6 space-y-3">
                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-20 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  }
                >
                  <DevelopmentCard development={development} />
                </Suspense>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Próximamente
              </h3>
              <p className="text-gray-600 mb-6">
                Estamos trabajando en nuevos emprendimientos que estarán disponibles pronto.
              </p>
              <a 
                href="/contacto" 
                className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Mantente Informado
              </a>
            </div>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">
              ¿Buscas Invertir en el Futuro?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Nuestros emprendimientos ofrecen la combinación perfecta de ubicación, 
              diseño y rentabilidad para tu inversión.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/contacto" 
                className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Solicitar Información
              </a>
              <a 
                href="/propiedades" 
                className="inline-flex items-center justify-center px-8 py-3 border border-white text-white rounded-lg hover:bg-white hover:text-gray-900 transition-colors"
              >
                Ver Propiedades
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
