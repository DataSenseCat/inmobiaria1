import { useParams } from 'react-router-dom'

export default function DevelopmentDetailsPage() {
  const { id } = useParams<{ id: string }>()
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Detalles del Emprendimiento {id}
        </h1>
        <p className="text-gray-600">
          Página de detalles del emprendimiento en desarrollo...
        </p>
      </div>
    </div>
  )
}
