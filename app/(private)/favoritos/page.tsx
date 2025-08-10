import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import FavoritesList from '@/components/favorites/FavoritesList'

export default async function FavoritesPage() {
  const supabase = createServerSupabaseClient()

  // Check if user is authenticated
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect('/auth/sign-in?redirectedFrom=/favoritos')
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Mis Favoritos</h1>
          <p className="text-muted-foreground">
            Propiedades que has guardado para revisar más tarde
          </p>
        </div>
        
        <FavoritesList />
      </div>
    </div>
  )
}
