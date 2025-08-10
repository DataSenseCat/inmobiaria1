'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

const updateProfileRoleSchema = z.object({
  userId: z.string().uuid('ID de usuario inválido'),
  role: z.enum(['admin', 'agent', 'user'], { required_error: 'Rol requerido' })
})

const createAgentSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  phone: z.string().optional(),
  email: z.string().email('Email inválido'),
  user_id: z.string().uuid('ID de usuario inválido').optional()
})

const updateAgentSchema = createAgentSchema.partial().extend({
  id: z.string().uuid('ID de agente inválido')
})

type UpdateProfileRoleInput = z.infer<typeof updateProfileRoleSchema>
type CreateAgentInput = z.infer<typeof createAgentSchema>
type UpdateAgentInput = z.infer<typeof updateAgentSchema>

async function checkAdminPermissions(supabase: any) {
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return { authorized: false, error: 'No autorizado' }
  }
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .single()
  
  if (!profile || profile.role !== 'admin') {
    return { authorized: false, error: 'Acceso denegado - Solo administradores' }
  }
  
  return { authorized: true, user, profile }
}

export async function setProfileRole(input: UpdateProfileRoleInput) {
  try {
    const validatedData = updateProfileRoleSchema.parse(input)
    const supabase = createClient()
    
    const { authorized, error } = await checkAdminPermissions(supabase)
    if (!authorized) {
      return { success: false, error }
    }
    
    // Update profile role
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ role: validatedData.role })
      .eq('user_id', validatedData.userId)
    
    if (updateError) {
      console.error('Error updating profile role:', updateError)
      return {
        success: false,
        error: 'Error al actualizar el rol del usuario'
      }
    }
    
    revalidatePath('/admin')
    
    return {
      success: true
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
    
    console.error('Error in setProfileRole action:', error)
    return {
      success: false,
      error: 'Error interno del servidor'
    }
  }
}

export async function createAgent(input: CreateAgentInput) {
  try {
    const validatedData = createAgentSchema.parse(input)
    const supabase = createClient()
    
    const { authorized, error } = await checkAdminPermissions(supabase)
    if (!authorized) {
      return { success: false, error }
    }
    
    // Check if email already exists
    const { data: existingAgent } = await supabase
      .from('agents')
      .select('id')
      .eq('email', validatedData.email)
      .single()
    
    if (existingAgent) {
      return {
        success: false,
        error: 'Ya existe un agente con este email'
      }
    }
    
    // Create agent
    const { data: agent, error: agentError } = await supabase
      .from('agents')
      .insert([validatedData])
      .select()
      .single()
    
    if (agentError) {
      console.error('Error creating agent:', agentError)
      return {
        success: false,
        error: 'Error al crear el agente'
      }
    }
    
    revalidatePath('/admin')
    
    return {
      success: true,
      data: agent
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
    
    console.error('Error in createAgent action:', error)
    return {
      success: false,
      error: 'Error interno del servidor'
    }
  }
}

export async function updateAgent(input: UpdateAgentInput) {
  try {
    const validatedData = updateAgentSchema.parse(input)
    const supabase = createClient()
    
    const { authorized, error, user, profile } = await checkAdminPermissions(supabase)
    if (!authorized) {
      return { success: false, error }
    }
    
    const { id, ...updateData } = validatedData
    
    // Update agent
    const { data: agent, error: agentError } = await supabase
      .from('agents')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()
    
    if (agentError) {
      console.error('Error updating agent:', agentError)
      return {
        success: false,
        error: 'Error al actualizar el agente'
      }
    }
    
    revalidatePath('/admin')
    
    return {
      success: true,
      data: agent
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
    
    console.error('Error in updateAgent action:', error)
    return {
      success: false,
      error: 'Error interno del servidor'
    }
  }
}

export async function deleteAgent(agentId: string) {
  try {
    const supabase = createClient()
    
    const { authorized, error } = await checkAdminPermissions(supabase)
    if (!authorized) {
      return { success: false, error }
    }
    
    // Delete agent (this will set agent_id to null in related properties)
    const { error: deleteError } = await supabase
      .from('agents')
      .delete()
      .eq('id', agentId)
    
    if (deleteError) {
      console.error('Error deleting agent:', deleteError)
      return {
        success: false,
        error: 'Error al eliminar el agente'
      }
    }
    
    revalidatePath('/admin')
    
    return {
      success: true
    }
    
  } catch (error) {
    console.error('Error in deleteAgent action:', error)
    return {
      success: false,
      error: 'Error interno del servidor'
    }
  }
}

export async function listProfiles(filters?: {
  role?: 'admin' | 'agent' | 'user'
  limit?: number
  offset?: number
}) {
  try {
    const supabase = createClient()
    
    const { authorized, error } = await checkAdminPermissions(supabase)
    if (!authorized) {
      return { success: false, error }
    }
    
    let query = supabase
      .from('profiles')
      .select(`
        user_id,
        role,
        created_at,
        agents(id, name, email, phone)
      `)
    
    if (filters?.role) {
      query = query.eq('role', filters.role)
    }
    
    query = query
      .order('created_at', { ascending: false })
      .range(filters?.offset || 0, (filters?.offset || 0) + (filters?.limit || 50) - 1)
    
    const { data: profiles, error: profilesError } = await query
    
    if (profilesError) {
      console.error('Error fetching profiles:', profilesError)
      return {
        success: false,
        error: 'Error al obtener los perfiles'
      }
    }
    
    return {
      success: true,
      data: profiles || []
    }
    
  } catch (error) {
    console.error('Error in listProfiles action:', error)
    return {
      success: false,
      error: 'Error interno del servidor'
    }
  }
}

export async function getCurrentUserProfile() {
  try {
    const supabase = createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return {
        success: false,
        error: 'No autorizado'
      }
    }
    
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select(`
        user_id,
        role,
        created_at,
        agents(id, name, email, phone)
      `)
      .eq('user_id', user.id)
      .single()
    
    if (profileError) {
      console.error('Error fetching current user profile:', profileError)
      return {
        success: false,
        error: 'Error al obtener el perfil del usuario'
      }
    }
    
    return {
      success: true,
      data: {
        ...profile,
        email: user.email
      }
    }
    
  } catch (error) {
    console.error('Error in getCurrentUserProfile action:', error)
    return {
      success: false,
      error: 'Error interno del servidor'
    }
  }
}
