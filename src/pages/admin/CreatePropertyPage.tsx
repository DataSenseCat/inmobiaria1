import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase/client'
import { logError } from '@/lib/utils/errorUtils'
import PropertyForm from '@/components/forms/PropertyForm'
import AdminDiagnosis from '@/components/AdminDiagnosis'
import { useSupabase } from '@/providers/SupabaseProvider'

type PropertyFormData = {
  title: string
  description?: string
  address?: string
  city: string
  type: 'casa' | 'departamento' | 'ph' | 'lote' | 'local'
  operation: 'venta' | 'alquiler' | 'temporal'
  price_usd?: number
  price_ars?: number
  rooms?: number
  bathrooms?: number
  area_covered?: number
  area_total?: number
  featured: boolean
  active: boolean
}

export default function CreatePropertyPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const { user } = useSupabase()

  const handleSubmit = async (data: PropertyFormData) => {
    if (!user) {
      setError('Debes estar autenticado para crear propiedades')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Crear la propiedad en la base de datos
      const { data: property, error: propertyError } = await supabase
        .from('properties')
        .insert({
          ...data,
          agent_id: user.id
        })
        .select()
        .single()

      if (propertyError) {
        throw propertyError
      }

      console.log('Propiedad creada exitosamente:', property)
      
      // Redirigir al panel de admin con mensaje de éxito
      navigate('/admin?success=property_created')
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      const errorLog = logError(err, 'CreatePropertyPage.handleSubmit')

      // Check if it's a table not found error
      if (err instanceof Error && (
        err.message.includes('relation') ||
        err.message.includes('does not exist') ||
        err.message.includes('PGRST116')
      )) {
        setError('Las tablas de la base de datos no están configuradas. Por favor contacta al administrador para configurar la base de datos.')
      } else {
        setError(`Error al crear la propiedad: ${errorMessage}`)
      }

      console.error('Error creating property:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate('/admin')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
        
        <PropertyForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
        />
      </div>
    </div>
  )
}
