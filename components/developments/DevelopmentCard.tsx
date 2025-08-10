'use client'

import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Calendar, TrendingUp, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface DevelopmentCardProps {
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
    agents?: {
      name: string
      phone?: string
      email: string
    }
  }
}

export function DevelopmentCard({ development }: DevelopmentCardProps) {
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
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="relative h-48">
        {development.hero_url ? (
          <Image
            src={development.hero_url}
            alt={development.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <div className="text-gray-400">
              <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <Badge className={`${statusColors[development.status as keyof typeof statusColors]} border-0`}>
            {statusLabels[development.status as keyof typeof statusLabels] || development.status}
          </Badge>
        </div>

        {/* Progress Badge */}
        {development.status === 'construccion' && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-white text-gray-800 border-0">
              {development.progress}% completado
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {development.title}
        </h3>

        {/* Location */}
        {(development.address || development.city) && (
          <div className="flex items-center text-gray-600 text-sm mb-3">
            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
            <span>
              {development.address && `${development.address}, `}
              {development.city}
              {development.province && `, ${development.province}`}
            </span>
          </div>
        )}

        {/* Description */}
        {development.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {development.description}
          </p>
        )}

        {/* Amenities */}
        {development.amenities && development.amenities.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {development.amenities.slice(0, 3).map((amenity, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {amenity}
                </Badge>
              ))}
              {development.amenities.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{development.amenities.length - 3} más
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            <span>
              {new Date(development.created_at).toLocaleDateString('es-AR')}
            </span>
          </div>
          {development.agents && (
            <div className="flex items-center">
              <Users className="h-3 w-3 mr-1" />
              <span>{development.agents.name}</span>
            </div>
          )}
        </div>

        {/* Progress Bar for construction */}
        {development.status === 'construccion' && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-600">Progreso de obra</span>
              <span className="font-medium">{development.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${development.progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button asChild className="flex-1">
            <Link href={`/emprendimientos/${development.id}`}>
              Ver Detalles
            </Link>
          </Button>
          
          {development.agents?.phone && (
            <Button 
              variant="outline" 
              size="sm"
              asChild
            >
              <a 
                href={`https://wa.me/${development.agents.phone.replace(/\D/g, '')}?text=Hola, me interesa el emprendimiento ${encodeURIComponent(development.title)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
