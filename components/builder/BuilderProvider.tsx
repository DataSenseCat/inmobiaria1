'use client'

import { Builder } from '@builder.io/react'
import { ReactNode, useEffect } from 'react'

interface BuilderProviderProps {
  children: ReactNode
}

export function BuilderProvider({ children }: BuilderProviderProps) {
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_BUILDER_API_KEY
    
    if (apiKey && apiKey !== 'REEMPLAZAR_CON_TU_PUBLIC_API_KEY') {
      try {
        Builder.init(apiKey)
        
        // Configure preview mode
        if (typeof window !== 'undefined') {
          Builder.isStatic = false
          Builder.isBrowser = true
        }
      } catch (error) {
        console.warn('Builder.io initialization error:', error)
      }
    } else {
      console.warn('Builder.io API key not configured. Using fallback content.')
    }
  }, [])

  return <>{children}</>
}
