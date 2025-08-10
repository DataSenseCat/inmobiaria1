import { PropertyWithImages } from '@/lib/supabase/types'

interface PropertyStructuredDataProps {
  property: PropertyWithImages
}

interface DevelopmentStructuredDataProps {
  development: {
    id: string
    title: string
    description?: string
    address?: string
    city?: string
    province?: string
    hero_url?: string
    agents?: {
      name: string
      email: string
      phone?: string
    }
  }
}

interface OrganizationStructuredDataProps {
  // No props needed, uses environment variables
}

export function PropertyStructuredData({ property }: PropertyStructuredDataProps) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://inmobiliariacatamarca.com'
  
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Residence',
    name: property.title,
    description: property.description || `${property.type} en ${property.operation} - ${property.city}`,
    url: `${baseUrl}/propiedad/${property.id}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: property.address,
      addressLocality: property.city,
      addressRegion: property.province,
      addressCountry: 'AR'
    },
    floorSize: property.area_covered ? {
      '@type': 'QuantitativeValue',
      value: property.area_covered,
      unitText: 'm²'
    } : undefined,
    numberOfRooms: property.rooms || undefined,
    numberOfBathroomsTotal: property.bathrooms || undefined,
    offers: {
      '@type': 'Offer',
      priceCurrency: property.price_usd ? 'USD' : 'ARS',
      price: property.price_usd || property.price_ars,
      availability: 'https://schema.org/InStock',
      category: property.operation === 'venta' ? 'https://schema.org/SaleEvent' : 'https://schema.org/RentalEvent'
    },
    image: property.images && property.images.length > 0 
      ? property.images.map(img => ({
          '@type': 'ImageObject',
          url: img.url,
          caption: img.alt
        }))
      : undefined,
    realEstateAgent: property.agents ? {
      '@type': 'RealEstateAgent',
      name: property.agents.name,
      email: property.agents.email,
      telephone: property.agents.phone
    } : undefined
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

export function DevelopmentStructuredData({ development }: DevelopmentStructuredDataProps) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://inmobiliariacatamarca.com'
  
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateProject',
    name: development.title,
    description: development.description || `Emprendimiento inmobiliario en ${development.city}`,
    url: `${baseUrl}/emprendimientos/${development.id}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: development.address,
      addressLocality: development.city,
      addressRegion: development.province,
      addressCountry: 'AR'
    },
    image: development.hero_url ? {
      '@type': 'ImageObject',
      url: development.hero_url,
      caption: development.title
    } : undefined,
    realEstateAgent: development.agents ? {
      '@type': 'RealEstateAgent',
      name: development.agents.name,
      email: development.agents.email,
      telephone: development.agents.phone
    } : undefined
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

export function OrganizationStructuredData({}: OrganizationStructuredDataProps) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://inmobiliariacatamarca.com'
  
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: process.env.NEXT_PUBLIC_SITE_NAME || 'Inmobiliaria Catamarca',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    image: `${baseUrl}/og-image.png`,
    description: 'Inmobiliaria especializada en propiedades en Catamarca, Argentina. Venta, alquiler y tasaciones.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: process.env.NEXT_PUBLIC_OFFICE_ADDRESS || 'Av. Belgrano 1250',
      addressLocality: 'San Fernando del Valle de Catamarca',
      addressRegion: 'Catamarca',
      postalCode: '4700',
      addressCountry: 'AR'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: process.env.NEXT_PUBLIC_CONTACT_PHONE || '+54 383 456-7890',
      email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@inmobiliariacatamarca.com',
      contactType: 'customer service',
      availableLanguage: 'Spanish'
    },
    sameAs: [
      'https://www.facebook.com/inmobiliariacatamarca',
      'https://www.instagram.com/inmobiliariacatamarca'
    ],
    areaServed: {
      '@type': 'State',
      name: 'Catamarca',
      containedInPlace: {
        '@type': 'Country',
        name: 'Argentina'
      }
    },
    serviceType: [
      'Real Estate Sales',
      'Real Estate Rentals', 
      'Property Valuation',
      'Real Estate Development'
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

export function BreadcrumbStructuredData({ items }: { items: { name: string; url: string }[] }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
