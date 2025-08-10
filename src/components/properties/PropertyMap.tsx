interface PropertyMapProps {
  coordinates: { lat: number; lng: number }
  title: string
}

export default function PropertyMap(props: PropertyMapProps) {
  return (
    <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
      <p className="text-gray-600">Mapa de propiedad en desarrollo...</p>
    </div>
  )
}
