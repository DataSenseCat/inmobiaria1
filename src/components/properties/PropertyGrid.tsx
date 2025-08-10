import { useState, useEffect } from 'react'
import { supabase, testConnection } from '@/lib/supabase/client'
import PropertyCard from './PropertyCard'
import { Property } from '@/lib/supabase/types'
import { logError, handleSupabaseError } from '@/lib/utils/errorUtils'
import { Loader2, AlertCircle } from 'lucide-react'

interface PropertyGridProps {
  showFeatured?: boolean
  pageSize?: number
  filters?: {
    operation?: 'venta' | 'alquiler' | 'temporal'
    type?: 'casa' | 'departamento' | 'ph' | 'lote' | 'local'
    city?: string
    maxPrice?: number
    rooms?: number
    bathrooms?: number
    featured?: boolean
    sort?: 'recent' | 'price-asc' | 'price-desc'
    page?: number
    search?: string
  }
}

export default function PropertyGrid({ 
  showFeatured = false, 
  pageSize = 12, 
  filters = {} 
}: PropertyGridProps) {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    fetchProperties()
  }, [filters, showFeatured, pageSize])

  const fetchProperties = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('🔍 PropertyGrid fetchProperties called with:', { showFeatured, pageSize, filters })

      // Test connection first
      const connectionTest = await testConnection()
      if (!connectionTest.success) {
        // If connection fails, use sample data immediately
        console.warn('Using sample data due to connection failure:', connectionTest.error)
        setProperties(getSampleProperties())
        setError('Base de datos no disponible. Mostrando propiedades de ejemplo.')
        return
      }

      let query = supabase
        .from('properties')
        .select(`
          *,
          images (
            id,
            url,
            alt,
            order_index
          ),
          agents (
            name,
            phone,
            email
          )
        `)
        .eq('active', true)

      // Apply filters
      if (showFeatured || filters.featured) {
        query = query.eq('featured', true)
      }

      if (filters.operation) {
        query = query.eq('operation', filters.operation)
      }

      if (filters.type) {
        query = query.eq('type', filters.type)
      }

      if (filters.city) {
        query = query.ilike('city', `%${filters.city}%`)
      }

      if (filters.maxPrice) {
        query = query.lte('price_usd', filters.maxPrice)
      }

      if (filters.rooms) {
        query = query.gte('rooms', filters.rooms)
      }

      if (filters.bathrooms) {
        query = query.gte('bathrooms', filters.bathrooms)
      }

      if (filters.search) {
        query = query.or(
          `title.ilike.%${filters.search}%,address.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
        )
      }

      // Apply sorting
      switch (filters.sort) {
        case 'price-asc':
          query = query.order('price_usd', { ascending: true })
          break
        case 'price-desc':
          query = query.order('price_usd', { ascending: false })
          break
        default:
          query = query.order('created_at', { ascending: false })
      }

      // Apply pagination
      const from = ((filters.page || 1) - 1) * pageSize
      const to = from + pageSize - 1
      query = query.range(from, to)

      console.log('🔍 About to execute Supabase query for properties...')
      const { data, error: fetchError } = await query
      console.log('🔍 Query result:', { data: data?.length, error: fetchError, rawData: data?.[0] })

      if (fetchError) {
        const errorMessage = handleSupabaseError(fetchError, 'Error en consulta de propiedades')

        // Check if it's a table not found error
        if (fetchError.code === 'PGRST116' || fetchError.message.includes('relation') || fetchError.message.includes('does not exist')) {
          console.warn('Database tables not found, using sample data')
          setProperties(getSampleProperties())
          setError('Tablas de la base de datos no encontradas. Mostrando propiedades de ejemplo.')
          return
        }

        throw new Error(errorMessage)
      }

      console.log('Properties fetched successfully:', data?.length || 0)

      // Transform database data to match Property interface
      const transformedProperties = (data || []).map((property: any) => ({
        ...property,
        price_usd: property.price_usd ? Number(property.price_usd) : undefined,
        price_ars: property.price_ars ? Number(property.price_ars) : undefined,
        // Ensure images is always an array (it should be from the join)
        images: Array.isArray(property.images) ? property.images : (property.images ? [property.images] : [])
      }))

      console.log('🔍 Transformed properties:', transformedProperties[0])
      setProperties(transformedProperties)
      setHasMore((data?.length || 0) === pageSize)
    } catch (err) {
      const errorLog = logError(err, 'PropertyGrid.fetchProperties')
      setError(`Error al conectar con la base de datos: ${errorLog.message}. Mostrando datos de ejemplo.`)

      // Show sample data if there's an error
      setProperties(getSampleProperties())
    } finally {
      setLoading(false)
    }
  }

  // Sample data for when Supabase is not connected or has issues
  const getSampleProperties = (): Property[] => [
    {
      id: '1',
      title: 'Casa en Barrio Norte',
      description: 'Hermosa casa de 3 dormitorios con jardín, garage y parrilla. Ubicada en zona tranquila y residencial.',
      address: 'Av. Belgrano 1250',
      city: 'San Fernando del Valle de Catamarca',
      type: 'casa',
      operation: 'venta',
      price_usd: 120000,
      price_ars: 100000000,
      rooms: 3,
      bathrooms: 2,
      area_covered: 120,
      area_total: 300,
      featured: true,
      active: true,
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z',
      images: [
        {
          id: '1',
          property_id: '1',
          url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop',
          alt: 'Casa en Barrio Norte',
          order_index: 0,
          created_at: '2024-01-15T10:00:00Z'
        }
      ]
    },
    {
      id: '2',
      title: 'Departamento Céntrico',
      description: 'Moderno departamento de 2 ambientes en el corazón de la ciudad. Ideal para inversión.',
      address: 'Sarmiento 450',
      city: 'San Fernando del Valle de Catamarca',
      type: 'departamento',
      operation: 'alquiler',
      price_usd: 800,
      price_ars: 650000,
      rooms: 2,
      bathrooms: 1,
      area_covered: 55,
      area_total: 55,
      featured: true,
      active: true,
      created_at: '2024-01-14T09:00:00Z',
      updated_at: '2024-01-14T09:00:00Z',
      images: [
        {
          id: '2',
          property_id: '2',
          url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
          alt: 'Departamento Céntrico',
          order_index: 0,
          created_at: '2024-01-14T09:00:00Z'
        }
      ]
    },
    {
      id: '3',
      title: 'Lote en Zona Residencial',
      description: 'Excelente lote de 600m² en barrio consolidado. Ideal para construir la casa de tus sueños.',
      address: 'Barrio Villa Cubas',
      city: 'San Fernando del Valle de Catamarca',
      type: 'lote',
      operation: 'venta',
      price_usd: 35000,
      price_ars: 29000000,
      area_total: 600,
      featured: false,
      active: true,
      created_at: '2024-01-13T08:00:00Z',
      updated_at: '2024-01-13T08:00:00Z',
      images: [
        {
          id: '3',
          property_id: '3',
          url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop',
          alt: 'Lote en Zona Residencial',
          order_index: 0,
          created_at: '2024-01-13T08:00:00Z'
        }
      ]
    },
    {
      id: '4',
      title: 'PH con Terraza',
      description: 'Hermoso PH de 2 plantas con terraza privada. Muy luminoso y bien ubicado.',
      address: 'San Martín 890',
      city: 'San Fernando del Valle de Catamarca',
      type: 'ph',
      operation: 'venta',
      price_usd: 95000,
      price_ars: 78000000,
      rooms: 3,
      bathrooms: 2,
      area_covered: 85,
      area_total: 120,
      featured: true,
      active: true,
      created_at: '2024-01-12T07:00:00Z',
      updated_at: '2024-01-12T07:00:00Z',
      images: [
        {
          id: '4',
          property_id: '4',
          url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop',
          alt: 'PH con Terraza',
          order_index: 0,
          created_at: '2024-01-12T07:00:00Z'
        }
      ]
    },
    {
      id: '5',
      title: 'Local Comercial Centro',
      description: 'Amplio local comercial en zona comercial. Ideal para cualquier tipo de negocio.',
      address: 'Rivadavia 340',
      city: 'San Fernando del Valle de Catamarca',
      type: 'local',
      operation: 'alquiler',
      price_usd: 1200,
      price_ars: 980000,
      area_covered: 80,
      area_total: 80,
      featured: false,
      active: true,
      created_at: '2024-01-11T06:00:00Z',
      updated_at: '2024-01-11T06:00:00Z',
      images: [
        {
          id: '5',
          property_id: '5',
          url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
          alt: 'Local Comercial Centro',
          order_index: 0,
          created_at: '2024-01-11T06:00:00Z'
        }
      ]
    },
    {
      id: '6',
      title: 'Casa Quinta en Andalgalá',
      description: 'Hermosa casa quinta con pileta y parque. Perfecta para descanso y recreación.',
      address: 'Ruta Provincial 46',
      city: 'Andalgalá',
      type: 'casa',
      operation: 'venta',
      price_usd: 180000,
      price_ars: 148000000,
      rooms: 4,
      bathrooms: 3,
      area_covered: 200,
      area_total: 2000,
      featured: true,
      active: true,
      created_at: '2024-01-10T05:00:00Z',
      updated_at: '2024-01-10T05:00:00Z',
      images: [
        {
          id: '6',
          property_id: '6',
          url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
          alt: 'Casa Quinta en Andalgalá',
          order_index: 0,
          created_at: '2024-01-10T05:00:00Z'
        }
      ]
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Cargando propiedades...</p>
        </div>
      </div>
    )
  }

  if (error && properties.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 mx-auto mb-4 text-orange-500" />
          <p className="text-gray-600 mb-2">No se pudieron cargar las propiedades</p>
          <p className="text-sm text-gray-500">Mostrando datos de ejemplo</p>
        </div>
      </div>
    )
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-50 rounded-lg p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No se encontraron propiedades
          </h3>
          <p className="text-gray-600 mb-4">
            No hay propiedades que coincidan con los filtros seleccionados.
          </p>
          <button
            onClick={() => window.location.href = '/propiedades'}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Ver todas las propiedades
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-orange-500 mr-2" />
            <p className="text-orange-700 text-sm">
              Hubo un problema al conectar con la base de datos. Mostrando propiedades de ejemplo.
            </p>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <PropertyCard 
            key={property.id} 
            property={property}
          />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && properties.length >= pageSize && (
        <div className="text-center">
          <button
            onClick={() => {
              const nextPage = (filters.page || 1) + 1
              const newUrl = new URL(window.location.href)
              newUrl.searchParams.set('page', nextPage.toString())
              window.location.href = newUrl.toString()
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Cargar Más Propiedades
          </button>
        </div>
      )}
    </div>
  )
}
