import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DevelopmentDetails } from '@/components/developments/DevelopmentDetails'

interface DevelopmentPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: DevelopmentPageProps): Promise<Metadata> {
  const supabase = createClient()
  
  const { data: development } = await supabase
    .from('developments')
    .select('title, description')
    .eq('id', params.id)
    .single()

  if (!development) {
    return {
      title: 'Emprendimiento no encontrado',
      description: 'El emprendimiento solicitado no existe.'
    }
  }

  return {
    title: `${development.title} - Inmobiliaria Catamarca`,
    description: development.description || `Conoce más sobre ${development.title}`,
    openGraph: {
      title: development.title,
      description: development.description || `Emprendimiento ${development.title}`,
      type: 'website'
    }
  }
}

async function getDevelopment(id: string) {
  const supabase = createClient()
  
  const { data: development, error } = await supabase
    .from('developments')
    .select(`
      *,
      agents (
        name,
        phone,
        email
      )
    `)
    .eq('id', id)
    .single()

  if (error || !development) {
    return null
  }

  return development
}

export default async function DevelopmentPage({ params }: DevelopmentPageProps) {
  const development = await getDevelopment(params.id)

  if (!development) {
    notFound()
  }

  return <DevelopmentDetails development={development} />
}

export async function generateStaticParams() {
  const supabase = createClient()
  
  const { data: developments } = await supabase
    .from('developments')
    .select('id')
    .limit(10)

  return developments?.map((development) => ({
    id: development.id,
  })) || []
}
