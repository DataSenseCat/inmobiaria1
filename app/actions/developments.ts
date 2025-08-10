'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

const createDevelopmentSchema = z.object({
  title: z.string().min(5, 'El título debe tener al menos 5 caracteres'),
  status: z.enum(['planificacion', 'construccion', 'finalizado']).default('planificacion'),
  address: z.string().optional(),
  city: z.string().optional(),
  province: z.string().default('Catamarca'),
  description: z.string().optional(),
  hero_url: z.string().url('URL de imagen inválida').optional(),
  amenities: z.array(z.string()).optional(),
  progress: z.number().int().min(0).max(100).default(0),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number()
  }).optional(),
  agent_id: z.string().uuid().optional()
})

const updateDevelopmentSchema = createDevelopmentSchema.partial()

type CreateDevelopmentInput = z.infer<typeof createDevelopmentSchema>
type UpdateDevelopmentInput = z.infer<typeof updateDevelopmentSchema>

async function checkUserPermissions(supabase: any, allowedRoles: string[] = ['admin', 'agent']) {
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return { authorized: false, error: 'No autorizado' }
  }
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .single()
  
  if (!profile || !allowedRoles.includes(profile.role)) {
    return { authorized: false, error: 'Acceso denegado' }
  }
  
  return { authorized: true, user, profile }
}

export async function createDevelopment(input: CreateDevelopmentInput) {
  try {
    const validatedData = createDevelopmentSchema.parse(input)
    const supabase = createClient()
    
    const { authorized, error, user, profile } = await checkUserPermissions(supabase)
    if (!authorized) {
      return { success: false, error }
    }
    
    // Prepare coordinates for PostGIS
    let coordinates = null
    if (validatedData.coordinates) {
      coordinates = `POINT(${validatedData.coordinates.lng} ${validatedData.coordinates.lat})`
    }
    
    // Create development
    const { data: development, error: developmentError } = await supabase
      .from('developments')
      .insert([{
        ...validatedData,
        coordinates: coordinates ? supabase.rpc('st_geogfromtext', { geog_text: coordinates }) : null
      }])
      .select()
      .single()
    
    if (developmentError) {
      console.error('Error creating development:', developmentError)
      return {
        success: false,
        error: 'Error al crear el emprendimiento'
      }
    }
    
    revalidatePath('/admin')
    revalidatePath('/emprendimientos')
    revalidatePath('/')
    
    return {
      success: true,
      data: development
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
    
    console.error('Error in createDevelopment action:', error)
    return {
      success: false,
      error: 'Error interno del servidor'
    }
  }
}

export async function updateDevelopment(developmentId: string, input: UpdateDevelopmentInput) {
  try {
    const validatedData = updateDevelopmentSchema.parse(input)
    const supabase = createClient()
    
    const { authorized, error, user, profile } = await checkUserPermissions(supabase)
    if (!authorized) {
      return { success: false, error }
    }
    
    // For agents, check if they own the development
    if (profile.role === 'agent') {
      const { data: developmentOwnership } = await supabase
        .from('developments')
        .select(`
          agent_id,
          agents(email)
        `)
        .eq('id', developmentId)
        .single()
      
      if (!developmentOwnership?.agents || developmentOwnership.agents.email !== user.email) {
        return {
          success: false,
          error: 'Solo puedes editar tus propios emprendimientos'
        }
      }
    }
    
    // Prepare coordinates for PostGIS
    let updateData = { ...validatedData }
    if (validatedData.coordinates) {
      updateData.coordinates = supabase.rpc('st_geogfromtext', { 
        geog_text: `POINT(${validatedData.coordinates.lng} ${validatedData.coordinates.lat})` 
      })
    }
    
    const { data: development, error: developmentError } = await supabase
      .from('developments')
      .update(updateData)
      .eq('id', developmentId)
      .select()
      .single()
    
    if (developmentError) {
      console.error('Error updating development:', developmentError)
      return {
        success: false,
        error: 'Error al actualizar el emprendimiento'
      }
    }
    
    revalidatePath('/admin')
    revalidatePath(`/emprendimientos/${developmentId}`)
    revalidatePath('/emprendimientos')
    revalidatePath('/')
    
    return {
      success: true,
      data: development
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
    
    console.error('Error in updateDevelopment action:', error)
    return {
      success: false,
      error: 'Error interno del servidor'
    }
  }
}

export async function deleteDevelopment(developmentId: string) {
  try {
    const supabase = createClient()
    
    const { authorized, error, user, profile } = await checkUserPermissions(supabase)
    if (!authorized) {
      return { success: false, error }
    }
    
    // For agents, check if they own the development
    if (profile.role === 'agent') {
      const { data: developmentOwnership } = await supabase
        .from('developments')
        .select(`
          agent_id,
          agents(email)
        `)
        .eq('id', developmentId)
        .single()
      
      if (!developmentOwnership?.agents || developmentOwnership.agents.email !== user.email) {
        return {
          success: false,
          error: 'Solo puedes eliminar tus propios emprendimientos'
        }
      }
    }
    
    const { error: deleteError } = await supabase
      .from('developments')
      .delete()
      .eq('id', developmentId)
    
    if (deleteError) {
      console.error('Error deleting development:', deleteError)
      return {
        success: false,
        error: 'Error al eliminar el emprendimiento'
      }
    }
    
    revalidatePath('/admin')
    revalidatePath('/emprendimientos')
    revalidatePath('/')
    
    return {
      success: true
    }
    
  } catch (error) {
    console.error('Error in deleteDevelopment action:', error)
    return {
      success: false,
      error: 'Error interno del servidor'
    }
  }
}

export async function updateDevelopmentProgress(developmentId: string, progress: number) {
  try {
    const supabase = createClient()
    
    const { authorized, error, user, profile } = await checkUserPermissions(supabase)
    if (!authorized) {
      return { success: false, error }
    }
    
    // Validate progress
    if (progress < 0 || progress > 100) {
      return {
        success: false,
        error: 'El progreso debe estar entre 0 y 100'
      }
    }
    
    const { error: updateError } = await supabase
      .from('developments')
      .update({ 
        progress,
        // Auto-update status based on progress
        status: progress === 100 ? 'finalizado' : progress > 0 ? 'construccion' : 'planificacion'
      })
      .eq('id', developmentId)
    
    if (updateError) {
      console.error('Error updating development progress:', updateError)
      return {
        success: false,
        error: 'Error al actualizar el progreso'
      }
    }
    
    revalidatePath('/admin')
    revalidatePath(`/emprendimientos/${developmentId}`)
    revalidatePath('/emprendimientos')
    
    return {
      success: true
    }
    
  } catch (error) {
    console.error('Error in updateDevelopmentProgress action:', error)
    return {
      success: false,
      error: 'Error interno del servidor'
    }
  }
}
