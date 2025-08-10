'use client'

import { Property } from '@/lib/supabase/types'
import { Card, CardContent } from '@/components/ui/card'

interface PropertyCardProps {
  property: Property
  className?: string
}

export default function PropertyCard({ property, className }: PropertyCardProps) {
  return (
    <Card className={`overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 ${className}`}>
      <div className="relative h-64 bg-muted flex items-center justify-center">
        <span className="text-2xl">🏠</span>
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg line-clamp-2 mb-1">
              {property.title}
            </h3>
            {property.address && (
              <p className="text-sm text-muted-foreground line-clamp-1">
                {property.address}, {property.city}
              </p>
            )}
          </div>

          {property.price_usd && (
            <p className="text-xl font-bold text-primary">
              USD ${property.price_usd.toLocaleString()}
            </p>
          )}

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {property.rooms && (
              <span>{property.rooms} amb</span>
            )}
            {property.bathrooms && (
              <span>{property.bathrooms} baños</span>
            )}
            {property.area_covered && (
              <span>{property.area_covered} m²</span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
              {property.type === 'casa' ? 'Casa' :
               property.type === 'departamento' ? 'Departamento' :
               property.type === 'ph' ? 'PH' :
               property.type === 'lote' ? 'Lote' : 'Local'}
            </span>
            <span className="text-xs text-muted-foreground">
              {property.operation === 'venta' ? 'Venta' : 'Alquiler'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
