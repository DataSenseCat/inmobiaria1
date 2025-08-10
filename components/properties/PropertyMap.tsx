'use client'

import { useEffect, useRef, useState } from 'react'
import { MapPin } from 'lucide-react'

interface PropertyMapProps {
  coordinates: {
    type: 'Point'
    coordinates: [number, number] // [longitude, latitude]
  }
  title: string
  className?: string
}

export default function PropertyMap({ coordinates, title, className }: PropertyMapProps) {
  const [isClient, setIsClient] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient || !mapRef.current || !coordinates?.coordinates) return

    // Dynamically import Leaflet only on client side
    import('leaflet').then((L) => {
      // Import CSS
      import('leaflet/dist/leaflet.css')

      // Fix for default markers in Next.js
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      })

      // Clean up existing map
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
      }

      // Extract coordinates (note: GeoJSON uses [longitude, latitude])
      const [lng, lat] = coordinates.coordinates

      // Initialize map
      const map = L.map(mapRef.current!).setView([lat, lng], 15)
      mapInstanceRef.current = map

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map)

      // Add marker
      const marker = L.marker([lat, lng]).addTo(map)
      marker.bindPopup(title).openPopup()

      // Cleanup function
      return () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove()
          mapInstanceRef.current = null
        }
      }
    })
  }, [isClient, coordinates, title])

  if (!coordinates?.coordinates) {
    return (
      <div className={`flex items-center justify-center h-64 bg-muted rounded-lg ${className}`}>
        <p className="text-muted-foreground">Ubicación no disponible</p>
      </div>
    )
  }

  if (!isClient) {
    return (
      <div className={`flex items-center justify-center h-64 bg-gray-200 rounded-lg ${className}`}>
        <div className="text-center">
          <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">Cargando mapa...</p>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={mapRef}
      className={`w-full h-full rounded-lg overflow-hidden ${className}`}
      style={{ minHeight: '200px' }}
    />
  )
}
