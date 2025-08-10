import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function POST(request: NextRequest) {
  try {
    // Verify the webhook secret
    const webhookSecret = process.env.BUILDER_WEBHOOK_SECRET
    
    if (!webhookSecret || webhookSecret === 'REEMPLAZAR_CON_TU_SECRET') {
      console.warn('Builder webhook secret not configured')
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      )
    }
    
    // Check authorization header
    const authHeader = request.headers.get('authorization')
    const providedSecret = authHeader?.replace('Bearer ', '')
    
    if (providedSecret !== webhookSecret) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Parse the webhook payload
    const body = await request.json()
    
    // Extract relevant information from Builder webhook
    const { 
      modelName, 
      publishedUrl, 
      data: builderData 
    } = body
    
    console.log('Builder webhook received:', {
      modelName,
      publishedUrl,
      timestamp: new Date().toISOString()
    })
    
    // Revalidate based on the model and URL
    const pathsToRevalidate: string[] = []
    
    if (modelName === 'page') {
      // If it's a page model, revalidate the specific URL
      if (publishedUrl) {
        const url = new URL(publishedUrl)
        const pathname = url.pathname
        pathsToRevalidate.push(pathname)
        
        // Also revalidate the catch-all route pattern
        if (pathname !== '/') {
          pathsToRevalidate.push(`/[...page]`)
        }
      }
      
      // Always revalidate the homepage
      pathsToRevalidate.push('/')
      pathsToRevalidate.push('/inicio')
    }
    
    // Revalidate all specified paths
    for (const path of pathsToRevalidate) {
      try {
        revalidatePath(path)
        console.log(`Revalidated path: ${path}`)
      } catch (error) {
        console.error(`Error revalidating path ${path}:`, error)
      }
    }
    
    // Also revalidate any Builder-related tags
    revalidateTag('builder-content')
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Content revalidated successfully',
      revalidatedPaths: pathsToRevalidate,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Error in revalidate webhook:', error)
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Handle GET requests for testing
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Builder.io revalidation webhook endpoint',
    timestamp: new Date().toISOString(),
    methods: ['POST'],
    description: 'Use POST with proper authorization to trigger revalidation'
  })
}
