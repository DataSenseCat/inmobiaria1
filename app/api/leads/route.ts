import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createRouteHandlerSupabaseClient } from '@/lib/supabase/server'

const createLeadSchema = z.object({
  property_id: z.string().uuid('ID de propiedad inválido'),
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  phone: z.string().optional(),
  email: z.string().email('Email inválido').optional(),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres')
}).refine(data => data.phone || data.email, {
  message: 'Debes proporcionar al menos un teléfono o email'
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validatedData = createLeadSchema.parse(body)
    
    // Create Supabase client
    const supabase = createRouteHandlerSupabaseClient()
    
    // Check if property exists
    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .select('id, title')
      .eq('id', validatedData.property_id)
      .single()
    
    if (propertyError || !property) {
      return NextResponse.json(
        { error: 'Propiedad no encontrada' },
        { status: 404 }
      )
    }
    
    // Create lead
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .insert([{
        property_id: validatedData.property_id,
        name: validatedData.name,
        phone: validatedData.phone || null,
        email: validatedData.email || null,
        message: validatedData.message
      }])
      .select()
      .single()
    
    if (leadError) {
      console.error('Error creating lead:', leadError)
      return NextResponse.json(
        { error: 'Error al crear el lead' },
        { status: 500 }
      )
    }
    
    // Return success response
    return NextResponse.json({
      success: true,
      data: lead,
      message: 'Lead creado exitosamente'
    }, { status: 201 })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Datos inválidos',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      )
    }
    
    console.error('Error in leads API:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerSupabaseClient()
    
    // Check if user is authenticated and has proper role
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }
    
    // Check user role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single()
    
    if (!profile || (profile.role !== 'admin' && profile.role !== 'agent')) {
      return NextResponse.json(
        { error: 'Acceso denegado' },
        { status: 403 }
      )
    }
    
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '0')
    const limit = parseInt(searchParams.get('limit') || '50')
    const propertyId = searchParams.get('property_id')
    
    // Build query
    let query = supabase
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
      .range(page * limit, (page + 1) * limit - 1)
    
    // Filter by property if specified
    if (propertyId) {
      query = query.eq('property_id', propertyId)
    }
    
    const { data: leads, error: leadsError } = await query
    
    if (leadsError) {
      console.error('Error fetching leads:', leadsError)
      return NextResponse.json(
        { error: 'Error al obtener leads' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: leads,
      pagination: {
        page,
        limit,
        hasMore: (leads?.length || 0) === limit
      }
    })
    
  } catch (error) {
    console.error('Error in leads GET API:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
