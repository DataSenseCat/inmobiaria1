import { Suspense } from 'react'
import { useSearchParams } from 'react-router-dom'
import PropertyGrid from '../components/properties/PropertyGrid'
import FiltersBar from '../components/properties/FiltersBar'

export default function PropertiesPage() {
  const searchParams = useSearchParams()
  
  const filters = {
    operation: searchParams.get('operation') as 'venta' | 'alquiler' | 'temporal' | undefined,
    type: searchParams.get('type') as 'casa' | 'departamento' | 'ph' | 'lote' | 'local' | undefined,
    city: searchParams.get('city') || undefined,
    maxPrice: searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined,
    rooms: searchParams.get('rooms') ? parseInt(searchParams.get('rooms')!) : undefined,
    bathrooms: searchParams.get('bathrooms') ? parseInt(searchParams.get('bathrooms')!) : undefined,
    featured: searchParams.get('featured') === 'true',
    sort: searchParams.get('sort') as 'recent' | 'price-asc' | 'price-desc' | undefined,
    page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Propiedades
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Descubre nuestra amplia selección de propiedades en Catamarca. 
            Desde casas familiares hasta lotes para inversión, encuentra la propiedad perfecta para ti.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <Suspense fallback={<div>Cargando filtros...</div>}>
            <FiltersBar initialFilters={filters} />
          </Suspense>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
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
          <PropertyGrid 
            filters={filters}
            showFeatured={filters.featured}
            pageSize={12}
          />
        </Suspense>
      </div>
    </div>
  )
}
