import { Metadata } from 'next'
import { RenderBuilderContent } from '@/components/builder/RenderBuilderContent'
import { builder } from '@builder.io/react'
import { Award, Users, MapPin, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sobre Nosotros - Inmobiliaria Catamarca',
  description: 'Conoce nuestra historia, valores y equipo. Más de 15 años conectando personas con sus hogares ideales en Catamarca.',
  openGraph: {
    title: 'La Empresa - Inmobiliaria Catamarca',
    description: 'Conoce nuestra trayectoria y compromiso con el mercado inmobiliario catamarqueño',
    type: 'website'
  }
}

async function getBuilderContent() {
  try {
    const content = await builder
      .get('page', {
        userAttributes: {
          urlPath: '/la-empresa'
        }
      })
      .toPromise()
    
    return content
  } catch (error) {
    console.error('Error loading Builder content:', error)
    return null
  }
}

export default async function LaEmpresaPage() {
  const builderContent = await getBuilderContent()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Inmobiliaria Catamarca
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Más de 15 años conectando personas con sus hogares ideales en 
              el corazón de Argentina. Tu sueño, nuestra misión.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">15+</div>
              <div className="text-gray-600">Años de Experiencia</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
              <div className="text-gray-600">Operaciones Realizadas</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">50+</div>
              <div className="text-gray-600">Propiedades Activas</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-gray-600">Atención al Cliente</div>
            </div>
          </div>
        </div>
      </div>

      {/* Builder.io Content */}
      {builderContent && (
        <div className="py-8">
          <RenderBuilderContent content={builderContent} />
        </div>
      )}

      {/* Default Content if Builder.io is not available */}
      {!builderContent && (
        <>
          {/* Mission & Vision */}
          <div className="container mx-auto px-4 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Nuestra Misión</h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  Facilitar el encuentro entre personas y propiedades, brindando un servicio 
                  integral, transparente y personalizado que supere las expectativas de 
                  nuestros clientes.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Creemos que cada propiedad tiene su persona ideal, y cada persona merece 
                  encontrar el lugar perfecto para construir su futuro. Por eso trabajamos 
                  con dedicación, honestidad y profesionalismo en cada operación.
                </p>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Nuestra Visión</h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  Ser la inmobiliaria de referencia en Catamarca, reconocida por nuestra 
                  excelencia en el servicio, innovación tecnológica y compromiso con el 
                  desarrollo de la comunidad.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Aspiramos a contribuir al crecimiento ordenado y sustentable de nuestra 
                  provincia, promoviendo inversiones responsables y generando valor para 
                  todos los actores del mercado inmobiliario.
                </p>
              </div>
            </div>
          </div>

          {/* Values */}
          <div className="bg-gray-100">
            <div className="container mx-auto px-4 py-16">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Nuestros Valores</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Los principios que guían nuestro trabajo diario y definen nuestra forma 
                  de hacer negocios.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="bg-white rounded-lg p-6 text-center shadow-md">
                  <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Award className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Excelencia</h3>
                  <p className="text-gray-600 text-sm">
                    Buscamos la mejora continua en todos nuestros procesos y servicios.
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-6 text-center shadow-md">
                  <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Compromiso</h3>
                  <p className="text-gray-600 text-sm">
                    Nos involucramos personalmente en cada proyecto y cada cliente.
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-6 text-center shadow-md">
                  <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <MapPin className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Transparencia</h3>
                  <p className="text-gray-600 text-sm">
                    Comunicación clara y honesta en todas nuestras relaciones comerciales.
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-6 text-center shadow-md">
                  <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-8 w-8 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Agilidad</h3>
                  <p className="text-gray-600 text-sm">
                    Respuestas rápidas y gestiones eficientes para optimizar los tiempos.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Team */}
          <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Nuestro Equipo</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Profesionales especializados en diferentes áreas del mercado inmobiliario, 
                unidos por la pasión de ayudar a las personas a encontrar su lugar ideal.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg p-6 text-center shadow-md">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">María González</h3>
                <p className="text-blue-600 text-sm mb-3">Directora Comercial</p>
                <p className="text-gray-600 text-sm">
                  Especialista en propiedades residenciales con más de 10 años de experiencia.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 text-center shadow-md">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Carlos Rodríguez</h3>
                <p className="text-blue-600 text-sm mb-3">Tasador Oficial</p>
                <p className="text-gray-600 text-sm">
                  Martillero público especializado en tasaciones y emprendimientos.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 text-center shadow-md">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Ana Fernández</h3>
                <p className="text-blue-600 text-sm mb-3">Atención al Cliente</p>
                <p className="text-gray-600 text-sm">
                  Responsable de brindar la mejor experiencia a cada uno de nuestros clientes.
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* CTA Section */}
      <div className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">
              ¿Querés formar parte de nuestra historia?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Ya sea que busques comprar, vender, alquilar o invertir, estamos aquí 
              para acompañarte en cada paso del camino.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/contacto" 
                className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Contactanos
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
