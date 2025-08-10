export interface Property {
  id: string
  title: string
  description?: string
  address?: string
  city: string
  type: 'casa' | 'departamento' | 'ph' | 'lote' | 'local'
  operation: 'venta' | 'alquiler' | 'temporal'
  price_usd?: number
  price_ars?: number
  rooms?: number
  bathrooms?: number
  area_covered?: number
  area_total?: number
  coordinates?: { lat: number; lng: number }
  featured: boolean
  active: boolean
  created_at: string
  updated_at: string
  agent_id?: string
  images?: PropertyImage[]
  agents?: Agent
}

export interface PropertyImage {
  id: string
  property_id: string
  url: string
  alt?: string
  order_index: number
  created_at: string
}

export interface Agent {
  id: string
  name: string
  email: string
  phone?: string
  bio?: string
  avatar_url?: string
  user_id: string
  created_at: string
  updated_at: string
}

export interface Development {
  id: string
  name: string
  description?: string
  address: string
  city: string
  total_units?: number
  available_units?: number
  price_from?: number
  price_to?: number
  delivery_date?: string
  status: 'planning' | 'construction' | 'completed' | 'delivered'
  featured: boolean
  active: boolean
  created_at: string
  updated_at: string
  agent_id?: string
  images?: DevelopmentImage[]
  agents?: Agent
}

export interface DevelopmentImage {
  id: string
  development_id: string
  url: string
  alt?: string
  order_index: number
  created_at: string
}

export interface Lead {
  id: string
  name: string
  email: string
  phone?: string
  message?: string
  source?: string
  property_id?: string
  development_id?: string
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'closed'
  created_at: string
  updated_at: string
  property?: Property
  development?: Development
}

export interface Profile {
  user_id: string
  role: 'admin' | 'agent' | 'user'
  name?: string
  email: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Favorite {
  id: string
  user_id: string
  property_id: string
  created_at: string
  property?: Property
}

// Database types
export interface Database {
  public: {
    Tables: {
      properties: {
        Row: Property
        Insert: Omit<Property, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Property, 'id' | 'created_at'>>
      }
      property_images: {
        Row: PropertyImage
        Insert: Omit<PropertyImage, 'id' | 'created_at'>
        Update: Partial<Omit<PropertyImage, 'id' | 'created_at'>>
      }
      agents: {
        Row: Agent
        Insert: Omit<Agent, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Agent, 'id' | 'created_at'>>
      }
      developments: {
        Row: Development
        Insert: Omit<Development, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Development, 'id' | 'created_at'>>
      }
      development_images: {
        Row: DevelopmentImage
        Insert: Omit<DevelopmentImage, 'id' | 'created_at'>
        Update: Partial<Omit<DevelopmentImage, 'id' | 'created_at'>>
      }
      leads: {
        Row: Lead
        Insert: Omit<Lead, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Lead, 'id' | 'created_at'>>
      }
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at' | 'updated_at'>
        Update: Partial<Omit<Profile, 'created_at'>>
      }
      favorites: {
        Row: Favorite
        Insert: Omit<Favorite, 'id' | 'created_at'>
        Update: Partial<Omit<Favorite, 'id' | 'created_at'>>
      }
    }
  }
}
