'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Home, MessageSquare, Users, BarChart3 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import PropertiesList from './PropertiesList'
import LeadsList from './LeadsList'

interface AdminDashboardProps {
  userRole: 'admin' | 'agent'
}

interface DashboardStats {
  totalProperties: number
  totalLeads: number
  activeAgents: number
  featuredProperties: number
}

export default function AdminDashboard({ userRole }: AdminDashboardProps) {
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    totalLeads: 0,
    activeAgents: 0,
    featuredProperties: 0
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [propertiesRes, leadsRes, agentsRes, featuredRes] = await Promise.all([
        supabase.from('properties').select('id', { count: 'exact', head: true }),
        supabase.from('leads').select('id', { count: 'exact', head: true }),
        supabase.from('agents').select('id', { count: 'exact', head: true }),
        supabase.from('properties').select('id', { count: 'exact', head: true }).eq('featured', true)
      ])

      setStats({
        totalProperties: propertiesRes.count || 0,
        totalLeads: leadsRes.count || 0,
        activeAgents: agentsRes.count || 0,
        featuredProperties: featuredRes.count || 0
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
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
      description: 'Consultas de clientes'
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
    }
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="properties" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="properties">Propiedades</TabsTrigger>
          <TabsTrigger value="leads">Leads</TabsTrigger>
        </TabsList>

        <TabsContent value="properties" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Gestión de Propiedades</h3>
              <p className="text-sm text-muted-foreground">
                Administra todas las propiedades del sistema
              </p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Propiedad
            </Button>
          </div>
          
          <PropertiesList userRole={userRole} />
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
          
          <LeadsList userRole={userRole} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
