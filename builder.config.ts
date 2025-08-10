import { Builder } from '@builder.io/react'

export const builderConfig = {
  apiKey: process.env.NEXT_PUBLIC_BUILDER_API_KEY!,
  models: [
    {
      name: 'page',
      kind: 'page',
      description: 'Páginas del sitio web'
    },
    {
      name: 'home',
      kind: 'page', 
      description: 'Página de inicio específica'
    }
  ]
}

// Initialize Builder
if (typeof window !== 'undefined' && builderConfig.apiKey) {
  Builder.init(builderConfig.apiKey)
}

export default Builder
