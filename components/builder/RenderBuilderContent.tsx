'use client'

import { BuilderComponent, useIsPreviewing } from '@builder.io/react'
import { BuilderContent } from '@builder.io/sdk'

interface RenderBuilderContentProps {
  content: BuilderContent | null
}

export function RenderBuilderContent({ content }: RenderBuilderContentProps) {
  const isPreviewing = useIsPreviewing()

  if (!content && !isPreviewing) {
    return <div>Página no encontrada</div>
  }

  return (
    <BuilderComponent 
      model="page" 
      content={content} 
    />
  )
}
