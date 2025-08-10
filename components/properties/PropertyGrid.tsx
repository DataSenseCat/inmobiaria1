'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import PropertyCard from './PropertyCard'
import { Property } from '@/lib/supabase/types'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

interface PropertyGridProps {
  operation?: 'venta' | 'alquiler' | ''
  type?: 'casa' | 'departamento' | 'ph' | 'lote' | 'local' | ''
  city?: string
  maxUsd?: number
  featuredOnly?: boolean
  pageSize?: number
  title?: string
  className?: string
}

export default function PropertyGrid({
  operation = '',
  type = '',
  city = '',
  maxUsd,
  featuredOnly = false,
  pageSize = 12,
  title = 'Propiedades Disponibles',
  className
}: PropertyGridProps) {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    setPage(0)
    setProperties([])
    setHasMore(true)
    fetchProperties(0, true)
  }, [operation, type, city, maxUsd, featuredOnly, pageSize])

  const fetchProperties = async (currentPage: number, reset = false) => {
    try {
      setError(null) // Clear any previous errors
      
      if (reset) {
        setLoading(true)
      } else {
        setLoadingMore(true)
      }

      // Debug: Check if supabase client is properly initialized
      console.log('Fetching properties...')

      let query = supabase
        .from('properties')
        .select(`
          *,
          images (id, url, alt),
          agent:agents (id, name, phone, email)
        `)
        .order('created_at', { ascending: false })
        .range(currentPage * pageSize, (currentPage + 1) * pageSize - 1)

      // Apply filters
      if (operation) {
        query = query.eq('operation', operation)
      }

      if (type) {
        query = query.eq('type', type)
      }

      if (city) {
        query = query.ilike('city', `%${city}%`)
      }

      if (maxUsd) {
        query = query.lte('price_usd', maxUsd)
      }

      if (featuredOnly) {
        query = query.eq('featured', true)
      }

      const { data, error } = await query

      if (error) throw error

      if (reset) {
        setProperties(data || [])
      } else {
        setProperties(prev => [...prev, ...(data || [])])
      }

      // Check if there are more properties
      setHasMore((data?.length || 0) === pageSize)
      
    } catch (error) {
      console.error('Error fetching properties:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      
      let errorMessage = 'Error al cargar propiedades'
      if (error instanceof Error) {
        console.error('Error message:', error.message)
        console.error('Error stack:', error.stack)
        errorMessage = error.message
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchProperties(nextPage)
  }

  if (loading) {
    return (
      <div className={cn('space-y-6', className)}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">{title}</h2>
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: pageSize }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-muted rounded-2xl h-64 mb-4" />
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
                <div className="h-3 bg-muted rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={cn('', className)}>
      {/* Title */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">{title}</h2>
        {properties.length > 0 && (
          <p className="text-gray-600">
            {properties.length} {properties.length === 1 ? 'propiedad encontrada' : 'propiedades encontradas'}
          </p>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="text-center py-12 max-w-2xl mx-auto">
          <div className="text-6xl mb-4">🗄️</div>
          <h3 className="text-2xl font-semibold mb-4 text-blue-600">Base de Datos No Configurada</h3>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6 text-left">
            <h4 className="font-semibold text-blue-800 mb-3">�� ¡Tu aplicación está lista!</h4>
            <p className="text-blue-700 mb-4">
              Solo necesitas crear las tablas en Supabase para ver las propiedades.
            </p>

            <div className="bg-white rounded p-4 mb-4">
              <h5 className="font-medium mb-2">📋 Pasos para activar:</h5>
              <ol className="text-sm space-y-2 text-gray-700">
                <li><strong>1.</strong> Ir a <a href="https://app.supabase.com" target="_blank" className="text-blue-600 hover:underline">app.supabase.com</a></li>
                <li><strong>2.</strong> Abrir "SQL Editor"</li>
                <li><strong>3.</strong> Ejecutar el archivo <code className="bg-gray-100 px-1 rounded">supabase/migrations/000_init.sql</code></li>
                <li><strong>4.</strong> ¡Listo! Las propiedades aparecerán automáticamente</li>
              </ol>
            </div>

            <div className="text-xs text-blue-600 bg-blue-100 p-2 rounded">
              <strong>Error técnico:</strong> {error.includes('PGRST205') ? 'Tabla "properties" no encontrada' : error}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => window.location.href = '/configurar-db'}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              📋 Guía Completa
            </button>

            <button
              onClick={() => {
                setPage(0)
                setProperties([])
                setHasMore(true)
                fetchProperties(0, true)
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              🔄 Verificar Conexión
            </button>

            <button
              onClick={() => window.open('/init-database.sql', '_blank')}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              📄 Ver Script SQL
            </button>
          </div>
        </div>
      )}

      {/* Properties Grid */}
      {!error && (
        properties.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏠</div>
            <h3 className="text-xl font-semibold mb-2">No hay propiedades disponibles</h3>
            <p className="text-muted-foreground mb-6">
              No se encontraron propiedades que coincidan con los filtros seleccionados.
            </p>

            {/* Preview de propiedades cuando la DB no está configurada */}
            <div className="mt-8">
              <h4 className="text-lg font-semibold mb-4 text-gray-600">
                Vista previa de propiedades de ejemplo:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {[
                  { title: "Casa en Barrio Norte", price: "USD 120,000", type: "Casa", operation: "Venta" },
                  { title: "Departamento Céntrico", price: "ARS 180,000", type: "Departamento", operation: "Alquiler" },
                  { title: "PH en Barrio Jardín", price: "USD 85,000", type: "PH", operation: "Venta" }
                ].map((prop, idx) => (
                  <div key={idx} className="bg-white rounded-lg shadow-md p-4 opacity-60">
                    <div className="h-32 bg-gray-200 rounded mb-3 flex items-center justify-center">
                      <span className="text-3xl">🏠</span>
                    </div>
                    <h5 className="font-semibold text-sm mb-2">{prop.title}</h5>
                    <p className="text-blue-600 font-bold text-sm mb-2">{prop.price}</p>
                    <div className="flex justify-between text-xs">
                      <span className="bg-gray-100 px-2 py-1 rounded">{prop.type}</span>
                      <span className="text-gray-500">{prop.operation}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-4">
                * Estas propiedades aparecerán reales después de configurar la base de datos
              </p>
            </div>
          </div>
        ) : (
          <>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {properties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <PropertyCard property={property} />
                </motion.div>
              ))}
            </motion.div>

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center">
                <Button
                  onClick={loadMore}
                  disabled={loadingMore}
                  variant="outline"
                  size="lg"
                  className="rounded-full"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Cargando...
                    </>
                  ) : (
                    'Cargar Más Propiedades'
                  )}
                </Button>
              </div>
            )}
          </>
        )
      )}
    </div>
  )
}
