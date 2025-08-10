'use client'

import Image from 'next/image'
import { MapPin, Calendar, Phone, Mail, CheckCircle, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ContactForm } from '@/components/properties/ContactForm'

interface DevelopmentDetailsProps {
  development: {
    id: string
    title: string
    status: string
    address?: string
    city?: string
    province?: string
    description?: string
    hero_url?: string
    amenities?: string[]
    progress: number
    created_at: string
    coordinates?: any
    agents?: {
      name: string
      phone?: string
      email: string
    }
  }
}

export function DevelopmentDetails({ development }: DevelopmentDetailsProps) {
  const statusColors = {
    'planificacion': 'bg-yellow-100 text-yellow-800',
    'construccion': 'bg-blue-100 text-blue-800',
    'finalizado': 'bg-green-100 text-green-800'
  }

  const statusLabels = {
    'planificacion': 'En Planificación',
    'construccion': 'En Construcción',
    'finalizado': 'Finalizado'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96">
        {development.hero_url ? (
          <Image
            src={development.hero_url}
            alt={development.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
            <div className="text-gray-500">
              <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        {/* Content */}
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-8">
            <div className="text-white max-w-3xl">
              <div className="mb-4">
                <Badge className={`${statusColors[development.status as keyof typeof statusColors]} border-0 mb-2`}>
                  {statusLabels[development.status as keyof typeof statusLabels] || development.status}
                </Badge>
                {development.status === 'construccion' && (
                  <Badge className="bg-white text-gray-800 border-0 ml-2">
                    {development.progress}% completado
                  </Badge>
                )}
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {development.title}
              </h1>
              
              {(development.address || development.city) && (
                <div className="flex items-center text-white/90 text-lg">
                  <MapPin className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span>
                    {development.address && `${development.address}, `}
                    {development.city}
                    {development.province && `, ${development.province}`}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Descripción del Proyecto</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  {development.description || 'Descripción no disponible.'}
                </p>
              </CardContent>
            </Card>

            {/* Progress (for construction projects) */}
            {development.status === 'construccion' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Progreso de Obra
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Avance general</span>
                      <span className="text-2xl font-bold text-blue-600">{development.progress}%</span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div 
                        className="bg-blue-600 h-4 rounded-full transition-all"
                        style={{ width: `${development.progress}%` }}
                      ></div>
                    </div>
                    
                    <p className="text-sm text-gray-600">
                      El proyecto avanza según cronograma establecido. 
                      {development.progress >= 80 && ' ¡Próximo a finalizar!'}
                      {development.progress >= 50 && development.progress < 80 && ' En etapa avanzada de construcción.'}
                      {development.progress < 50 && ' En etapa inicial de construcción.'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Amenities */}
            {development.amenities && development.amenities.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Amenities y Servicios</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {development.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Timeline/Status */}
            <Card>
              <CardHeader>
                <CardTitle>Estado del Proyecto</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      development.status === 'planificacion' || 
                      development.status === 'construccion' || 
                      development.status === 'finalizado' ? 'bg-green-500' : 'bg-gray-300'
                    }`}></div>
                    <span className="font-medium">Planificación</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      development.status === 'construccion' || 
                      development.status === 'finalizado' ? 'bg-green-500' : 'bg-gray-300'
                    }`}></div>
                    <span className="font-medium">Construcción</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      development.status === 'finalizado' ? 'bg-green-500' : 'bg-gray-300'
                    }`}></div>
                    <span className="font-medium">Finalizado</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <div className="text-sm text-gray-600">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    Proyecto iniciado: {new Date(development.created_at).toLocaleDateString('es-AR')}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Agent Contact */}
            {development.agents && (
              <Card>
                <CardHeader>
                  <CardTitle>Agente Responsable</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="font-medium text-gray-900">{development.agents.name}</div>
                      <div className="text-sm text-gray-600">Especialista en Emprendimientos</div>
                    </div>
                    
                    {development.agents.phone && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <a 
                          href={`tel:${development.agents.phone}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {development.agents.phone}
                        </a>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2 text-sm">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <a 
                        href={`mailto:${development.agents.email}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {development.agents.email}
                      </a>
                    </div>
                    
                    {development.agents.phone && (
                      <Button 
                        className="w-full mt-4"
                        asChild
                      >
                        <a 
                          href={`https://wa.me/${development.agents.phone.replace(/\D/g, '')}?text=Hola, me interesa el emprendimiento ${encodeURIComponent(development.title)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Contactar por WhatsApp
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>Solicitar Información</CardTitle>
              </CardHeader>
              <CardContent>
                <ContactForm 
                  developmentId={development.id}
                  developmentTitle={development.title}
                />
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Datos del Proyecto</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estado:</span>
                    <span className="font-medium">
                      {statusLabels[development.status as keyof typeof statusLabels] || development.status}
                    </span>
                  </div>
                  
                  {development.status === 'construccion' && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Progreso:</span>
                      <span className="font-medium text-blue-600">{development.progress}%</span>
                    </div>
                  )}
                  
                  {development.amenities && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amenities:</span>
                      <span className="font-medium">{development.amenities.length}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Inicio:</span>
                    <span className="font-medium">
                      {new Date(development.created_at).toLocaleDateString('es-AR')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
