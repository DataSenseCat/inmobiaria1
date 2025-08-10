'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Mail, Phone, MessageSquare, Eye } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface LeadsListProps {
  userRole: 'admin' | 'agent'
  onStatsChange?: () => void
}

export function LeadsList({ userRole, onStatsChange }: LeadsListProps) {
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select(`
          *,
          properties (
            id,
            title,
            operation,
            type,
            city,
            price_usd
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setLeads(data || [])
    } catch (error) {
      console.error('Error fetching leads:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (leadId: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ is_read: true })
        .eq('id', leadId)

      if (error) throw error
      fetchLeads()
      onStatsChange?.()
    } catch (error) {
      console.error('Error marking lead as read:', error)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {leads.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">No hay leads disponibles</p>
          </CardContent>
        </Card>
      ) : (
        leads.map((lead) => (
          <Card 
            key={lead.id} 
            className={`hover:shadow-lg transition-shadow ${!lead.is_read ? 'border-orange-200 bg-orange-50' : ''}`}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">{lead.name}</h3>
                    {!lead.is_read && (
                      <Badge className="bg-orange-500">Nuevo</Badge>
                    )}
                    <Badge variant="outline">
                      {lead.kind === 'contacto' ? 'Contacto' : 'Tasación'}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1 mb-3">
                    {lead.email && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-4 w-4" />
                        <a href={`mailto:${lead.email}`} className="hover:text-blue-600">
                          {lead.email}
                        </a>
                      </div>
                    )}
                    {lead.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="h-4 w-4" />
                        <a href={`tel:${lead.phone}`} className="hover:text-blue-600">
                          {lead.phone}
                        </a>
                      </div>
                    )}
                  </div>
                  
                  {lead.properties && (
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-700">Propiedad de interés:</p>
                      <p className="text-sm text-gray-600">
                        {lead.properties.title} - {lead.properties.city}
                        {lead.properties.price_usd && (
                          <span className="ml-2 text-green-600 font-semibold">
                            ${lead.properties.price_usd.toLocaleString()} USD
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-700">{lead.message}</p>
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(lead.created_at).toLocaleDateString('es-AR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  {!lead.is_read && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => markAsRead(lead.id)}
                    >
                      Marcar como leído
                    </Button>
                  )}
                  
                  {lead.properties && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <a href={`/propiedad/${lead.properties.id}`} target="_blank">
                        <Eye className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  
                  {lead.phone && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <a 
                        href={`https://wa.me/${lead.phone.replace(/\D/g, '')}?text=Hola ${lead.name}, te contacto desde Inmobiliaria Catamarca`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
