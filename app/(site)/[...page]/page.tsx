import { builder } from '@builder.io/sdk'
import { RenderBuilderContent } from '@/components/builder/RenderBuilderContent'
import Header from '@/components/layout/Header'
import HeroSection from '@/components/layout/HeroSection'
import PropertyGrid from '@/components/properties/PropertyGrid'

// Configure Builder - only if API key is properly set
const apiKey = process.env.NEXT_PUBLIC_BUILDER_API_KEY
if (apiKey && apiKey !== 'REEMPLAZAR_CON_TU_PUBLIC_API_KEY') {
  builder.init(apiKey)
}

interface PageProps {
  params: {
    page: string[]
  }
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

export default async function Page({ params, searchParams }: PageProps) {
  const urlPath = '/' + (params?.page?.join('/') || '')
  
  // Only try to get content from Builder if API key is configured
  let page = null
  const apiKey = process.env.NEXT_PUBLIC_BUILDER_API_KEY
  if (apiKey && apiKey !== 'REEMPLAZAR_CON_TU_PUBLIC_API_KEY') {
    try {
      page = await builder
        .get('page', {
          userAttributes: {
            urlPath,
          },
          prerender: false,
        })
        .toPromise()
    } catch (error) {
      console.warn('Builder.io error:', error)
    }
  }

  // If Builder has content for this URL, render it
  if (page) {
    return (
      <div className="min-h-screen">
        <Header />
        <RenderBuilderContent content={page} />
      </div>
    )
  }

  // Fallback for common pages - show appropriate content
  if (urlPath === '/' || urlPath === '/inicio') {
    return (
      <div className="min-h-screen bg-gray-50">
        <HeroSection />

        {/* Properties Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <PropertyGrid
              title="Propiedades Destacadas"
              featuredOnly={true}
              pageSize={6}
              className="mb-12"
            />

            <PropertyGrid
              title="Últimas Propiedades"
              pageSize={6}
            />
          </div>
        </section>
      </div>
    )
  }

  // For other pages, return a fallback instead of 404
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Página en Construcción
          </h1>
          <p className="text-gray-600 mb-8">
            Esta página está siendo desarrollada. Mientras tanto, puedes explorar nuestras propiedades.
          </p>
          <div className="space-x-4">
            <a
              href="/"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ir al Inicio
            </a>
            <a
              href="/propiedades"
              className="inline-block border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
            >
              Ver Propiedades
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

// Enable ISR
export const revalidate = 30
