import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MapPin, BedDouble, Bath, Maximize, Calendar, MessageCircle, Share2, Heart } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import PropertyMap from '../components/properties/PropertyMap'
import ContactForm from '../components/properties/ContactForm'
import { createClient } from '../lib/supabase/client'
import { formatPrice, formatArea, getWhatsAppUrl } from '../lib/utils'

export default function PropertyDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [property, setProperty] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL || 'https://xtcdvnzcryshjwwggfrk.supabase.co',
    import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0Y2R2bnpjcnlzaGp3d2dnZnJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3OTE2NzAsImV4cCI6MjA3MDM2NzY3MH0.u-cwoiuT8xSg4fkFLuHw_GTmA9DI5xLPDhpHiGDS8MI'
  )

  useEffect(() => {
    async function fetchProperty() {
      if (!id) return
      
      try {
        const { data, error } = await supabase
          .from('properties')
          .select(`
            *,
            images (id, url, alt),
            agents (id, name, phone, email)
          `)
          .eq('id', id)
          .single()

        if (error) throw error
        setProperty(data)
      } catch (error) {
        console.error('Error fetching property:', error)
        setProperty(null)
      } finally {
        setLoading(false)
      }
    }

    fetchProperty()
  }, [id, supabase])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando propiedad...</p>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Propiedad no encontrada</h1>
          <p className="text-gray-600 mb-4">La propiedad que buscas no existe o ha sido eliminada.</p>
          <Button onClick={() => navigate('/propiedades')}>
            Ver todas las propiedades
          </Button>
        </div>
      </div>
    )
  }

  const operationLabel = property.operation === 'venta' ? 'Venta' : 'Alquiler'
  const typeLabelMap = {
    casa: 'Casa',
    departamento: 'Departamento',
    ph: 'PH',
    lote: 'Lote',
    local: 'Local Comercial'
  }
  const typeLabel = typeLabelMap[property.type as keyof typeof typeLabelMap]

  return (
    <div className="min-h-screen bg-background">
        {/* Image Gallery */}
        <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
          {property.images && property.images.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-full">
              {/* Main Image */}
              <div className="md:col-span-3 relative">
                <img
                  src={property.images[0].url}
                  alt={property.images[0].alt || property.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Side Images */}
              {property.images.length > 1 && (
                <div className="hidden md:flex flex-col gap-2">
                  {property.images.slice(1, 3).map((image: any, index: number) => (
                    <div key={image.id} className="relative flex-1">
                      <img
                        src={image.url}
                        alt={image.alt || `${property.title} - Imagen ${index + 2}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  ))}
                  {property.images.length > 3 && (
                    <div className="relative flex-1 bg-black/50 rounded-lg flex items-center justify-center">
                      <span className="text-white font-semibold">
                        +{property.images.length - 3} fotos
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <Maximize className="h-24 w-24 text-muted-foreground" />
            </div>
          )}

          {/* Overlay Buttons */}
          <div className="absolute top-4 right-4 flex gap-2">
            <Button variant="secondary" size="icon" className="rounded-full bg-white/90">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="icon" className="rounded-full bg-white/90">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Property Header */}
              <Card>
                <CardHeader>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                          {operationLabel}
                        </span>
                        <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-medium">
                          {typeLabel}
                        </span>
                        {property.featured && (
                          <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                            Destacada
                          </span>
                        )}
                      </div>
                      <CardTitle className="text-2xl md:text-3xl">
                        {property.title}
                      </CardTitle>
                      {property.address && (
                        <div className="flex items-center text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{property.address}, {property.city}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-right">
                      {property.price_usd && (
                        <p className="text-3xl font-bold text-primary">
                          {formatPrice(property.price_usd, 'USD')}
                        </p>
                      )}
                      {property.price_ars && (
                        <p className="text-sm text-muted-foreground">
                          {formatPrice(property.price_ars, 'ARS')}
                        </p>
                      )}
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Property Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Características</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {property.rooms && (
                      <div className="text-center">
                        <BedDouble className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <p className="font-medium">{property.rooms}</p>
                        <p className="text-sm text-muted-foreground">
                          {property.rooms === 1 ? 'Ambiente' : 'Ambientes'}
                        </p>
                      </div>
                    )}
                    
                    {property.bathrooms && (
                      <div className="text-center">
                        <Bath className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <p className="font-medium">{property.bathrooms}</p>
                        <p className="text-sm text-muted-foreground">
                          {property.bathrooms === 1 ? 'Baño' : 'Baños'}
                        </p>
                      </div>
                    )}
                    
                    {property.area_covered && (
                      <div className="text-center">
                        <Maximize className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <p className="font-medium">{formatArea(property.area_covered)}</p>
                        <p className="text-sm text-muted-foreground">Cubierta</p>
                      </div>
                    )}
                    
                    {property.area_total && (
                      <div className="text-center">
                        <Maximize className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <p className="font-medium">{formatArea(property.area_total)}</p>
                        <p className="text-sm text-muted-foreground">Total</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              {property.description && (
                <Card>
                  <CardHeader>
                    <CardTitle>Descripción</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {property.description}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Map */}
              {property.coordinates && (
                <Card>
                  <CardHeader>
                    <CardTitle>Ubicación</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 rounded-lg overflow-hidden">
                      <PropertyMap
                        coordinates={property.coordinates as any}
                        title={property.title}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Agent Info */}
              {property.agents && (
                <Card>
                  <CardHeader>
                    <CardTitle>Contacta al Agente</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold">{property.agents.name}</h4>
                      <p className="text-sm text-muted-foreground">{property.agents.email}</p>
                      {property.agents.phone && (
                        <p className="text-sm text-muted-foreground">{property.agents.phone}</p>
                      )}
                    </div>
                    
                    {property.agents.phone && (
                      <Button
                        onClick={() => {
                          const message = `Hola! Me interesa la propiedad "${property.title}" que vi en su sitio web. ¿Podría darme más información?`
                          const url = getWhatsAppUrl(property.agents!.phone!, message)
                          window.open(url, '_blank')
                        }}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Contactar por WhatsApp
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Contact Form */}
              <ContactForm propertyId={property.id} propertyTitle={property.title} />

              {/* Property Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Información Adicional</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Tipo</span>
                    <span className="text-sm font-medium">{typeLabel}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Operación</span>
                    <span className="text-sm font-medium">{operationLabel}</span>
                  </div>
                  
                  {property.city && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Ciudad</span>
                      <span className="text-sm font-medium">{property.city}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Publicado</span>
                    <span className="text-sm font-medium flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(property.created_at).toLocaleDateString('es-AR')}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
    </div>
  )
}
