import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })

  // Get current session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Protected routes that require authentication
  const protectedRoutes = ['/admin', '/favoritos']
  const isProtectedRoute = protectedRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  )

  // If accessing protected route without user, redirect to sign-in
  if (isProtectedRoute && !user) {
    const redirectUrl = new URL('/auth/sign-in', request.url)
    redirectUrl.searchParams.set('redirectedFrom', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Check role-based access for admin routes
  if (request.nextUrl.pathname.startsWith('/admin') && user) {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', user.id)
        .single()

      // If user doesn't have admin or agent role, redirect to home
      if (error || !profile || (profile.role !== 'admin' && profile.role !== 'agent')) {
        return NextResponse.redirect(new URL('/?error=access_denied', request.url))
      }
    } catch (error) {
      console.error('Error checking user role:', error)
      return NextResponse.redirect(new URL('/?error=role_check_failed', request.url))
    }
  }

  // Handle auth routes - redirect authenticated users away from sign-in
  if (user && request.nextUrl.pathname.startsWith('/auth/sign-in')) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     * - api routes (handled separately)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
}
