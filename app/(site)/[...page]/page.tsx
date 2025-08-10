import { builder } from '@builder.io/sdk'
import { RenderBuilderContent } from '@/components/builder/RenderBuilderContent'
import { notFound } from 'next/navigation'
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

  // Fallback for homepage - show default property grid
  if (urlPath === '/' || urlPath === '/inicio') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
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

        {/* Footer placeholder */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="bg-white text-gray-900 px-4 py-2 rounded inline-block mb-4">
                  <div className="font-bold">CATAMARCA</div>
                  <div className="text-xs uppercase tracking-wider">INMOBILIARIA</div>
                </div>
                <p className="text-gray-400 text-sm">
                  La inmobiliaria líder en Catamarca con más de 10 años de experiencia.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Servicios</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>Venta de Propiedades</li>
                  <li>Alquiler</li>
                  <li>Tasaciones</li>
                  <li>Asesoramiento</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Contacto</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>+54 383 4567890</li>
                  <li>contacto@inmobiliariacatamarca.com</li>
                  <li>Catamarca, Argentina</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Síguenos</h4>
                <div className="flex space-x-4">
                  <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                  <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                  <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
              © 2024 Inmobiliaria Catamarca. Todos los derechos reservados.
            </div>
          </div>
        </footer>
      </div>
    )
  }

  // If no content found, return 404
  notFound()
}

// Enable ISR
export const revalidate = 30
