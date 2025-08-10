'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const createPropertySchema = z.object({
  title: z.string().min(5, 'El título debe tener al menos 5 caracteres'),
  operation: z.enum(['venta', 'alquiler']),
  type: z.enum(['casa', 'departamento', 'ph', 'lote', 'local']),
  price_usd: z.number().positive().optional(),
  price_ars: z.number().positive().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  province: z.string().default('Catamarca'),
  rooms: z.number().int().positive().optional(),
  bathrooms: z.number().int().positive().optional(),
  area_covered: z.number().positive().optional(),
  area_total: z.number().positive().optional(),
  description: z.string().optional(),
  featured: z.boolean().default(false),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number()
  }).optional(),
  agent_id: z.string().uuid().optional()
})

const updatePropertySchema = createPropertySchema.partial()

type CreatePropertyInput = z.infer<typeof createPropertySchema>
type UpdatePropertyInput = z.infer<typeof updatePropertySchema>

export async function createProperty(input: CreatePropertyInput) {
  try {
    // Validate input
    const validatedData = createPropertySchema.parse(input)
    
    // Create Supabase client
    const supabase = createClient()
    
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
    
    // Prepare coordinates for PostGIS
    let coordinates = null
    if (validatedData.coordinates) {
      coordinates = `POINT(${validatedData.coordinates.lng} ${validatedData.coordinates.lat})`
    }
    
    // Create property
    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .insert([{
        ...validatedData,
        coordinates: coordinates ? supabase.rpc('st_geogfromtext', { geog_text: coordinates }) : null
      }])
      .select()
      .single()
    
    if (propertyError) {
      console.error('Error creating property:', propertyError)
      return {
        success: false,
        error: 'Error al crear la propiedad'
      }
    }
    
    // Revalidate pages
    revalidatePath('/admin')
    revalidatePath('/')
    
    return {
      success: true,
      data: property
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
    
    console.error('Error in createProperty action:', error)
    return {
      success: false,
      error: 'Error interno del servidor'
    }
  }
}

export async function updateProperty(propertyId: string, input: UpdatePropertyInput) {
  try {
    // Validate input
    const validatedData = updatePropertySchema.parse(input)
    
    // Create Supabase client
    const supabase = createClient()
    
    // Check if user is authenticated and has proper role
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return {
        success: false,
        error: 'No autorizado'
      }
    }
    
    // Check user role and ownership
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
    
    // For agents, check if they own the property
    if (profile.role === 'agent') {
      const { data: propertyOwnership } = await supabase
        .from('properties')
        .select(`
          agent_id,
          agent:agents(email)
        `)
        .eq('id', propertyId)
        .single()
      
      const { data: userEmail } = await supabase.auth.getUser()
      
      if (!propertyOwnership?.agent || propertyOwnership.agent.email !== userEmail.user?.email) {
        return {
          success: false,
          error: 'Solo puedes editar tus propias propiedades'
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
    
    // Update property
    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .update(updateData)
      .eq('id', propertyId)
      .select()
      .single()
    
    if (propertyError) {
      console.error('Error updating property:', propertyError)
      return {
        success: false,
        error: 'Error al actualizar la propiedad'
      }
    }
    
    // Revalidate pages
    revalidatePath('/admin')
    revalidatePath(`/propiedad/${propertyId}`)
    revalidatePath('/')
    
    return {
      success: true,
      data: property
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
    
    console.error('Error in updateProperty action:', error)
    return {
      success: false,
      error: 'Error interno del servidor'
    }
  }
}

export async function deleteProperty(propertyId: string) {
  try {
    const supabase = createClient()
    
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
    
    // For agents, check if they own the property
    if (profile.role === 'agent') {
      const { data: propertyOwnership } = await supabase
        .from('properties')
        .select(`
          agent_id,
          agent:agents(email)
        `)
        .eq('id', propertyId)
        .single()
      
      const { data: userEmail } = await supabase.auth.getUser()
      
      if (!propertyOwnership?.agent || propertyOwnership.agent.email !== userEmail.user?.email) {
        return {
          success: false,
          error: 'Solo puedes eliminar tus propias propiedades'
        }
      }
    }
    
    // Delete property (cascades to images and leads)
    const { error: deleteError } = await supabase
      .from('properties')
      .delete()
      .eq('id', propertyId)
    
    if (deleteError) {
      console.error('Error deleting property:', deleteError)
      return {
        success: false,
        error: 'Error al eliminar la propiedad'
      }
    }
    
    // Revalidate pages
    revalidatePath('/admin')
    revalidatePath('/')
    
    return {
      success: true
    }
    
  } catch (error) {
    console.error('Error in deleteProperty action:', error)
    return {
      success: false,
      error: 'Error interno del servidor'
    }
  }
}

export async function togglePropertyFeatured(propertyId: string, featured: boolean) {
  try {
    const supabase = createClient()
    
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
    
    // Update featured status
    const { error: updateError } = await supabase
      .from('properties')
      .update({ featured: !featured })
      .eq('id', propertyId)
    
    if (updateError) {
      console.error('Error updating featured status:', updateError)
      return {
        success: false,
        error: 'Error al actualizar el estado destacado'
      }
    }
    
    // Revalidate pages
    revalidatePath('/admin')
    revalidatePath(`/propiedad/${propertyId}`)
    revalidatePath('/')
    
    return {
      success: true
    }
    
  } catch (error) {
    console.error('Error in togglePropertyFeatured action:', error)
    return {
      success: false,
      error: 'Error interno del servidor'
    }
  }
}

export async function uploadPropertyImage(propertyId: string, formData: FormData) {
  try {
    const supabase = createClient()
    
    // Check if user is authenticated and has proper role
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return {
        success: false,
        error: 'No autorizado'
      }
    }
    
    const file = formData.get('file') as File
    if (!file) {
      return {
        success: false,
        error: 'No se proporcionó ningún archivo'
      }
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      return {
        success: false,
        error: 'El archivo debe ser una imagen'
      }
    }
    
    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${propertyId}/${Date.now()}.${fileExt}`
    
    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('property-images')
      .upload(fileName, file)
    
    if (uploadError) {
      console.error('Error uploading image:', uploadError)
      return {
        success: false,
        error: 'Error al subir la imagen'
      }
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('property-images')
      .getPublicUrl(fileName)
    
    // Save image record in database
    const { data: image, error: imageError } = await supabase
      .from('images')
      .insert([{
        property_id: propertyId,
        url: publicUrl,
        alt: `Imagen de propiedad ${propertyId}`
      }])
      .select()
      .single()
    
    if (imageError) {
      console.error('Error saving image record:', imageError)
      return {
        success: false,
        error: 'Error al guardar el registro de imagen'
      }
    }
    
    // Revalidate pages
    revalidatePath('/admin')
    revalidatePath(`/propiedad/${propertyId}`)
    
    return {
      success: true,
      data: image
    }
    
  } catch (error) {
    console.error('Error in uploadPropertyImage action:', error)
    return {
      success: false,
      error: 'Error interno del servidor'
    }
  }
}
