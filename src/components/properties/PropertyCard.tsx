import { useState } from 'react'
import { Property } from '@/lib/supabase/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Heart, 
  Phone, 
  Mail,
  Eye,
  Star
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface PropertyCardProps {
  property: Property
  className?: string
  showAgent?: boolean
  onFavorite?: (propertyId: string) => void
  isFavorite?: boolean
}

export default function PropertyCard({ 
  property, 
  className,
  showAgent = true,
  onFavorite,
  isFavorite = false
}: PropertyCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [imageError, setImageError] = useState(false)

  const formatPrice = (priceUsd?: number, priceArs?: number, operation?: string) => {
    if (priceUsd) {
      const currency = operation === 'venta' ? 'USD' : 'USD/mes'
      return `${currency} ${priceUsd.toLocaleString()}`
    }
    if (priceArs) {
      const currency = operation === 'venta' ? 'ARS' : 'ARS/mes'
      return `${currency} ${priceArs.toLocaleString()}`
    }
    return 'Consultar precio'
  }

  const getTypeLabel = (type: string) => {
    const types = {
      casa: 'Casa',
      departamento: 'Departamento',
      ph: 'PH',
      lote: 'Lote',
      local: 'Local'
    }
    return types[type as keyof typeof types] || type
  }

  const getOperationLabel = (operation: string) => {
    const operations = {
      venta: 'Venta',
      alquiler: 'Alquiler',
      temporal: 'Temporal'
    }
    return operations[operation as keyof typeof operations] || operation
  }

  const getOperationColor = (operation: string) => {
    const colors = {
      venta: 'bg-green-100 text-green-800',
      alquiler: 'bg-blue-100 text-blue-800',
      temporal: 'bg-purple-100 text-purple-800'
    }
    return colors[operation as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const images = property.images || []
  const mainImage = images[currentImageIndex]
  const fallbackImage = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop'

  const handleImageError = () => {
    setImageError(true)
  }

  const nextImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }
  }

  const prevImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
    }
  }

  const handleContact = () => {
    const message = `Hola, me interesa la propiedad "${property.title}" en ${property.address}, ${property.city}. ¿Podrían darme más información?`
    const whatsappUrl = property.agents?.phone 
      ? `https://wa.me/${property.agents.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
      : 'https://wa.me/5493834567890?text=' + encodeURIComponent(message)
    
    window.open(whatsappUrl, '_blank')
  }

  const handleViewDetails = () => {
    window.open(`/propiedad/${property.id}`, '_blank')
  }

  return (
    <Card className={cn('overflow-hidden hover:shadow-xl transition-all duration-300 group', className)}>
      {/* Image Section */}
      <div className="relative h-48 md:h-56 overflow-hidden bg-gray-200">
        {/* Main Image */}
        <img
          src={imageError ? fallbackImage : (mainImage?.url || fallbackImage)}
          alt={mainImage?.alt || property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={handleImageError}
        />

        {/* Image Navigation */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            >
              ←
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            >
              →
            </button>
            
            {/* Image Indicators */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
              {images.map((_: any, index: number) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={cn(
                    'w-2 h-2 rounded-full transition-all',
                    index === currentImageIndex 
                      ? 'bg-white' 
                      : 'bg-white/50 hover:bg-white/75'
                  )}
                />
              ))}
            </div>
          </>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col space-y-1">
          <Badge className={cn('text-xs font-medium', getOperationColor(property.operation))}>
            {getOperationLabel(property.operation)}
          </Badge>
          {property.featured && (
            <Badge className="bg-yellow-100 text-yellow-800 text-xs font-medium">
              <Star className="w-3 h-3 mr-1" />
              Destacada
            </Badge>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={() => onFavorite?.(property.id)}
          className="absolute top-2 right-2 bg-white/90 hover:bg-white p-2 rounded-full transition-colors"
        >
          <Heart 
            className={cn(
              'w-4 h-4 transition-colors',
              isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600 hover:text-red-500'
            )}
          />
        </button>

        {/* Price Badge */}
        <div className="absolute bottom-2 right-2 bg-black/75 text-white px-2 py-1 rounded text-sm font-semibold">
          {formatPrice(property.price_usd, property.price_ars, property.operation)}
        </div>
      </div>

      <CardContent className="p-4">
        {/* Title and Type */}
        <div className="mb-3">
          <div className="flex items-start justify-between mb-1">
            <h3 className="font-semibold text-gray-900 line-clamp-1 flex-1">
              {property.title}
            </h3>
            <Badge variant="outline" className="ml-2 text-xs">
              {getTypeLabel(property.type)}
            </Badge>
          </div>
          
          {/* Location */}
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="line-clamp-1">
              {property.address ? `${property.address}, ` : ''}{property.city}
            </span>
          </div>
        </div>

        {/* Description */}
        {property.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {property.description}
          </p>
        )}

        {/* Property Details */}
        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
          {property.rooms && (
            <div className="flex items-center">
              <Bed className="w-4 h-4 mr-1" />
              <span>{property.rooms}</span>
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center">
              <Bath className="w-4 h-4 mr-1" />
              <span>{property.bathrooms}</span>
            </div>
          )}
          {(property.area_covered || property.area_total) && (
            <div className="flex items-center">
              <Square className="w-4 h-4 mr-1" />
              <span>
                {property.area_covered || property.area_total}m²
              </span>
            </div>
          )}
        </div>

        {/* Agent Info */}
        {showAgent && property.agents && (
          <div className="border-t pt-3 mb-3">
            <p className="text-xs text-gray-500 mb-1">Agente</p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">
                {property.agents.name}
              </span>
              <div className="flex space-x-1">
                {property.agents.phone && (
                  <button
                    onClick={handleContact}
                    className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                    title="WhatsApp"
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                )}
                {property.agents.email && (
                  <a
                    href={`mailto:${property.agents.email}?subject=Consulta sobre ${property.title}`}
                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Email"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleViewDetails}
            className="flex-1"
          >
            <Eye className="w-4 h-4 mr-1" />
            Ver Detalles
          </Button>
          <Button 
            size="sm" 
            onClick={handleContact}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            <Phone className="w-4 h-4 mr-1" />
            Consultar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
