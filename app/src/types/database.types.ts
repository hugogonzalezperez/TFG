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
      access_logs: {
        Row: {
          id: string
          smart_access_id: string
          opened_at: string
          success: boolean
          ip_address: string | null
          user_agent: string | null
          location_lat: number | null
          location_lng: number | null
        }
        Insert: {
          id?: string
          smart_access_id: string
          opened_at?: string
          success: boolean
          ip_address?: string | null
          user_agent?: string | null
          location_lat?: number | null
          location_lng?: number | null
        }
        Update: {
          id?: string
          smart_access_id?: string
          opened_at?: string
          success?: boolean
          ip_address?: string | null
          user_agent?: string | null
          location_lat?: number | null
          location_lng?: number | null
        }
      }
      auth_providers: {
        Row: {
          id: string
          user_id: string
          provider: string
          provider_uid: string | null
          password_hash: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          provider: string
          provider_uid?: string | null
          password_hash?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          provider?: string
          provider_uid?: string | null
          password_hash?: string | null
          created_at?: string
        }
      }
      availability_slots: {
        Row: {
          id: string
          parking_spot_id: string | null
          slot_time: string
          is_occupied: boolean
          booking_id: string | null
        }
        Insert: {
          id?: string
          parking_spot_id?: string | null
          slot_time: string
          is_occupied?: boolean
          booking_id?: string | null
        }
        Update: {
          id?: string
          parking_spot_id?: string | null
          slot_time?: string
          is_occupied?: boolean
          booking_id?: string | null
        }
      }
      bookings: {
        Row: {
          id: string
          parking_spot_id: string
          renter_id: string
          start_time: string
          end_time: string
          total_hours: number
          total_price: number
          status: string
          created_at: string
          updated_at: string
          price_per_hour_at_booking: number
          dynamic_multiplier_applied: number
        }
        Insert: {
          id?: string
          parking_spot_id: string
          renter_id: string
          start_time: string
          end_time: string
          total_hours: number
          total_price: number
          status?: string
          created_at?: string
          updated_at?: string
          price_per_hour_at_booking: number
          dynamic_multiplier_applied?: number
        }
        Update: {
          id?: string
          parking_spot_id?: string
          renter_id?: string
          start_time?: string
          end_time?: string
          total_hours?: number
          total_price?: number
          status?: string
          created_at?: string
          updated_at?: string
          price_per_hour_at_booking?: number
          dynamic_multiplier_applied?: number
        }
      }
      garage_images: {
        Row: {
          id: string
          garage_id: string
          image_url: string
          is_main: boolean
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          garage_id: string
          image_url: string
          is_main?: boolean
          display_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          garage_id?: string
          image_url?: string
          is_main?: boolean
          display_order?: number
          created_at?: string
        }
      }
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
      parking_spot_images: {
        Row: {
          id: string
          parking_spot_id: string
          image_url: string
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          parking_spot_id: string
          image_url: string
          display_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          parking_spot_id?: string
          image_url?: string
          display_order?: number
          created_at?: string
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
      payments: {
        Row: {
          id: string
          booking_id: string
          user_id: string
          amount_total: number
          platform_fee: number
          owner_amount: number
          stripe_payment_id: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          user_id: string
          amount_total: number
          platform_fee: number
          owner_amount: number
          stripe_payment_id?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          user_id?: string
          amount_total?: number
          platform_fee?: number
          owner_amount?: number
          stripe_payment_id?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      price_history: {
        Row: {
          id: string
          parking_spot_id: string
          price_per_hour: number
          reason: string | null
          created_at: string
        }
        Insert: {
          id?: string
          parking_spot_id: string
          price_per_hour: number
          reason?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          parking_spot_id?: string
          price_per_hour?: number
          reason?: string | null
          created_at?: string
        }
      }
      pricing_rules: {
        Row: {
          id: string
          parking_spot_id: string | null
          rule_name: string
          day_of_week: number | null
          start_time: string | null
          end_time: string | null
          multiplier: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          parking_spot_id?: string | null
          rule_name: string
          day_of_week?: number | null
          start_time?: string | null
          end_time?: string | null
          multiplier?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          parking_spot_id?: string | null
          rule_name?: string
          day_of_week?: number | null
          start_time?: string | null
          end_time?: string | null
          multiplier?: number
          is_active?: boolean
          created_at?: string
        }
      }
      refunds: {
        Row: {
          id: string
          payment_id: string
          amount: number
          reason: string
          status: string
          processed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          payment_id: string
          amount: number
          reason: string
          status?: string
          processed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          payment_id?: string
          amount?: number
          reason?: string
          status?: string
          processed_at?: string | null
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          garage_id: string
          user_id: string
          booking_id: string | null
          rating: number
          comment: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          garage_id: string
          user_id: string
          booking_id?: string | null
          rating: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          garage_id?: string
          user_id?: string
          booking_id?: string | null
          rating?: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      roles: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
        }
      }
      smart_access: {
        Row: {
          id: string
          booking_id: string
          garage_id: string
          access_code: string
          valid_from: string
          valid_until: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          garage_id: string
          access_code: string
          valid_from: string
          valid_until: string
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          garage_id?: string
          access_code?: string
          valid_from?: string
          valid_until?: string
          is_active?: boolean
          created_at?: string
        }
      }
      user_roles: {
        Row: {
          user_id: string
          role_id: string
          assigned_at: string
        }
        Insert: {
          user_id: string
          role_id: string
          assigned_at?: string
        }
        Update: {
          user_id?: string
          role_id?: string
          assigned_at?: string
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
