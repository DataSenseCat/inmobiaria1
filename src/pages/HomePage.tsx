import HeroSection from '../components/layout/HeroSection'
import PropertyGrid from '../components/properties/PropertyGrid'
import SimpleConnectionTest from '../components/SimpleConnectionTest'
import { Suspense } from 'react'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Properties */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Propiedades Destacadas
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Descubre nuestra selección de propiedades destacadas en las mejores
              ubicaciones de Catamarca
            </p>
          </div>

          <Suspense fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md h-96 animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          }>
            <PropertyGrid showFeatured={true} pageSize={6} />
          </Suspense>

          <div className="text-center mt-12">
            <a
              href="/propiedades"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ver Todas las Propiedades
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                ¿Por qué elegir Inmobiliaria Catamarca?
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Más de 15 años de experiencia</h3>
                    <p className="text-gray-600">Conocemos el mercado inmobiliario catamarqueño como nadie</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Atención personalizada</h3>
                    <p className="text-gray-600">Te acompañamos en cada paso del proceso de compra o venta</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Tasaciones gratuitas</h3>
                    <p className="text-gray-600">Conoce el valor real de tu propiedad sin costo alguno</p>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <a
                  href="/la-empresa"
                  className="inline-block border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
                >
                  Conoce Más Sobre Nosotros
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Imagen de la empresa</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
