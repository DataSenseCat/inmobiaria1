export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          user_id: string
          role: 'admin' | 'agent' | 'user'
          created_at: string
        }
        Insert: {
          user_id: string
          role?: 'admin' | 'agent' | 'user'
          created_at?: string
        }
        Update: {
          user_id?: string
          role?: 'admin' | 'agent' | 'user'
          created_at?: string
        }
      }
      agents: {
        Row: {
          id: string
          name: string
          phone: string | null
          email: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          phone?: string | null
          email: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          phone?: string | null
          email?: string
          created_at?: string
        }
      }
      properties: {
        Row: {
          id: string
          title: string
          operation: 'venta' | 'alquiler'
          type: 'casa' | 'departamento' | 'ph' | 'lote' | 'local'
          price_usd: number | null
          price_ars: number | null
          address: string | null
          city: string | null
          province: string | null
          rooms: number | null
          bathrooms: number | null
          area_covered: number | null
          area_total: number | null
          description: string | null
          featured: boolean
          coordinates: Json | null
          agent_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          operation: 'venta' | 'alquiler'
          type: 'casa' | 'departamento' | 'ph' | 'lote' | 'local'
          price_usd?: number | null
          price_ars?: number | null
          address?: string | null
          city?: string | null
          province?: string | null
          rooms?: number | null
          bathrooms?: number | null
          area_covered?: number | null
          area_total?: number | null
          description?: string | null
          featured?: boolean
          coordinates?: Json | null
          agent_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          operation?: 'venta' | 'alquiler'
          type?: 'casa' | 'departamento' | 'ph' | 'lote' | 'local'
          price_usd?: number | null
          price_ars?: number | null
          address?: string | null
          city?: string | null
          province?: string | null
          rooms?: number | null
          bathrooms?: number | null
          area_covered?: number | null
          area_total?: number | null
          description?: string | null
          featured?: boolean
          coordinates?: Json | null
          agent_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      images: {
        Row: {
          id: string
          property_id: string
          url: string
          alt: string | null
        }
        Insert: {
          id?: string
          property_id: string
          url: string
          alt?: string | null
        }
        Update: {
          id?: string
          property_id?: string
          url?: string
          alt?: string | null
        }
      }
      leads: {
        Row: {
          id: string
          property_id: string
          name: string
          phone: string | null
          email: string | null
          message: string | null
          created_at: string
        }
        Insert: {
          id?: string
          property_id: string
          name: string
          phone?: string | null
          email?: string | null
          message?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          name?: string
          phone?: string | null
          email?: string | null
          message?: string | null
          created_at?: string
        }
      }
      favorites: {
        Row: {
          user_id: string
          property_id: string
        }
        Insert: {
          user_id: string
          property_id: string
        }
        Update: {
          user_id?: string
          property_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      operation: 'venta' | 'alquiler'
      ptype: 'casa' | 'departamento' | 'ph' | 'lote' | 'local'
      role: 'admin' | 'agent' | 'user'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

export type Property = Tables<'properties'> & {
  images?: Tables<'images'>[]
  agent?: Tables<'agents'>
}

export type Lead = Tables<'leads'>
export type Agent = Tables<'agents'>
export type PropertyImage = Tables<'images'>
export type Profile = Tables<'profiles'>
export type Favorite = Tables<'favorites'>
