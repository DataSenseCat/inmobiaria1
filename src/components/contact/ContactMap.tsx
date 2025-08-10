import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Icon } from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in react-leaflet
delete (Icon.Default.prototype as any)._getIconUrl
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

export default function ContactMap() {
  const [isClient, setIsClient] = useState(false)
  const [mapError] = useState(false)

  // Company location: Catamarca, Argentina (approximate coordinates)
  const companyLocation = {
    lat: -28.4696,
    lng: -65.7795,
    address: 'Av. República 123, San Fernando del Valle de Catamarca'
  }

  useEffect(() => {
    setIsClient(true)
  }, [])


  // Fallback map with static image and directions link
  const StaticMap = () => (
    <div className="relative bg-gray-100 rounded-lg h-full flex flex-col items-center justify-center p-6">
      <div className="text-center mb-4">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg 
            className="w-8 h-8 text-blue-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
            />
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
            />
          </svg>
        </div>
        <h3 className="font-semibold text-gray-900 mb-2">Nuestra Ubicación</h3>
        <p className="text-gray-600 text-sm mb-4">
          {companyLocation.address}
        </p>
      </div>
      
      <div className="space-y-2 w-full max-w-xs">
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${companyLocation.lat},${companyLocation.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          Ver en Google Maps
        </a>
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${companyLocation.lat},${companyLocation.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-green-600 text-white text-center py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm"
        >
          Cómo Llegar
        </a>
      </div>
    </div>
  )

  // Show static map on server-side rendering or if map fails to load
  if (!isClient || mapError) {
    return <StaticMap />
  }

  try {
    return (
      <div className="h-full relative">
        <MapContainer
          center={[companyLocation.lat, companyLocation.lng]}
          zoom={15}
          style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
          zoomControl={true}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[companyLocation.lat, companyLocation.lng]}>
            <Popup>
              <div className="text-center p-2">
                <h3 className="font-semibold text-gray-900 mb-1">
                  Inmobiliaria Catamarca
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {companyLocation.address}
                </p>
                <div className="space-y-1">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${companyLocation.lat},${companyLocation.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-blue-600 hover:text-blue-700 text-xs"
                  >
                    Ver en Google Maps
                  </a>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${companyLocation.lat},${companyLocation.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-green-600 hover:text-green-700 text-xs"
                  >
                    Cómo llegar
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
        
        {/* Controls overlay */}
        <div className="absolute top-2 right-2 z-[1000] space-y-1">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${companyLocation.lat},${companyLocation.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white shadow-md rounded px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 transition-colors"
            title="Ver en Google Maps"
          >
            📍 Google Maps
          </a>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error loading map:', error)
    return <StaticMap />
  }
}
