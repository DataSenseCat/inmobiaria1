'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Trash2, MessageCircle, Eye, Calendar } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Lead, Property } from '@/lib/supabase/types'
import Link from 'next/link'

interface LeadsListProps {
  userRole: 'admin' | 'agent'
}

type LeadWithProperty = Lead & {
  property: Property
}

export default function LeadsList({ userRole }: LeadsListProps) {
  const [leads, setLeads] = useState<LeadWithProperty[]>([])
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
          property:properties (
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

  const deleteLead = async (leadId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este lead?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', leadId)

      if (error) throw error
      
      setLeads(prev => prev.filter(lead => lead.id !== leadId))
    } catch (error) {
      console.error('Error deleting lead:', error)
    }
  }

  const handleWhatsApp = (phone: string, message: string) => {
    const cleanPhone = phone.replace(/\D/g, '')
    const encodedMessage = encodeURIComponent(`Hola! Te contacto por tu consulta: "${message}"`)
    const url = `https://wa.me/549${cleanPhone}?text=${encodedMessage}`
    window.open(url, '_blank')
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <div className="h-4 bg-muted rounded w-1/3" />
                  <div className="h-4 bg-muted rounded w-20" />
                </div>
                <div className="h-3 bg-muted rounded w-1/4" />
                <div className="h-12 bg-muted rounded w-full" />
              </div>
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
            <p className="text-muted-foreground">No hay leads registrados</p>
          </CardContent>
        </Card>
      ) : (
        leads.map((lead) => (
          <Card key={lead.id}>
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg">{lead.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {new Date(lead.created_at).toLocaleString('es-AR')}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {lead.phone && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleWhatsApp(lead.phone!, lead.message || '')}
                        className="text-green-600 hover:text-green-700"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    )}
                    
                    <Button variant="outline" size="icon" asChild>
                      <Link href={`/propiedad/${lead.property.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => deleteLead(lead.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="flex flex-wrap gap-4 text-sm">
                  {lead.phone && (
                    <div>
                      <span className="font-medium">Teléfono:</span> {lead.phone}
                    </div>
                  )}
                  {lead.email && (
                    <div>
                      <span className="font-medium">Email:</span> {lead.email}
                    </div>
                  )}
                </div>

                {/* Property Info */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{lead.property.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {lead.property.city}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Badge variant={lead.property.operation === 'venta' ? 'default' : 'secondary'}>
                        {lead.property.operation === 'venta' ? 'Venta' : 'Alquiler'}
                      </Badge>
                      
                      <Badge variant="outline">
                        {lead.property.type === 'casa' ? 'Casa' :
                         lead.property.type === 'departamento' ? 'Departamento' :
                         lead.property.type === 'ph' ? 'PH' :
                         lead.property.type === 'lote' ? 'Lote' : 'Local'}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Message */}
                {lead.message && (
                  <div>
                    <h4 className="font-medium mb-2">Mensaje:</h4>
                    <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                      {lead.message}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
