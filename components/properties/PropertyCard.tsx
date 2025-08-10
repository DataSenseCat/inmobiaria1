'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, MapPin, BedDouble, Bath, Maximize, MessageCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { cn, formatPrice, formatArea, getWhatsAppUrl } from '@/lib/utils'
import { Property } from '@/lib/supabase/types'
import { createClient } from '@/lib/supabase/client'

interface PropertyCardProps {
  propertyId?: string
  property?: Property
  showPrice?: boolean
  showAmenities?: boolean
  showWhatsAppButton?: boolean
  showFavoriteButton?: boolean
  imageHeight?: 'h-48' | 'h-56' | 'h-64' | 'h-72'
  className?: string
}

export default function PropertyCard({
  propertyId,
  property: initialProperty,
  showPrice = true,
  showAmenities = true,
  showWhatsAppButton = true,
  showFavoriteButton = true,
  imageHeight = 'h-64',
  className
}: PropertyCardProps) {
  const [property, setProperty] = useState<Property | null>(initialProperty || null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(!initialProperty)
  const supabase = createClient()

  useEffect(() => {
    if (propertyId && !initialProperty) {
      fetchProperty()
    }
  }, [propertyId, initialProperty])

  const fetchProperty = async () => {
    if (!propertyId) return

    try {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          images (id, url, alt),
          agent:agents (id, name, phone, email)
        `)
        .eq('id', propertyId)
        .single()

      if (error) throw error
      setProperty(data)
    } catch (error) {
      console.error('Error fetching property:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleFavorite = async () => {
    if (!property) return

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        // Redirect to login or show login modal
        window.location.href = '/auth/sign-in'
        return
      }

      if (isFavorite) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('property_id', property.id)
      } else {
        await supabase
          .from('favorites')
          .insert({ user_id: user.id, property_id: property.id })
      }

      setIsFavorite(!isFavorite)
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  const handleWhatsApp = () => {
    if (!property?.agent) return

    const message = `Hola! Me interesa la propiedad "${property.title}" que vi en su sitio web. ¿Podría darme más información?`
    const url = getWhatsAppUrl(property.agent.phone || '', message)
    window.open(url, '_blank')
  }

  if (loading) {
    return (
      <Card className={cn('overflow-hidden animate-pulse', className)}>
        <div className={cn('bg-muted', imageHeight)} />
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-3 bg-muted rounded w-1/2" />
            <div className="h-3 bg-muted rounded w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!property) {
    return (
      <Card className={cn('overflow-hidden', className)}>
        <CardContent className="p-4 text-center text-muted-foreground">
          Propiedad no encontrada
        </CardContent>
      </Card>
    )
  }

  const mainImage = property.images?.[0]
  const operationLabel = property.operation === 'venta' ? 'Venta' : 'Alquiler'
  const typeLabel = {
    casa: 'Casa',
    departamento: 'Departamento',
    ph: 'PH',
    lote: 'Lote',
    local: 'Local'
  }[property.type]

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      <Card className="overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="relative">
          <div className={cn('relative overflow-hidden', imageHeight)}>
            {mainImage ? (
              <Image
                src={mainImage.url}
                alt={mainImage.alt || property.title}
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <Maximize className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Property badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
              {operationLabel}
            </span>
            {property.featured && (
              <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                Destacada
              </span>
            )}
          </div>

          {/* Favorite button */}
          {showFavoriteButton && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 bg-white/80 hover:bg-white rounded-full"
              onClick={toggleFavorite}
            >
              <Heart
                className={cn(
                  'h-4 w-4',
                  isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
                )}
              />
            </Button>
          )}
        </div>

        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Title and location */}
            <div>
              <h3 className="font-semibold text-lg line-clamp-2 mb-1">
                {property.title}
              </h3>
              {property.address && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="line-clamp-1">{property.address}</span>
                </div>
              )}
            </div>

            {/* Price */}
            {showPrice && (
              <div className="space-y-1">
                {property.price_usd && (
                  <p className="text-xl font-bold text-primary">
                    {formatPrice(property.price_usd, 'USD')}
                  </p>
                )}
                {property.price_ars && (
                  <p className="text-sm text-muted-foreground">
                    {formatPrice(property.price_ars, 'ARS')}
                  </p>
                )}
              </div>
            )}

            {/* Property details */}
            {showAmenities && (
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                {property.rooms && (
                  <div className="flex items-center gap-1">
                    <BedDouble className="h-4 w-4" />
                    <span>{property.rooms}</span>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center gap-1">
                    <Bath className="h-4 w-4" />
                    <span>{property.bathrooms}</span>
                  </div>
                )}
                {property.area_covered && (
                  <div className="flex items-center gap-1">
                    <Maximize className="h-4 w-4" />
                    <span>{formatArea(property.area_covered)}</span>
                  </div>
                )}
              </div>
            )}

            {/* Type badge */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                {typeLabel}
              </span>
              {property.city && (
                <span className="text-xs text-muted-foreground">
                  {property.city}
                </span>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex gap-2">
          <Button asChild className="flex-1">
            <Link href={`/propiedad/${property.id}`}>
              Ver Detalles
            </Link>
          </Button>
          
          {showWhatsAppButton && property.agent?.phone && (
            <Button
              variant="outline"
              size="icon"
              onClick={handleWhatsApp}
              className="text-green-600 hover:text-green-700 hover:bg-green-50"
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  )
}
