'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Edit, Trash2, Star, Eye } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Property } from '@/lib/supabase/types'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'

interface PropertiesListProps {
  userRole: 'admin' | 'agent'
}

export default function PropertiesList({ userRole }: PropertiesListProps) {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    try {
      let query = supabase
        .from('properties')
        .select(`
          *,
          images (id, url, alt),
          agent:agents (id, name, email)
        `)
        .order('created_at', { ascending: false })

      const { data, error } = await query

      if (error) throw error
      setProperties(data || [])
    } catch (error) {
      console.error('Error fetching properties:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleFeatured = async (propertyId: string, featured: boolean) => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ featured: !featured })
        .eq('id', propertyId)

      if (error) throw error
      
      setProperties(prev => 
        prev.map(prop => 
          prop.id === propertyId ? { ...prop, featured: !featured } : prop
        )
      )
    } catch (error) {
      console.error('Error updating featured status:', error)
    }
  }

  const deleteProperty = async (propertyId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta propiedad?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId)

      if (error) throw error
      
      setProperties(prev => prev.filter(prop => prop.id !== propertyId))
    } catch (error) {
      console.error('Error deleting property:', error)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="w-24 h-24 bg-muted rounded" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                  <div className="h-3 bg-muted rounded w-1/4" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {properties.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No hay propiedades registradas</p>
          </CardContent>
        </Card>
      ) : (
        properties.map((property) => (
          <Card key={property.id}>
            <CardContent className="p-6">
              <div className="flex gap-4">
                {/* Property Image */}
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  {property.images?.[0] ? (
                    <Image
                      src={property.images[0].url}
                      alt={property.images[0].alt || property.title}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-2xl">🏠</span>
                    </div>
                  )}
                </div>

                {/* Property Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-lg truncate">
                        {property.title}
                      </h3>
                      
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant={property.operation === 'venta' ? 'default' : 'secondary'}>
                          {property.operation === 'venta' ? 'Venta' : 'Alquiler'}
                        </Badge>
                        
                        <Badge variant="outline">
                          {property.type === 'casa' ? 'Casa' :
                           property.type === 'departamento' ? 'Departamento' :
                           property.type === 'ph' ? 'PH' :
                           property.type === 'lote' ? 'Lote' : 'Local'}
                        </Badge>
                        
                        {property.featured && (
                          <Badge className="bg-yellow-500">
                            Destacada
                          </Badge>
                        )}
                      </div>

                      <div className="mt-2 space-y-1">
                        {property.price_usd && (
                          <p className="font-medium text-primary">
                            {formatPrice(property.price_usd, 'USD')}
                          </p>
                        )}
                        
                        <p className="text-sm text-muted-foreground truncate">
                          {property.address}, {property.city}
                        </p>
                        
                        {property.agent && (
                          <p className="text-sm text-muted-foreground">
                            Agente: {property.agent.name}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => toggleFeatured(property.id, property.featured)}
                        className={property.featured ? 'text-yellow-600' : ''}
                      >
                        <Star className={`h-4 w-4 ${property.featured ? 'fill-current' : ''}`} />
                      </Button>
                      
                      <Button variant="outline" size="icon" asChild>
                        <Link href={`/propiedad/${property.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      
                      <Button variant="outline" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => deleteProperty(property.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
