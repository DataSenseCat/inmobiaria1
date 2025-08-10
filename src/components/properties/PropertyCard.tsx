import { Link } from 'react-router-dom'
import { MapPin, BedDouble, Bath, Maximize, Heart } from 'lucide-react'
import { Property } from '../../lib/supabase/types'
import { Card } from '../ui/card'
import { Button } from '../ui/button'

interface PropertyCardProps {
  property: Property
  className?: string
}

export default function PropertyCard({ property, className }: PropertyCardProps) {
  const formatPrice = (price: number, currency: 'USD' | 'ARS') => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getOperationLabel = (operation: string) => {
    return operation === 'venta' ? 'Venta' : 'Alquiler'
  }

  const getTypeLabel = (type: string) => {
    const types = {
      casa: 'Casa',
      departamento: 'Departamento', 
      ph: 'PH',
      lote: 'Lote',
      local: 'Local Comercial'
    }
    return types[type as keyof typeof types] || type
  }

  return (
    <Card className={`group overflow-hidden bg-white shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 ${className}`}>
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        {property.images && property.images.length > 0 ? (
          <img
            src={property.images[0].url}
            alt={property.images[0].alt || property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <div className="text-gray-400 text-center">
              <Maximize className="h-12 w-12 mx-auto mb-2" />
              <span className="text-sm">Sin imagen</span>
            </div>
          </div>
        )}
        
        {/* Overlay badges */}
        <div className="absolute top-3 left-3">
          <span className="bg-gray-900 text-white px-2 py-1 rounded text-xs font-medium">
            {getOperationLabel(property.operation)}
          </span>
        </div>
        
        {property.featured && (
          <div className="absolute top-3 right-3">
            <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium">
              Destacada
            </span>
          </div>
        )}

        {/* Favorite button */}
        <button className="absolute bottom-3 right-3 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 transition-all duration-200">
          <Heart className="h-4 w-4 text-gray-600 hover:text-red-500" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Type */}
        <div className="mb-2">
          <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
            {getTypeLabel(property.type)}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-gray-700 transition-colors">
          {property.title}
        </h3>

        {/* Location */}
        {property.address && (
          <div className="flex items-start mb-3">
            <MapPin className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
            <span className="text-sm text-gray-600 line-clamp-2">
              {property.address}
              {property.city && `, ${property.city}`}
            </span>
          </div>
        )}

        {/* Features */}
        <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
          {property.rooms && (
            <div className="flex items-center">
              <BedDouble className="h-4 w-4 mr-1" />
              <span>{property.rooms}</span>
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1" />
              <span>{property.bathrooms}</span>
            </div>
          )}
          {property.area_covered && (
            <div className="flex items-center">
              <Maximize className="h-4 w-4 mr-1" />
              <span>{property.area_covered} m²</span>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="mb-4">
          {property.price_usd && (
            <div className="text-xl font-bold text-gray-900">
              {formatPrice(property.price_usd, 'USD')}
            </div>
          )}
          {property.price_ars && !property.price_usd && (
            <div className="text-xl font-bold text-gray-900">
              {formatPrice(property.price_ars, 'ARS')}
            </div>
          )}
          {property.price_ars && property.price_usd && (
            <div className="text-sm text-gray-600">
              {formatPrice(property.price_ars, 'ARS')}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <Button 
            asChild 
            variant="outline" 
            size="sm" 
            className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <Link to={`/propiedad/${property.id}`}>
              Ver detalles
            </Link>
          </Button>
          <Button 
            size="sm" 
            className="flex-1 bg-gray-900 hover:bg-gray-800 text-white"
          >
            Contactar
          </Button>
        </div>
      </div>
    </Card>
  )
}
