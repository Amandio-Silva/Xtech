import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          password: string
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          password: string
          name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          password?: string
          name?: string
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          price: number
          original_price: number | null
          category: string
          stock: number
          featured: boolean
          is_new: boolean
          image_url: string | null
          description: string | null
          rating: number
          sales: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          price: number
          original_price?: number | null
          category: string
          stock?: number
          featured?: boolean
          is_new?: boolean
          image_url?: string | null
          description?: string | null
          rating?: number
          sales?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          price?: number
          original_price?: number | null
          category?: string
          stock?: number
          featured?: boolean
          is_new?: boolean
          image_url?: string | null
          description?: string | null
          rating?: number
          sales?: number
          created_at?: string
          updated_at?: string
        }
      }
      services: {
        Row: {
          id: string
          title: string
          description: string | null
          price_from: number | null
          time_estimate: string | null
          icon: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          price_from?: number | null
          time_estimate?: string | null
          icon?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          price_from?: number | null
          time_estimate?: string | null
          icon?: string | null
          created_at?: string
        }
      }
      service_requests: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          device: string
          problem: string
          description: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          device: string
          problem: string
          description?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          device?: string
          problem?: string
          description?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
