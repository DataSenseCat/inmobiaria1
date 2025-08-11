import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase/client'
import { logError } from '@/lib/utils/errorUtils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import AdminDiagnosis from '@/components/AdminDiagnosis'
import { 
  Building, 
  Users, 
  FileText, 
  TrendingUp, 
  DollarSign,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  Calendar,
  MapPin,
  AlertCircle,
  Star
} from 'lucide-react'

interface DashboardStats {
  totalProperties: number
  activeProperties: number
  totalLeads: number
  newLeadsToday: number
  totalRevenue: number
  avgPropertyPrice: number
}

export default function AdminPage() {
  const navigate = useNavigate()

  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    activeProperties: 0,
    totalLeads: 0,
    newLeadsToday: 0,
    totalRevenue: 0,
    avgPropertyPrice: 0
  })

  const [properties, setProperties] = useState<any[]>([])
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const handleExportData = () => {
    // Implement data export functionality
    console.log('Exporting data...')
    // For now, just show an alert
    alert('Funcionalidad de exportación en desarrollo')
  }

  const handleDeleteProperty = async (propertyId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta propiedad?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId)

      if (error) throw error

      // Refresh data after deletion
      fetchDashboardData()
      alert('Propiedad eliminada exitosamente')
    } catch (err) {
      console.error('Error deleting property:', err)
      alert('Error al eliminar la propiedad')
    }
  }

  const handleViewProperty = (propertyId: string) => {
    window.open(`/propiedad/${propertyId}`, '_blank')
  }

  const handleEditProperty = (propertyId: string) => {
    navigate(`/admin/properties/edit/${propertyId}`)
  }

  const handleContactLead = (lead: any) => {
    if (lead.phone) {
      const message = `Hola ${lead.name}, me contacto sobre tu consulta: ${lead.message}`
      const whatsappUrl = `https://wa.me/${lead.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
      window.open(whatsappUrl, '_blank')
    } else if (lead.email) {
      const subject = `Respuesta a tu consulta - Inmobiliaria Catamarca`
      const body = `Hola ${lead.name},\n\nGracias por contactarnos. En relación a tu consulta: "${lead.message}"\n\nSaludos cordiales,\nInmobiliaria Catamarca`
      const mailtoUrl = `mailto:${lead.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      window.open(mailtoUrl)
    }
  }

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Use the supabase client

      // Fetch properties
      const { data: propertiesData, error: propertiesError } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)

      // Fetch leads
      const { data: leadsData, error: leadsError } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)

      if (propertiesError || leadsError) {
        throw new Error('Error fetching data')
      }

      // Set sample data if database is empty or not connected
      const sampleProperties = propertiesData?.length ? propertiesData : getSampleProperties()
      const sampleLeads = leadsData?.length ? leadsData : getSampleLeads()

      setProperties(sampleProperties)
      setLeads(sampleLeads)

      // Calculate stats
      const activeProps = sampleProperties.filter((p: any) => p.active).length
      const todayLeads = sampleLeads.filter((lead: any) => {
        const today = new Date().toDateString()
        const leadDate = new Date(lead.created_at).toDateString()
        return today === leadDate
      }).length

      const avgPrice = sampleProperties.reduce((acc: number, p: any) => acc + (p.price_usd || 0), 0) / sampleProperties.length

      setStats({
        totalProperties: sampleProperties.length,
        activeProperties: activeProps,
        totalLeads: sampleLeads.length,
        newLeadsToday: todayLeads,
        totalRevenue: 2500000, // Sample revenue
        avgPropertyPrice: Math.round(avgPrice || 0)
      })

    } catch (err) {
      const errorLog = logError(err, 'AdminPage.fetchDashboardData')
      setError(`Error al conectar con la base de datos: ${errorLog.message}. Mostrando información de ejemplo.`)

      // Load sample data on error
      const sampleProps = getSampleProperties()
      const sampleLeadsData = getSampleLeads()
      
      setProperties(sampleProps)
      setLeads(sampleLeadsData)
      setStats({
        totalProperties: sampleProps.length,
        activeProperties: sampleProps.filter(p => p.active).length,
        totalLeads: sampleLeadsData.length,
        newLeadsToday: 3,
        totalRevenue: 2500000,
        avgPropertyPrice: 125000
      })
    } finally {
      setLoading(false)
    }
  }

  const getSampleProperties = () => [
    {
      id: '1',
      title: 'Casa en Barrio Norte',
      type: 'casa',
      operation: 'venta',
      price_usd: 120000,
      city: 'San Fernando del Valle de Catamarca',
      active: true,
      featured: true,
      created_at: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      title: 'Departamento Céntrico',
      type: 'departamento',
      operation: 'alquiler',
      price_usd: 800,
      city: 'San Fernando del Valle de Catamarca',
      active: true,
      featured: false,
      created_at: '2024-01-14T09:00:00Z'
    },
    {
      id: '3',
      title: 'Lote en Zona Residencial',
      type: 'lote',
      operation: 'venta',
      price_usd: 35000,
      city: 'San Fernando del Valle de Catamarca',
      active: true,
      featured: false,
      created_at: '2024-01-13T08:00:00Z'
    }
  ]

  const getSampleLeads = () => [
    {
      id: '1',
      name: 'María González',
      email: 'maria@email.com',
      phone: '+54 383 456-1234',
      message: 'Interesada en casa en Barrio Norte',
      status: 'new',
      created_at: new Date().toISOString(),
      property_id: '1'
    },
    {
      id: '2',
      name: 'Carlos Rodríguez',
      email: 'carlos@email.com',
      phone: '+54 383 456-5678',
      message: 'Consulta sobre departamento céntrico',
      status: 'contacted',
      created_at: '2024-01-14T15:30:00Z',
      property_id: '2'
    },
    {
      id: '3',
      name: 'Ana Pérez',
      email: 'ana@email.com',
      phone: '+54 383 456-9012',
      message: 'Solicita tasación de propiedad',
      status: 'qualified',
      created_at: '2024-01-13T11:20:00Z'
    }
  ]

  const getStatusColor = (status: string) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      qualified: 'bg-green-100 text-green-800',
      converted: 'bg-purple-100 text-purple-800',
      closed: 'bg-gray-100 text-gray-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getStatusLabel = (status: string) => {
    const labels = {
      new: 'Nuevo',
      contacted: 'Contactado',
      qualified: 'Calificado',
      converted: 'Convertido',
      closed: 'Cerrado'
    }
    return labels[status as keyof typeof labels] || status
  }

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
          <p className="text-gray-600">Cargando panel de administración...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Panel de Administración
              </h1>
              <p className="text-gray-600 mt-1">
                Gestiona propiedades, leads y operaciones de la inmobiliaria
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-2">
              <Button size="sm" onClick={() => navigate('/admin/properties/new')}>
                <Plus className="w-4 h-4 mr-2" />
                Nueva Propiedad
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExportData()}>
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="container mx-auto px-4 py-4">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-orange-500 mr-2" />
              <p className="text-orange-700 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Admin Diagnosis */}
      <div className="container mx-auto px-4 py-4">
        <AdminDiagnosis />
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Propiedades Totales</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalProperties}</p>
                  <p className="text-sm text-green-600">
                    {stats.activeProperties} activas
                  </p>
                </div>
                <Building className="h-12 w-12 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Leads Totales</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalLeads}</p>
                  <p className="text-sm text-blue-600">
                    {stats.newLeadsToday} hoy
                  </p>
                </div>
                <Users className="h-12 w-12 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
                  <p className="text-3xl font-bold text-gray-900">
                    ${stats.totalRevenue.toLocaleString()}
                  </p>
                  <p className="text-sm text-purple-600">+12% vs mes anterior</p>
                </div>
                <DollarSign className="h-12 w-12 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Precio Promedio</p>
                  <p className="text-3xl font-bold text-gray-900">
                    ${stats.avgPropertyPrice.toLocaleString()}
                  </p>
                  <p className="text-sm text-orange-600">USD promedio</p>
                </div>
                <TrendingUp className="h-12 w-12 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="properties" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="properties">Propiedades</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="analytics">Análisis</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
          </TabsList>

          {/* Properties Tab */}
          <TabsContent value="properties">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <CardTitle>Propiedades Recientes</CardTitle>
                  <div className="flex space-x-2 mt-4 md:mt-0">
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filtros
                    </Button>
                    <Button variant="outline" size="sm">
                      <Search className="w-4 h-4 mr-2" />
                      Buscar
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {properties.map((property) => (
                    <div key={property.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{property.title}</h3>
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
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <span className="capitalize">{property.type}</span>
                          <span className="capitalize">{property.operation}</span>
                          <span>{formatPrice(property.price_usd, property.operation)}</span>
                          <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {property.city}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(property.created_at)}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewProperty(property.id)}
                          title="Ver propiedad"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditProperty(property.id)}
                          title="Editar propiedad"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => handleDeleteProperty(property.id)}
                          title="Eliminar propiedad"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/admin/properties')}
                  >
                    Ver Todas las Propiedades
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Leads Tab */}
          <TabsContent value="leads">
            <Card>
              <CardHeader>
                <CardTitle>Leads Recientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leads.map((lead) => (
                    <div key={lead.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{lead.name}</h3>
                          <Badge className={getStatusColor(lead.status)}>
                            {getStatusLabel(lead.status)}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-2">
                          <span className="flex items-center">
                            <Mail className="w-4 h-4 mr-1" />
                            {lead.email}
                          </span>
                          <span className="flex items-center">
                            <Phone className="w-4 h-4 mr-1" />
                            {lead.phone}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(lead.created_at)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{lead.message}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Phone className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Mail className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <Button variant="outline">Ver Todos los Leads</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Propiedades por Tipo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Casas</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{width: '60%'}}></div>
                        </div>
                        <span className="text-sm text-gray-600">60%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Departamentos</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{width: '25%'}}></div>
                        </div>
                        <span className="text-sm text-gray-600">25%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Lotes</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-600 h-2 rounded-full" style={{width: '15%'}}></div>
                        </div>
                        <span className="text-sm text-gray-600">15%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Estado de Leads</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Nuevos</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{width: '40%'}}></div>
                        </div>
                        <span className="text-sm text-gray-600">40%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Contactados</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div className="bg-yellow-600 h-2 rounded-full" style={{width: '35%'}}></div>
                        </div>
                        <span className="text-sm text-gray-600">35%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Convertidos</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{width: '25%'}}></div>
                        </div>
                        <span className="text-sm text-gray-600">25%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configuración General</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Notificaciones por Email</h3>
                      <p className="text-sm text-gray-600">Recibir emails de nuevos leads</p>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Auto-respuesta</h3>
                      <p className="text-sm text-gray-600">Respuesta automática a consultas</p>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Backup Automático</h3>
                      <p className="text-sm text-gray-600">Backup diario de datos</p>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Acciones Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar Todas las Propiedades
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Generar Reporte Mensual
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    Exportar Lista de Leads
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Mail className="w-4 h-4 mr-2" />
                    Configurar Email Marketing
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => window.open('/debug', '_blank')}
                  >
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Debug Base de Datos
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
