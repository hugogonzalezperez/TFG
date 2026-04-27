export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      booking_access_logs: {
        Row: {
          action: string
          booking_id: string
          created_at: string | null
          id: string
          ip_address: unknown
          success: boolean
          user_agent: string | null
        }
        Insert: {
          action: string
          booking_id: string
          created_at?: string | null
          id?: string
          ip_address?: unknown
          success?: boolean
          user_agent?: string | null
        }
        Update: {
          action?: string
          booking_id?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown
          success?: boolean
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_access_logs_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          created_at: string | null
          dynamic_multiplier_applied: number | null
          end_time: string
          id: string
          parking_spot_id: string
          price_per_hour_at_booking: number
          renter_id: string
          start_time: string
          status: Database["public"]["Enums"]["booking_status"] | null
          total_hours: number
          total_price: number
          updated_at: string | null
          vehicle_description: string | null
          vehicle_plate: string | null
        }
        Insert: {
          created_at?: string | null
          dynamic_multiplier_applied?: number | null
          end_time: string
          id?: string
          parking_spot_id: string
          price_per_hour_at_booking: number
          renter_id: string
          start_time: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          total_hours: number
          total_price: number
          updated_at?: string | null
          vehicle_description?: string | null
          vehicle_plate?: string | null
        }
        Update: {
          created_at?: string | null
          dynamic_multiplier_applied?: number | null
          end_time?: string
          id?: string
          parking_spot_id?: string
          price_per_hour_at_booking?: number
          renter_id?: string
          start_time?: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          total_hours?: number
          total_price?: number
          updated_at?: string | null
          vehicle_description?: string | null
          vehicle_plate?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_parking_spot_id_fkey"
            columns: ["parking_spot_id"]
            isOneToOne: false
            referencedRelation: "parking_spots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_renter_id_fkey"
            columns: ["renter_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          created_at: string
          id: string
          parking_spot_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          parking_spot_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          parking_spot_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_parking_spot_id_fkey"
            columns: ["parking_spot_id"]
            isOneToOne: false
            referencedRelation: "parking_spots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      garage_images: {
        Row: {
          created_at: string | null
          display_order: number | null
          garage_id: string
          id: string
          image_url: string
          is_main: boolean | null
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          garage_id: string
          id?: string
          image_url: string
          is_main?: boolean | null
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          garage_id?: string
          id?: string
          image_url?: string
          is_main?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "garage_images_garage_id_fkey"
            columns: ["garage_id"]
            isOneToOne: false
            referencedRelation: "garages"
            referencedColumns: ["id"]
          },
        ]
      }
      garages: {
        Row: {
          address: string
          city: string
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          lat: number
          lng: number
          name: string
          owner_id: string
          postal_code: string | null
          total_spots: number
          updated_at: string | null
        }
        Insert: {
          address: string
          city: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          lat: number
          lng: number
          name: string
          owner_id: string
          postal_code?: string | null
          total_spots?: number
          updated_at?: string | null
        }
        Update: {
          address?: string
          city?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          lat?: number
          lng?: number
          name?: string
          owner_id?: string
          postal_code?: string | null
          total_spots?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "garages_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      parking_spot_images: {
        Row: {
          created_at: string | null
          display_order: number | null
          id: string
          image_url: string
          parking_spot_id: string
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          image_url: string
          parking_spot_id: string
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          image_url?: string
          parking_spot_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "parking_spot_images_parking_spot_id_fkey"
            columns: ["parking_spot_id"]
            isOneToOne: false
            referencedRelation: "parking_spots"
            referencedColumns: ["id"]
          },
        ]
      }
      parking_spots: {
        Row: {
          base_price_per_hour: number
          created_at: string | null
          current_price_per_hour: number
          description: string | null
          garage_id: string
          id: string
          is_active: boolean | null
          owner_id: string
          spot_number: string
          type: string | null
          updated_at: string | null
        }
        Insert: {
          base_price_per_hour: number
          created_at?: string | null
          current_price_per_hour: number
          description?: string | null
          garage_id: string
          id?: string
          is_active?: boolean | null
          owner_id: string
          spot_number: string
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          base_price_per_hour?: number
          created_at?: string | null
          current_price_per_hour?: number
          description?: string | null
          garage_id?: string
          id?: string
          is_active?: boolean | null
          owner_id?: string
          spot_number?: string
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "parking_spots_garage_id_fkey"
            columns: ["garage_id"]
            isOneToOne: false
            referencedRelation: "garages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parking_spots_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      price_history: {
        Row: {
          created_at: string | null
          id: string
          parking_spot_id: string
          price_per_hour: number
          reason: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          parking_spot_id: string
          price_per_hour: number
          reason?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          parking_spot_id?: string
          price_per_hour?: number
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "price_history_parking_spot_id_fkey"
            columns: ["parking_spot_id"]
            isOneToOne: false
            referencedRelation: "parking_spots"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing_rules: {
        Row: {
          created_at: string | null
          day_of_week: number | null
          end_time: string | null
          id: string
          is_active: boolean | null
          multiplier: number
          parking_spot_id: string | null
          rule_name: string
          start_time: string | null
        }
        Insert: {
          created_at?: string | null
          day_of_week?: number | null
          end_time?: string | null
          id?: string
          is_active?: boolean | null
          multiplier?: number
          parking_spot_id?: string | null
          rule_name: string
          start_time?: string | null
        }
        Update: {
          created_at?: string | null
          day_of_week?: number | null
          end_time?: string | null
          id?: string
          is_active?: boolean | null
          multiplier?: number
          parking_spot_id?: string | null
          rule_name?: string
          start_time?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pricing_rules_parking_spot_id_fkey"
            columns: ["parking_spot_id"]
            isOneToOne: false
            referencedRelation: "parking_spots"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          booking_id: string | null
          comment: string | null
          created_at: string | null
          garage_id: string
          id: string
          rating: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          booking_id?: string | null
          comment?: string | null
          created_at?: string | null
          garage_id: string
          id?: string
          rating: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          booking_id?: string | null
          comment?: string | null
          created_at?: string | null
          garage_id?: string
          id?: string
          rating?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: true
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_garage_id_fkey"
            columns: ["garage_id"]
            isOneToOne: false
            referencedRelation: "garages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: Database["public"]["Enums"]["user_role_type"]
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: Database["public"]["Enums"]["user_role_type"]
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: Database["public"]["Enums"]["user_role_type"]
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          role_id: string
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          role_id: string
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          id: string
          is_active: boolean | null
          name: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          id?: string
          is_active?: boolean | null
          name: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
          name?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      public_profiles: {
        Row: {
          avatar_url: string | null
          id: string | null
          name: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      check_parking_spot_availability: {
        Args: { p_end_time: string; p_spot_id: string; p_start_time: string }
        Returns: boolean
      }
      complete_past_bookings: { Args: never; Returns: undefined }
      decrement_garage_spots: {
        Args: { garage_id_param: string }
        Returns: undefined
      }
      get_owner_average_rating: {
        Args: { owner_uuid: string }
        Returns: number
      }
      increment_garage_spots: {
        Args: { garage_id_param: string }
        Returns: undefined
      }
    }
    Enums: {
      auth_provider_type: "email" | "google" | "facebook"
      booking_status: "pending" | "confirmed" | "active" | "completed" | "cancelled"
      payment_status: "pending" | "completed" | "failed" | "refunded"
      refund_status: "pending" | "approved" | "rejected" | "completed"
      user_role_type: "admin" | "user" | "owner"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">
type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      auth_provider_type: ["email", "google", "facebook"],
      booking_status: ["pending", "confirmed", "active", "completed", "cancelled"],
      payment_status: ["pending", "completed", "failed", "refunded"],
      refund_status: ["pending", "approved", "rejected", "completed"],
      user_role_type: ["admin", "user", "owner"],
    },
  },
} as const
