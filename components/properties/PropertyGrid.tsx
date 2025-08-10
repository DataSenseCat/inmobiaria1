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
  const supabase = createClient()

  useEffect(() => {
    setPage(0)
    setProperties([])
    setHasMore(true)
    fetchProperties(0, true)
  }, [operation, type, city, maxUsd, featuredOnly, pageSize])

  const fetchProperties = async (currentPage: number, reset = false) => {
    try {
      if (reset) {
        setLoading(true)
      } else {
        setLoadingMore(true)
      }

      // Debug: Check if supabase client is properly initialized
      console.log('Supabase client:', supabase)
      console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)

      // Test basic connection
      try {
        const { data: testData, error: testError } = await supabase
          .from('properties')
          .select('id')
          .limit(1)

        console.log('Test query result:', { testData, testError })
      } catch (testErr) {
        console.error('Test query failed:', testErr)
      }

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
      if (error instanceof Error) {
        console.error('Error message:', error.message)
        console.error('Error stack:', error.stack)
      }
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
    <div className={cn('space-y-6', className)}>
      {/* Title */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">{title}</h2>
        {properties.length > 0 && (
          <p className="text-muted-foreground">
            {properties.length} {properties.length === 1 ? 'propiedad encontrada' : 'propiedades encontradas'}
          </p>
        )}
      </div>

      {/* Properties Grid */}
      {properties.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏠</div>
          <h3 className="text-xl font-semibold mb-2">No hay propiedades disponibles</h3>
          <p className="text-muted-foreground">
            No se encontraron propiedades que coincidan con los filtros seleccionados.
          </p>
        </div>
      ) : (
        <>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
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
      )}
    </div>
  )
}
