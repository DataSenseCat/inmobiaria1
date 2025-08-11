import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Development } from '@/lib/supabase/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  MapPin, 
  Calendar, 
  Building, 
  DollarSign, 
  Phone, 
  Mail,
  Clock,
  CheckCircle,
  Construction,
  Loader2,
  AlertCircle
} from 'lucide-react'

export default function DevelopmentsPage() {
  const [developments, setDevelopments] = useState<Development[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'planning' | 'construction' | 'completed'>('all')

  useEffect(() => {
    fetchDevelopments()
  }, [filter])

  const fetchDevelopments = async () => {
    try {
      setLoading(true)
      setError(null)

      let query = supabase
        .from('developments')
        .select(`
          *,
          development_images (
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

      if (filter !== 'all') {
        query = query.eq('status', filter)
      }

      query = query.order('created_at', { ascending: false })

      const { data, error: fetchError } = await query

      if (fetchError) {
        throw fetchError
      }

      setDevelopments(data || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err)
      console.error('Error fetching developments:', {
        error: err,
        message: errorMessage,
        stack: err instanceof Error ? err.stack : undefined
      })

      // Check if it's a table not found error - in that case, silently use sample data
      if (err instanceof Error && (
        err.message.includes('relation') ||
        err.message.includes('does not exist') ||
        err.message.includes('PGRST116')
      )) {
        console.log('Database tables not found, using sample developments data')
        setError(null) // Don't show error for missing tables
      } else {
        setError(`Problema de conexión con la base de datos. Mostrando emprendimientos de ejemplo.`)
      }

      setDevelopments(getSampleDevelopments())
    } finally {
      setLoading(false)
    }
  }

  const getSampleDevelopments = (): Development[] => [
    {
      id: '1',
      name: 'Complejo Residencial Las Palmeras',
      description: 'Moderno complejo residencial con 48 unidades, amenities y espacios verdes. Ubicado en la zona más exclusiva de Catamarca.',
      address: 'Av. Güemes 2500',
      city: 'San Fernando del Valle de Catamarca',
      total_units: 48,
      available_units: 12,
      price_from: 85000,
      price_to: 150000,
      delivery_date: '2025-06-30',
      status: 'construction',
      featured: true,
      active: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      images: [
        {
          id: '1',
          development_id: '1',
          url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
          alt: 'Complejo Residencial Las Palmeras',
          order_index: 0,
          created_at: '2024-01-01T00:00:00Z'
        }
      ]
    },
    {
      id: '2',
      name: 'Torres del Valle',
      description: 'Dos torres residenciales de 12 pisos cada una, con vista panorámica a las sierras. Departamentos de 1, 2 y 3 dormitorios.',
      address: 'República 1800',
      city: 'San Fernando del Valle de Catamarca',
      total_units: 96,
      available_units: 72,
      price_from: 95000,
      price_to: 180000,
      delivery_date: '2025-12-31',
      status: 'planning',
      featured: true,
      active: true,
      created_at: '2024-01-02T00:00:00Z',
      updated_at: '2024-01-02T00:00:00Z',
      images: [
        {
          id: '2',
          development_id: '2',
          url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
          alt: 'Torres del Valle',
          order_index: 0,
          created_at: '2024-01-02T00:00:00Z'
        }
      ]
    },
    {
      id: '3',
      name: 'Barrio Cerrado El Mirador',
      description: 'Exclusivo barrio cerrado con 24 lotes de 400 a 800 m². Seguridad 24hs, club house y espacios recreativos.',
      address: 'Ruta 38 Km 15',
      city: 'San Fernando del Valle de Catamarca',
      total_units: 24,
      available_units: 8,
      price_from: 45000,
      price_to: 75000,
      delivery_date: '2024-08-31',
      status: 'completed',
      featured: false,
      active: true,
      created_at: '2024-01-03T00:00:00Z',
      updated_at: '2024-01-03T00:00:00Z',
      images: [
        {
          id: '3',
          development_id: '3',
          url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
          alt: 'Barrio Cerrado El Mirador',
          order_index: 0,
          created_at: '2024-01-03T00:00:00Z'
        }
      ]
    }
  ]

  const getStatusLabel = (status: string) => {
    const statusLabels = {
      planning: 'En Planificación',
      construction: 'En Construcción', 
      completed: 'Finalizado',
      delivered: 'Entregado'
    }
    return statusLabels[status as keyof typeof statusLabels] || status
  }

  const getStatusColor = (status: string) => {
    const colors = {
      planning: 'bg-blue-100 text-blue-800',
      construction: 'bg-orange-100 text-orange-800',
      completed: 'bg-green-100 text-green-800',
      delivered: 'bg-gray-100 text-gray-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'planning':
        return <Clock className="w-4 h-4" />
      case 'construction':
        return <Construction className="w-4 h-4" />
      case 'completed':
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />
      default:
        return <Building className="w-4 h-4" />
    }
  }

  const formatDeliveryDate = (dateString?: string) => {
    if (!dateString) return 'A confirmar'
    const date = new Date(dateString)
    return date.toLocaleDateString('es-AR', { 
      year: 'numeric', 
      month: 'long' 
    })
  }

  const handleContact = (development: Development) => {
    const message = `Hola, me interesa el emprendimiento "${development.name}" en ${development.address}, ${development.city}. ¿Podrían darme más información?`
    const whatsappUrl = development.agents?.phone 
      ? `https://wa.me/${development.agents.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
      : 'https://wa.me/5493834567890?text=' + encodeURIComponent(message)
    
    window.open(whatsappUrl, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Cargando emprendimientos...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Emprendimientos Inmobiliarios
          </h1>
          <p className="text-gray-600 max-w-3xl">
            Descubre los mejores desarrollos inmobiliarios en Catamarca. Desde complejos residenciales hasta barrios cerrados, 
            encuentra la inversión perfecta para tu futuro.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              Todos
            </Button>
            <Button
              variant={filter === 'planning' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('planning')}
            >
              En Planificación
            </Button>
            <Button
              variant={filter === 'construction' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('construction')}
            >
              En Construcción
            </Button>
            <Button
              variant={filter === 'completed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('completed')}
            >
              Finalizados
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-orange-500 mr-2" />
              <p className="text-orange-700 text-sm">
                Hubo un problema al conectar con la base de datos. Mostrando emprendimientos de ejemplo.
              </p>
            </div>
          </div>
        )}

        {developments.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-50 rounded-lg p-8">
              <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No hay emprendimientos disponibles
              </h3>
              <p className="text-gray-600 mb-4">
                No se encontraron emprendimientos que coincidan con el filtro seleccionado.
              </p>
              <Button
                variant="outline"
                onClick={() => setFilter('all')}
              >
                Ver Todos los Emprendimientos
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {developments.map((development) => (
              <Card key={development.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                {/* Image */}
                <div className="relative h-64 bg-gray-200">
                  <img
                    src={development.images?.[0]?.url || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop'}
                    alt={development.images?.[0]?.alt || development.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4">
                    <Badge className={`flex items-center space-x-1 ${getStatusColor(development.status)}`}>
                      {getStatusIcon(development.status)}
                      <span>{getStatusLabel(development.status)}</span>
                    </Badge>
                  </div>

                  {/* Featured Badge */}
                  {development.featured && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-yellow-100 text-yellow-800">
                        Destacado
                      </Badge>
                    </div>
                  )}
                </div>

                <CardHeader>
                  <CardTitle className="text-xl">{development.name}</CardTitle>
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin className="w-4 h-4 mr-1" />
                    {development.address}, {development.city}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {development.description}
                  </p>

                  {/* Key Info */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Building className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-gray-500">Total de unidades</p>
                        <p className="font-semibold">{development.total_units || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <div>
                        <p className="text-gray-500">Disponibles</p>
                        <p className="font-semibold text-green-600">
                          {development.available_units || 'Consultar'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-gray-500">Desde</p>
                        <p className="font-semibold">
                          {development.price_from 
                            ? `USD ${development.price_from.toLocaleString()}`
                            : 'Consultar'
                          }
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-gray-500">Entrega</p>
                        <p className="font-semibold">
                          {formatDeliveryDate(development.delivery_date)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Price Range */}
                  {development.price_from && development.price_to && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-800 font-medium">
                        Rango de precios: USD {development.price_from.toLocaleString()} - USD {development.price_to.toLocaleString()}
                      </p>
                    </div>
                  )}

                  {/* Agent Info */}
                  {development.agents && (
                    <div className="border-t pt-4">
                      <p className="text-xs text-gray-500 mb-2">Agente comercial</p>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">
                          {development.agents.name}
                        </span>
                        <div className="flex space-x-2">
                          {development.agents.phone && (
                            <button
                              onClick={() => handleContact(development)}
                              className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                              title="WhatsApp"
                            >
                              <Phone className="w-4 h-4" />
                            </button>
                          )}
                          {development.agents.email && (
                            <a
                              href={`mailto:${development.agents.email}?subject=Consulta sobre ${development.name}`}
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

                  {/* Actions */}
                  <div className="flex space-x-2 pt-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => window.open(`/emprendimientos/${development.id}`, '_blank')}
                    >
                      Ver Detalles
                    </Button>
                    <Button 
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => handleContact(development)}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Consultar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">
            ¿Tenés un proyecto inmobiliario?
          </h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Si sos desarrollador o tenés un proyecto inmobiliario, te ayudamos con la comercialización y marketing de tus unidades.
          </p>
          <Button 
            variant="secondary"
            onClick={() => window.location.href = '/contacto'}
          >
            Contactar para Comercialización
          </Button>
        </div>
      </div>
    </div>
  )
}
