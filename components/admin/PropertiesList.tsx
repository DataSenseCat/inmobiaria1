'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Edit, Trash2, Star, Eye } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface PropertiesListProps {
  userRole: 'admin' | 'agent'
  onEdit?: (property: any) => void
  onStatsChange?: () => void
}

export function PropertiesList({ userRole, onEdit, onStatsChange }: PropertiesListProps) {
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          images (id, url, alt),
          agents (id, name, email)
        `)
        .order('created_at', { ascending: false })

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
      fetchProperties()
      onStatsChange?.()
    } catch (error) {
      console.error('Error updating featured status:', error)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
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
            <p className="text-gray-500">No hay propiedades disponibles</p>
          </CardContent>
        </Card>
      ) : (
        properties.map((property) => (
          <Card key={property.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">{property.title}</h3>
                    {property.featured && (
                      <Badge className="bg-yellow-500">Destacada</Badge>
                    )}
                    <Badge variant="outline">
                      {property.operation === 'venta' ? 'Venta' : 'Alquiler'}
                    </Badge>
                    <Badge variant="secondary">
                      {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 mb-2">
                    {property.address}, {property.city}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    {property.price_usd && (
                      <span className="font-semibold text-green-600">
                        ${property.price_usd.toLocaleString()} USD
                      </span>
                    )}
                    {property.rooms && <span>{property.rooms} amb.</span>}
                    {property.bathrooms && <span>{property.bathrooms} baños</span>}
                    {property.area_covered && <span>{property.area_covered}m² cub.</span>}
                  </div>
                  
                  {property.agents && (
                    <p className="text-sm text-gray-500 mt-1">
                      Agente: {property.agents.name}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleFeatured(property.id, property.featured)}
                  >
                    <Star className={`h-4 w-4 ${property.featured ? 'fill-current text-yellow-500' : ''}`} />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit?.(property)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <a href={`/propiedad/${property.id}`} target="_blank">
                      <Eye className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
