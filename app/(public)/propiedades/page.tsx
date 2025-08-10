import { Suspense } from 'react'
import { Metadata } from 'next'
import { PropertyGrid } from '@/components/properties/PropertyGrid'
import { FiltersBar } from '@/components/properties/FiltersBar'

export const metadata: Metadata = {
  title: 'Propiedades en Venta y Alquiler - Catamarca',
  description: 'Encuentra las mejores propiedades en Catamarca. Casas, departamentos, lotes y locales comerciales.',
  openGraph: {
    title: 'Propiedades - Inmobiliaria Catamarca',
    description: 'Explora nuestra amplia selección de propiedades en Catamarca',
    type: 'website'
  }
}

interface PropertiesPageProps {
  searchParams: {
    operation?: string
    type?: string
    city?: string
    maxPrice?: string
    rooms?: string
    bathrooms?: string
    featured?: string
    sort?: string
    page?: string
  }
}

export default function PropertiesPage({ searchParams }: PropertiesPageProps) {
  const filters = {
    operation: searchParams.operation as 'venta' | 'alquiler' | 'temporal' | undefined,
    type: searchParams.type as 'casa' | 'departamento' | 'ph' | 'lote' | 'local' | undefined,
    city: searchParams.city,
    maxPrice: searchParams.maxPrice ? parseFloat(searchParams.maxPrice) : undefined,
    rooms: searchParams.rooms ? parseInt(searchParams.rooms) : undefined,
    bathrooms: searchParams.bathrooms ? parseInt(searchParams.bathrooms) : undefined,
    featured: searchParams.featured === 'true',
    sort: searchParams.sort as 'recent' | 'price-asc' | 'price-desc' | undefined,
    page: searchParams.page ? parseInt(searchParams.page) : 1
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
