import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase/client'
import { logError } from '@/lib/utils/errorUtils'
import { Property } from '@/lib/supabase/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Star, 
  MapPin, 
  Calendar,
  ArrowLeft,
  AlertCircle
} from 'lucide-react'

export default function PropertiesManagementPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterOperation, setFilterOperation] = useState<string>('all')
  const navigate = useNavigate()

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    setLoading(true)
    setError(null)

    try {
      const { data: propertiesData, error: propertiesError } = await supabase
        .from('properties')
        .select(`
          *,
          images:property_images(*),
          agents(name, email)
        `)
        .order('created_at', { ascending: false })

      if (propertiesError) {
        throw propertiesError
      }

      setProperties(propertiesData || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      const errorLog = logError(err, 'PropertiesManagementPage.fetchProperties')
      setError(`Error al cargar propiedades: ${errorMessage}`)
      console.error('Error fetching properties:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProperty = async (propertyId: string, propertyTitle: string) => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar "${propertyTitle}"?`)) {
      return
    }

    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId)

      if (error) {
        throw error
      }

      // Actualizar la lista local
      setProperties(prev => prev.filter(p => p.id !== propertyId))
      
    } catch (err) {
      const errorLog = logError(err, 'PropertiesManagementPage.handleDeleteProperty')
      alert(`Error al eliminar la propiedad: ${errorLog.message}`)
    }
  }

  const togglePropertyStatus = async (propertyId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ active: !currentStatus })
        .eq('id', propertyId)

      if (error) {
        throw error
      }

      // Actualizar la lista local
      setProperties(prev => 
        prev.map(p => 
          p.id === propertyId 
            ? { ...p, active: !currentStatus }
            : p
        )
      )
      
    } catch (err) {
      const errorLog = logError(err, 'PropertiesManagementPage.togglePropertyStatus')
      alert(`Error al cambiar el estado: ${errorLog.message}`)
    }
  }

  const toggleFeaturedStatus = async (propertyId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ featured: !currentStatus })
        .eq('id', propertyId)

      if (error) {
        throw error
      }

      // Actualizar la lista local
      setProperties(prev => 
        prev.map(p => 
          p.id === propertyId 
            ? { ...p, featured: !currentStatus }
            : p
        )
      )
      
    } catch (err) {
      const errorLog = logError(err, 'PropertiesManagementPage.toggleFeaturedStatus')
      alert(`Error al cambiar el estado destacado: ${errorLog.message}`)
    }
  }

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.address?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = filterType === 'all' || property.type === filterType
    const matchesOperation = filterOperation === 'all' || property.operation === filterOperation

    return matchesSearch && matchesType && matchesOperation
  })

  const formatPrice = (price: number | null | undefined, operation: string) => {
    if (price === null || price === undefined) {
      return 'Precio a consultar'
    }
    const currency = operation === 'venta' ? 'USD' : 'USD/mes'
    return `${currency} ${price.toLocaleString()}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando propiedades...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={() => navigate('/admin')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Panel
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Gestión de Propiedades</h1>
              <p className="text-gray-600">
                {filteredProperties.length} de {properties.length} propiedades
              </p>
            </div>
          </div>
          <Button onClick={() => navigate('/admin/properties/new')}>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Propiedad
          </Button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar por título, ciudad o dirección..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="all">Todos los tipos</option>
                  <option value="casa">Casa</option>
                  <option value="departamento">Departamento</option>
                  <option value="ph">PH</option>
                  <option value="lote">Lote</option>
                  <option value="local">Local</option>
                </select>
                <select
                  value={filterOperation}
                  onChange={(e) => setFilterOperation(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="all">Todas las operaciones</option>
                  <option value="venta">Venta</option>
                  <option value="alquiler">Alquiler</option>
                  <option value="temporal">Temporal</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Properties List */}
        <div className="space-y-4">
          {filteredProperties.map((property) => (
            <Card key={property.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {property.title}
                      </h3>
                      {property.featured && (
                        <Badge className="bg-yellow-100 text-yellow-800">
                          <Star className="w-3 h-3 mr-1" />
                          Destacada
                        </Badge>
                      )}
                      <Badge variant={property.active ? "default" : "secondary"}>
                        {property.active ? 'Activa' : 'Inactiva'}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <span className="font-medium mr-2">Tipo:</span>
                        <span className="capitalize">{property.type}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium mr-2">Operación:</span>
                        <span className="capitalize">{property.operation}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium mr-2">Precio:</span>
                        <span>{formatPrice(property.price_usd, property.operation)}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{formatDate(property.created_at)}</span>
                      </div>
                    </div>

                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{property.address || 'Sin dirección'}, {property.city}</span>
                    </div>

                    {property.description && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {property.description}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2 text-xs">
                      {property.rooms && (
                        <span className="px-2 py-1 bg-gray-100 rounded">
                          {property.rooms} hab.
                        </span>
                      )}
                      {property.bathrooms && (
                        <span className="px-2 py-1 bg-gray-100 rounded">
                          {property.bathrooms} baños
                        </span>
                      )}
                      {property.area_covered && (
                        <span className="px-2 py-1 bg-gray-100 rounded">
                          {property.area_covered}m² cub.
                        </span>
                      )}
                      {property.area_total && (
                        <span className="px-2 py-1 bg-gray-100 rounded">
                          {property.area_total}m² tot.
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`/propiedad/${property.id}`, '_blank')}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Ver
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/admin/properties/edit/${property.id}`)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleFeaturedStatus(property.id, property.featured)}
                      className={property.featured ? 'text-yellow-600' : ''}
                    >
                      <Star className="w-4 h-4 mr-1" />
                      {property.featured ? 'Quitar' : 'Destacar'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => togglePropertyStatus(property.id, property.active)}
                      className={property.active ? 'text-gray-600' : 'text-green-600'}
                    >
                      {property.active ? 'Desactivar' : 'Activar'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteProperty(property.id, property.title)}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Eliminar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredProperties.length === 0 && !loading && (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="text-gray-500">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No se encontraron propiedades</h3>
                  <p className="text-sm">
                    {searchTerm || filterType !== 'all' || filterOperation !== 'all'
                      ? 'Intenta ajustar los filtros de búsqueda'
                      : 'Comienza creando tu primera propiedad'
                    }
                  </p>
                  {(!searchTerm && filterType === 'all' && filterOperation === 'all') && (
                    <Button 
                      className="mt-4"
                      onClick={() => navigate('/admin/properties/new')}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Crear Primera Propiedad
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
