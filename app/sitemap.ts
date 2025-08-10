import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://inmobiliariacatamarca.com'
  
  const supabase = createClient()
  
  // Get all properties
  const { data: properties } = await supabase
    .from('properties')
    .select('id, updated_at')
    .order('updated_at', { ascending: false })
    .limit(1000)
  
  // Get all developments
  const { data: developments } = await supabase
    .from('developments')
    .select('id, updated_at')
    .order('updated_at', { ascending: false })
    .limit(100)

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/propiedades`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/emprendimientos`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tasaciones`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/la-empresa`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contacto`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    // Property filter pages
    {
      url: `${baseUrl}/propiedades?operation=venta`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/propiedades?operation=alquiler`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/propiedades?operation=temporal`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/propiedades?type=casa`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/propiedades?type=departamento`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/propiedades?type=lote`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
  ]

  // Property detail pages
  const propertyPages: MetadataRoute.Sitemap = (properties || []).map((property) => ({
    url: `${baseUrl}/propiedad/${property.id}`,
    lastModified: new Date(property.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Development detail pages
  const developmentPages: MetadataRoute.Sitemap = (developments || []).map((development) => ({
    url: `${baseUrl}/emprendimientos/${development.id}`,
    lastModified: new Date(development.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...propertyPages, ...developmentPages]
}
