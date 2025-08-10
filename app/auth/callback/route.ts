import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const redirectTo = requestUrl.searchParams.get('redirectTo')

  if (code) {
    const supabase = createClient()
    
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Auth callback error:', error)
        return NextResponse.redirect(
          new URL('/auth/sign-in?error=auth_error', requestUrl.origin)
        )
      }
      
      // Successful authentication
      const finalRedirect = redirectTo || '/'
      return NextResponse.redirect(new URL(finalRedirect, requestUrl.origin))
      
    } catch (error) {
      console.error('Auth callback error:', error)
      return NextResponse.redirect(
        new URL('/auth/sign-in?error=auth_error', requestUrl.origin)
      )
    }
  }

  // No code parameter
  return NextResponse.redirect(
    new URL('/auth/sign-in?error=no_code', requestUrl.origin)
  )
}
