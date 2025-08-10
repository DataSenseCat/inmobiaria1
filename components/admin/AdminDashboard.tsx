'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Home, MessageSquare, Users, BarChart3, Building, UserCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { PropertiesList } from './PropertiesList'
import { LeadsList } from './LeadsList'
import { DevelopmentsList } from './DevelopmentsList'
import { UsersList } from './UsersList'
import { PropertyForm } from './PropertyForm'
import { DevelopmentForm } from './DevelopmentForm'

interface AdminDashboardProps {
  userRole: 'admin' | 'agent'
}

interface DashboardStats {
  totalProperties: number
  totalLeads: number
  unreadLeads: number
  activeAgents: number
  featuredProperties: number
  totalDevelopments: number
}

export function AdminDashboard({ userRole }: AdminDashboardProps) {
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    totalLeads: 0,
    unreadLeads: 0,
    activeAgents: 0,
    featuredProperties: 0,
    totalDevelopments: 0
  })
  const [loading, setLoading] = useState(true)
  const [showPropertyForm, setShowPropertyForm] = useState(false)
  const [showDevelopmentForm, setShowDevelopmentForm] = useState(false)
  const [editingProperty, setEditingProperty] = useState<any>(null)
  const [editingDevelopment, setEditingDevelopment] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [
        propertiesRes, 
        leadsRes, 
        unreadLeadsRes,
        agentsRes, 
        featuredRes,
        developmentsRes
      ] = await Promise.all([
        supabase.from('properties').select('id', { count: 'exact', head: true }),
        supabase.from('leads').select('id', { count: 'exact', head: true }),
        supabase.from('leads').select('id', { count: 'exact', head: true }).eq('is_read', false),
        supabase.from('agents').select('id', { count: 'exact', head: true }),
        supabase.from('properties').select('id', { count: 'exact', head: true }).eq('featured', true),
        supabase.from('developments').select('id', { count: 'exact', head: true })
      ])

      setStats({
        totalProperties: propertiesRes.count || 0,
        totalLeads: leadsRes.count || 0,
        unreadLeads: unreadLeadsRes.count || 0,
        activeAgents: agentsRes.count || 0,
        featuredProperties: featuredRes.count || 0,
        totalDevelopments: developmentsRes.count || 0
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePropertyFormClose = () => {
    setShowPropertyForm(false)
    setEditingProperty(null)
    fetchStats()
  }

  const handleDevelopmentFormClose = () => {
    setShowDevelopmentForm(false)
    setEditingDevelopment(null)
    fetchStats()
  }

  const statsCards = [
    {
      title: 'Total Propiedades',
      value: stats.totalProperties,
      icon: Home,
      description: 'Propiedades activas'
    },
    {
      title: 'Leads Recibidos',
      value: stats.totalLeads,
      icon: MessageSquare,
      description: `${stats.unreadLeads} sin leer`,
      highlight: stats.unreadLeads > 0
    },
    {
      title: 'Agentes Activos',
      value: stats.activeAgents,
      icon: Users,
      description: 'Miembros del equipo'
    },
    {
      title: 'Destacadas',
      value: stats.featuredProperties,
      icon: BarChart3,
      description: 'Propiedades destacadas'
    },
    {
      title: 'Emprendimientos',
      value: stats.totalDevelopments,
      icon: Building,
      description: 'Proyectos activos'
    }
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded w-24 mb-2" />
              <div className="h-8 bg-muted rounded w-16" />
            </CardHeader>
            <CardContent>
              <div className="h-3 bg-muted rounded w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {statsCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className={stat.highlight ? 'border-orange-200 bg-orange-50' : ''}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.highlight ? 'text-orange-600' : 'text-muted-foreground'}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${stat.highlight ? 'text-orange-700' : ''}`}>
                  {stat.value}
                </div>
                <p className={`text-xs ${stat.highlight ? 'text-orange-600' : 'text-muted-foreground'}`}>
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <Button onClick={() => setShowPropertyForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Propiedad
        </Button>
        <Button variant="outline" onClick={() => setShowDevelopmentForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Emprendimiento
        </Button>
      </div>

      {/* Forms */}
      {showPropertyForm && (
        <PropertyForm
          property={editingProperty}
          onClose={handlePropertyFormClose}
          userRole={userRole}
        />
      )}

      {showDevelopmentForm && (
        <DevelopmentForm
          development={editingDevelopment}
          onClose={handleDevelopmentFormClose}
          userRole={userRole}
        />
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="properties" className="space-y-4">
        <TabsList className={`grid w-full ${userRole === 'admin' ? 'grid-cols-5' : 'grid-cols-3'}`}>
          <TabsTrigger value="properties">Propiedades</TabsTrigger>
          <TabsTrigger value="leads">
            Leads
            {stats.unreadLeads > 0 && (
              <span className="ml-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                {stats.unreadLeads}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="developments">Emprendimientos</TabsTrigger>
          {userRole === 'admin' && (
            <>
              <TabsTrigger value="users">Usuarios</TabsTrigger>
              <TabsTrigger value="analytics">Estadísticas</TabsTrigger>
            </>
          )}
        </TabsList>

        <TabsContent value="properties" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Gestión de Propiedades</h3>
              <p className="text-sm text-muted-foreground">
                Administra todas las propiedades del sistema
              </p>
            </div>
          </div>
          
          <PropertiesList 
            userRole={userRole} 
            onEdit={(property) => {
              setEditingProperty(property)
              setShowPropertyForm(true)
            }}
            onStatsChange={fetchStats}
          />
        </TabsContent>

        <TabsContent value="leads" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Gestión de Leads</h3>
              <p className="text-sm text-muted-foreground">
                Consultas y contactos de clientes interesados
              </p>
            </div>
          </div>
          
          <LeadsList 
            userRole={userRole} 
            onStatsChange={fetchStats}
          />
        </TabsContent>

        <TabsContent value="developments" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Gestión de Emprendimientos</h3>
              <p className="text-sm text-muted-foreground">
                Administra proyectos inmobiliarios y desarrollos
              </p>
            </div>
          </div>
          
          <DevelopmentsList 
            userRole={userRole}
            onEdit={(development) => {
              setEditingDevelopment(development)
              setShowDevelopmentForm(true)
            }}
            onStatsChange={fetchStats}
          />
        </TabsContent>

        {userRole === 'admin' && (
          <>
            <TabsContent value="users" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Gestión de Usuarios</h3>
                  <p className="text-sm text-muted-foreground">
                    Administra usuarios, roles y agentes
                  </p>
                </div>
              </div>
              
              <UsersList onStatsChange={fetchStats} />
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Estadísticas y Reportes</h3>
                  <p className="text-sm text-muted-foreground">
                    Métricas de rendimiento y análisis de datos
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Propiedades por Tipo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Gráfico de distribución por tipo de propiedad</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Leads por Mes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Tendencia de consultas mensuales</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  )
}
