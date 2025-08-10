'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleFavorite(propertyId: string) {
  try {
    const supabase = createServerSupabaseClient()
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return {
        success: false,
        error: 'Debes iniciar sesión para agregar favoritos'
      }
    }
    
    // Check if property exists
    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .select('id')
      .eq('id', propertyId)
      .single()
    
    if (propertyError || !property) {
      return {
        success: false,
        error: 'Propiedad no encontrada'
      }
    }
    
    // Check if favorite already exists
    const { data: existingFavorite } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', user.id)
      .eq('property_id', propertyId)
      .single()
    
    if (existingFavorite) {
      // Remove from favorites
      const { error: deleteError } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('property_id', propertyId)
      
      if (deleteError) {
        console.error('Error removing favorite:', deleteError)
        return {
          success: false,
          error: 'Error al quitar de favoritos'
        }
      }
      
      // Revalidate favorites page
      revalidatePath('/favoritos')
      
      return {
        success: true,
        action: 'removed',
        message: 'Propiedad quitada de favoritos'
      }
    } else {
      // Add to favorites
      const { error: insertError } = await supabase
        .from('favorites')
        .insert({
          user_id: user.id,
          property_id: propertyId
        })
      
      if (insertError) {
        console.error('Error adding favorite:', insertError)
        return {
          success: false,
          error: 'Error al agregar a favoritos'
        }
      }
      
      // Revalidate favorites page
      revalidatePath('/favoritos')
      
      return {
        success: true,
        action: 'added',
        message: 'Propiedad agregada a favoritos'
      }
    }
    
  } catch (error) {
    console.error('Error in toggleFavorite action:', error)
    return {
      success: false,
      error: 'Error interno del servidor'
    }
  }
}

export async function getFavorites() {
  try {
    const supabase = createServerSupabaseClient()
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return {
        success: false,
        error: 'Debes iniciar sesión para ver tus favoritos'
      }
    }
    
    // Get user's favorites
    const { data: favorites, error: favoritesError } = await supabase
      .from('favorites')
      .select(`
        property_id,
        property:properties (
          *,
          images (id, url, alt),
          agent:agents (id, name, phone, email)
        )
      `)
      .eq('user_id', user.id)
      .order('property_id')
    
    if (favoritesError) {
      console.error('Error fetching favorites:', favoritesError)
      return {
        success: false,
        error: 'Error al obtener favoritos'
      }
    }
    
    return {
      success: true,
      data: favorites || []
    }
    
  } catch (error) {
    console.error('Error in getFavorites action:', error)
    return {
      success: false,
      error: 'Error interno del servidor'
    }
  }
}

export async function isFavorite(propertyId: string) {
  try {
    const supabase = createServerSupabaseClient()
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return {
        success: true,
        isFavorite: false
      }
    }
    
    // Check if property is in user's favorites
    const { data: favorite, error: favoriteError } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', user.id)
      .eq('property_id', propertyId)
      .single()
    
    if (favoriteError && favoriteError.code !== 'PGRST116') {
      console.error('Error checking favorite status:', favoriteError)
      return {
        success: false,
        error: 'Error al verificar estado de favorito'
      }
    }
    
    return {
      success: true,
      isFavorite: !!favorite
    }
    
  } catch (error) {
    console.error('Error in isFavorite action:', error)
    return {
      success: false,
      error: 'Error interno del servidor'
    }
  }
}
