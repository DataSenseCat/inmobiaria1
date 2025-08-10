import { builder } from '@builder.io/sdk'
import { RenderBuilderContent } from '@/components/builder/RenderBuilderContent'
import { notFound } from 'next/navigation'
import PropertyGrid from '@/components/properties/PropertyGrid'

// Configure Builder
builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY!)

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
  
  // Get the page content from Builder
  const page = await builder
    .get('page', {
      userAttributes: {
        urlPath,
      },
      prerender: false,
    })
    .toPromise()

  // If Builder has content for this URL, render it
  if (page) {
    return <RenderBuilderContent content={page} />
  }

  // Fallback for homepage - show default property grid
  if (urlPath === '/' || urlPath === '/inicio') {
    return (
      <div className="min-h-screen">
        {/* Default homepage content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Inmobiliaria Catamarca
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Encuentra las mejores propiedades en Catamarca. 
                Casas, departamentos, lotes y locales comerciales.
              </p>
            </div>
            <PropertyGrid 
              title="Propiedades Destacadas"
              featuredOnly={true}
              pageSize={8}
            />
          </div>
        </section>
      </div>
    )
  }

  // If no content found, return 404
  notFound()
}

// Enable ISR
export const revalidate = 30
