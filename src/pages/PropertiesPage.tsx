import { Suspense } from 'react'
import { useSearchParams } from 'react-router-dom'
import PropertyGrid from '../components/properties/PropertyGrid'
import FiltersBar from '../components/properties/FiltersBar'
import { Search, Filter, Grid, Map } from 'lucide-react'
import { Button } from '../components/ui/button'

export default function PropertiesPage() {
  const [searchParams] = useSearchParams()

  const filters = {
    operation: searchParams.get('operation') as 'venta' | 'alquiler' | 'temporal' | undefined,
    type: searchParams.get('type') as 'casa' | 'departamento' | 'ph' | 'lote' | 'local' | undefined,
    city: searchParams.get('city') || undefined,
    maxPrice: searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined,
    rooms: searchParams.get('rooms') ? parseInt(searchParams.get('rooms')!) : undefined,
    bathrooms: searchParams.get('bathrooms') ? parseInt(searchParams.get('bathrooms')!) : undefined,
    featured: searchParams.get('featured') === 'true',
    sort: searchParams.get('sort') as 'recent' | 'price-asc' | 'price-desc' | undefined,
    page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
    search: searchParams.get('search') || undefined
  }

  const hasFilters = Object.entries(filters).some(([key, value]) => 
    key !== 'page' && value !== undefined && value !== false
  )

  const getResultsText = () => {
    let text = 'Propiedades'
    
    if (filters.operation) {
      text += ` en ${filters.operation}`
    }
    
    if (filters.type) {
      const typeLabels = {
        casa: 'Casas',
        departamento: 'Departamentos', 
        ph: 'PHs',
        lote: 'Lotes',
        local: 'Locales'
      }
      text = typeLabels[filters.type] || text
    }
    
    if (filters.city) {
      text += ` en ${filters.city}`
    }
    
    return text
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {getResultsText()}
              </h1>
              <p className="text-gray-600 max-w-2xl">
                {hasFilters 
                  ? 'Resultados filtrados de nuestra selección de propiedades en Catamarca.'
                  : 'Descubre nuestra amplia selección de propiedades en Catamarca. Desde casas familiares hasta lotes para inversión, encuentra la propiedad perfecta para ti.'
                }
              </p>
            </div>
            
            {/* View Toggle (Future: Map/Grid view) */}
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="bg-blue-50 border-blue-200">
                <Grid className="w-4 h-4 mr-2" />
                Grilla
              </Button>
              <Button variant="outline" size="sm" disabled>
                <Map className="w-4 h-4 mr-2" />
                Mapa
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <FiltersBar orientation="horizontal" />
        </div>
      </div>

      {/* Results Summary */}
      {hasFilters && (
        <div className="bg-blue-50 border-b">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-blue-800">
                <Filter className="w-4 h-4 mr-2" />
                <span>Filtros activos aplicados</span>
              </div>
              <Button 
                variant="link" 
                size="sm"
                onClick={() => window.location.href = '/propiedades'}
                className="text-blue-600 hover:text-blue-700"
              >
                Ver todas las propiedades
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={
          <div className="space-y-6">
            {/* Loading skeleton */}
            <div className="flex items-center justify-between">
              <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    <div className="flex space-x-2 pt-2">
                      <div className="h-8 bg-gray-200 rounded flex-1"></div>
                      <div className="h-8 bg-gray-200 rounded flex-1"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        }>
          <PropertyGrid 
            filters={filters}
            showFeatured={filters.featured}
            pageSize={12}
          />
        </Suspense>
      </div>

      {/* Quick Actions Footer */}
      <div className="bg-white border-t">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">¿No encontrás lo que buscás?</h3>
              <p className="text-gray-600 text-sm">
                Contáctanos y te ayudamos a encontrar la propiedad ideal
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.location.href = '/contacto'}
              >
                Contactar Asesor
              </Button>
            </div>
            
            <div className="space-y-2">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-green-600 font-bold text-lg">$</span>
              </div>
              <h3 className="font-semibold text-gray-900">Tasación Gratuita</h3>
              <p className="text-gray-600 text-sm">
                Conocé el valor real de tu propiedad sin costo
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.location.href = '/tasaciones'}
              >
                Solicitar Tasación
              </Button>
            </div>
            
            <div className="space-y-2">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-purple-600 font-bold text-lg">🏗️</span>
              </div>
              <h3 className="font-semibold text-gray-900">Emprendimientos</h3>
              <p className="text-gray-600 text-sm">
                Conocé los desarrollos inmobiliarios en construcción
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.location.href = '/emprendimientos'}
              >
                Ver Emprendimientos
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
