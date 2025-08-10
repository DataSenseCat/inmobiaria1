'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import PropertyCard from '@/components/properties/PropertyCard'
import { getFavorites } from '@/app/actions/favorites'
import { Property } from '@/lib/supabase/types'

type FavoriteWithProperty = {
  property_id: string
  property: Property
}

export default function FavoritesList() {
  const [favorites, setFavorites] = useState<FavoriteWithProperty[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchFavorites()
  }, [])

  const fetchFavorites = async () => {
    try {
      const result = await getFavorites()
      
      if (result.success) {
        setFavorites(result.data || [])
      } else {
        setError(result.error || 'Error al cargar favoritos')
      }
    } catch (error) {
      console.error('Error fetching favorites:', error)
      setError('Error al cargar favoritos')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
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
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">❌</div>
        <h3 className="text-xl font-semibold mb-2">Error</h3>
        <p className="text-muted-foreground">{error}</p>
      </div>
    )
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">❤️</div>
        <h3 className="text-xl font-semibold mb-2">No tienes favoritos guardados</h3>
        <p className="text-muted-foreground mb-6">
          Explora propiedades y agrega las que más te gusten a tus favoritos.
        </p>
        <motion.a
          href="/"
          className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Ver Propiedades
        </motion.a>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Heart className="h-5 w-5 fill-current text-red-500" />
        <span>{favorites.length} {favorites.length === 1 ? 'propiedad favorita' : 'propiedades favoritas'}</span>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {favorites.map((favorite, index) => (
          <motion.div
            key={favorite.property_id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <PropertyCard
              property={favorite.property}
              showFavoriteButton={true}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
