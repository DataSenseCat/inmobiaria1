import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '@/lib/supabase/client'
import { logError } from '@/lib/utils/errorUtils'
import { Property } from '@/lib/supabase/types'
import PropertyForm from '@/components/forms/PropertyForm'
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

export default function EditPropertyPage() {
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { user } = useSupabase()

  useEffect(() => {
    if (id) {
      fetchProperty()
    }
  }, [id])

  const fetchProperty = async () => {
    if (!id) return

    setLoading(true)
    setError(null)

    try {
      const { data: property, error: propertyError } = await supabase
        .from('properties')
        .select(`
          *,
          images:property_images(*)
        `)
        .eq('id', id)
        .single()

      if (propertyError) {
        throw propertyError
      }

      setProperty(property)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      const errorLog = logError(err, 'EditPropertyPage.fetchProperty')
      setError(`Error al cargar la propiedad: ${errorMessage}`)
      console.error('Error fetching property:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (data: PropertyFormData) => {
    if (!user || !id) {
      setError('Debes estar autenticado para editar propiedades')
      return
    }

    setSaving(true)
    setError(null)

    try {
      // Actualizar la propiedad en la base de datos
      const { data: updatedProperty, error: propertyError } = await supabase
        .from('properties')
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (propertyError) {
        throw propertyError
      }

      console.log('Propiedad actualizada exitosamente:', updatedProperty)
      
      // Redirigir al panel de admin con mensaje de éxito
      navigate('/admin?success=property_updated')
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      const errorLog = logError(err, 'EditPropertyPage.handleSubmit')
      setError(`Error al actualizar la propiedad: ${errorMessage}`)
      console.error('Error updating property:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    navigate('/admin')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando propiedad...</p>
        </div>
      </div>
    )
  }

  if (error && !property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-700">{error}</p>
          </div>
          <button
            onClick={() => navigate('/admin')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Volver al Panel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
        
        {property && (
          <PropertyForm
            property={property}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={saving}
          />
        )}
      </div>
    </div>
  )
}
