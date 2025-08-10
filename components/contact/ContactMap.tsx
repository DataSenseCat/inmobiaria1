'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import map component to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
)

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
)

export function ContactMap() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
        <div className="text-gray-500">Cargando mapa...</div>
      </div>
    )
  }

  // Office coordinates in Catamarca
  const officePosition: [number, number] = [-28.4696, -65.7846]

  return (
    <div className="w-full h-full">
      <MapContainer
        center={officePosition}
        zoom={15}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={officePosition}>
          <Popup>
            <div className="text-center">
              <strong>Inmobiliaria Catamarca</strong>
              <br />
              {process.env.NEXT_PUBLIC_OFFICE_ADDRESS || 'Av. Belgrano 1250'}
              <br />
              San Fernando del Valle de Catamarca
              <br />
              <a 
                href={`tel:${process.env.NEXT_PUBLIC_CONTACT_PHONE || '+54 383 456-7890'}`}
                className="text-blue-600 hover:text-blue-800"
              >
                {process.env.NEXT_PUBLIC_CONTACT_PHONE || '+54 383 456-7890'}
              </a>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}
