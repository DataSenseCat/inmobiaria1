'use server'

import { z } from 'zod'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

const createLeadSchema = z.object({
  kind: z.enum(['contacto', 'tasacion'], { required_error: 'Tipo de lead requerido' }),
  property_id: z.string().uuid('ID de propiedad inválido').optional(),
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  phone: z.string().optional(),
  email: z.string().email('Email inválido').optional(),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres')
}).refine(data => data.phone || data.email, {
  message: 'Debes proporcionar al menos un teléfono o email'
})

type CreateLeadInput = z.infer<typeof createLeadSchema>

export async function createLead(input: CreateLeadInput) {
  try {
    // Validate input
    const validatedData = createLeadSchema.parse(input)
    
    // Create Supabase client
    const supabase = createServerSupabaseClient()
    
    // Check if property exists (only for property-related leads)
    if (validatedData.property_id) {
      const { data: property, error: propertyError } = await supabase
        .from('properties')
        .select('id, title')
        .eq('id', validatedData.property_id)
        .single()

      if (propertyError || !property) {
        return {
          success: false,
          error: 'Propiedad no encontrada'
        }
      }
    }
    
    // Create lead
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .insert([{
        kind: validatedData.kind,
        property_id: validatedData.property_id || null,
        name: validatedData.name,
        phone: validatedData.phone || null,
        email: validatedData.email || null,
        message: validatedData.message,
        is_read: false
      }])
      .select()
      .single()
    
    if (leadError) {
      console.error('Error creating lead:', leadError)
      return {
        success: false,
        error: 'Error al crear el lead'
      }
    }
    
    // Revalidate admin pages to show new lead
    revalidatePath('/admin')
    
    return {
      success: true,
      data: lead
    }
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Datos inválidos',
        details: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      }
    }
    
    console.error('Error in createLead action:', error)
    return {
      success: false,
      error: 'Error interno del servidor'
    }
  }
}

export async function deleteLead(leadId: string) {
  try {
    const supabase = createServerSupabaseClient()

    // Check if user is authenticated and has proper role
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        success: false,
        error: 'No autorizado'
      }
    }

    // Check user role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (!profile || (profile.role !== 'admin' && profile.role !== 'agent')) {
      return {
        success: false,
        error: 'Acceso denegado'
      }
    }

    // Delete lead
    const { error: deleteError } = await supabase
      .from('leads')
      .delete()
      .eq('id', leadId)

    if (deleteError) {
      console.error('Error deleting lead:', deleteError)
      return {
        success: false,
        error: 'Error al eliminar el lead'
      }
    }

    // Revalidate admin pages
    revalidatePath('/admin')

    return {
      success: true
    }

  } catch (error) {
    console.error('Error in deleteLead action:', error)
    return {
      success: false,
      error: 'Error interno del servidor'
    }
  }
}

export async function markLeadAsRead(leadId: string) {
  try {
    const supabase = createServerSupabaseClient()

    // Check if user is authenticated and has proper role
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        success: false,
        error: 'No autorizado'
      }
    }

    // Check user role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (!profile || (profile.role !== 'admin' && profile.role !== 'agent')) {
      return {
        success: false,
        error: 'Acceso denegado'
      }
    }

    // Mark lead as read
    const { error: updateError } = await supabase
      .from('leads')
      .update({ is_read: true })
      .eq('id', leadId)

    if (updateError) {
      console.error('Error marking lead as read:', updateError)
      return {
        success: false,
        error: 'Error al marcar el lead como leído'
      }
    }

    // Revalidate admin pages
    revalidatePath('/admin')

    return {
      success: true
    }

  } catch (error) {
    console.error('Error in markLeadAsRead action:', error)
    return {
      success: false,
      error: 'Error interno del servidor'
    }
  }
}

export async function listLeads(filters?: {
  kind?: 'contacto' | 'tasacion'
  is_read?: boolean
  date_from?: string
  date_to?: string
  limit?: number
  offset?: number
}) {
  try {
    const supabase = createServerSupabaseClient()

    // Check if user is authenticated and has proper role
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        success: false,
        error: 'No autorizado'
      }
    }

    // Check user role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (!profile || (profile.role !== 'admin' && profile.role !== 'agent')) {
      return {
        success: false,
        error: 'Acceso denegado'
      }
    }

    // Build query
    let query = supabase
      .from('leads')
      .select(`
        *,
        properties (
          title,
          address,
          city
        )
      `)

    // Apply filters
    if (filters?.kind) {
      query = query.eq('kind', filters.kind)
    }

    if (filters?.is_read !== undefined) {
      query = query.eq('is_read', filters.is_read)
    }

    if (filters?.date_from) {
      query = query.gte('created_at', filters.date_from)
    }

    if (filters?.date_to) {
      query = query.lte('created_at', filters.date_to)
    }

    // For agents, only show leads for their properties
    if (profile.role === 'agent') {
      // Get agent record
      const { data: agent } = await supabase
        .from('agents')
        .select('id')
        .eq('email', user.email)
        .single()

      if (agent) {
        query = query.or(`property_id.is.null,properties.agent_id.eq.${agent.id}`)
      }
    }

    // Apply pagination and ordering
    query = query
      .order('created_at', { ascending: false })
      .range(filters?.offset || 0, (filters?.offset || 0) + (filters?.limit || 50) - 1)

    const { data: leads, error: leadsError } = await query

    if (leadsError) {
      console.error('Error fetching leads:', leadsError)
      return {
        success: false,
        error: 'Error al obtener los leads'
      }
    }

    return {
      success: true,
      data: leads || []
    }

  } catch (error) {
    console.error('Error in listLeads action:', error)
    return {
      success: false,
      error: 'Error interno del servidor'
    }
  }
}
