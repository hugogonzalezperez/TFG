export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      garages: {
        Row: {
          id: string
          owner_id: string
          name: string
          description: string | null
          address: string
          city: string
          postal_code: string | null
          lat: number
          lng: number
          total_spots: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          name: string
          description?: string | null
          address: string
          city: string
          postal_code?: string | null
          lat: number
          lng: number
          total_spots?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          name?: string
          description?: string | null
          address?: string
          city?: string
          postal_code?: string | null
          lat?: number
          lng?: number
          total_spots?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      parking_spots: {
        Row: {
          id: string
          garage_id: string
          owner_id: string
          spot_number: string
          base_price_per_hour: number
          current_price_per_hour: number
          description: string | null
          is_active: boolean
          type: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          garage_id: string
          owner_id: string
          spot_number: string
          base_price_per_hour: number
          current_price_per_hour: number
          description?: string | null
          is_active?: boolean
          type?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          garage_id?: string
          owner_id?: string
          spot_number?: string
          base_price_per_hour?: number
          current_price_per_hour?: number
          description?: string | null
          is_active?: boolean
          type?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          name: string
          phone: string | null
          avatar_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          phone?: string | null
          avatar_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          phone?: string | null
          avatar_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
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
      [_ in never]: never
    }
  }
}
