// =====================================================
// TIPOS DE BOOKING E INVENTARIO
// =====================================================

export type BookingStatus = 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  parking_spot_id: string;
  renter_id: string;
  start_time: string; // ISO String
  end_time: string;   // ISO String
  total_hours: number;
  total_price: number;
  price_per_hour_at_booking: number;
  dynamic_multiplier_applied: number;
  status: BookingStatus;
  created_at: string;
  updated_at: string;
}

export interface PricingRule {
  id: string;
  parking_spot_id: string;
  rule_name: string;
  day_of_week?: number; // 0-6 Domingo=0, Lunes=1, ... , Sábado=6
  start_time?: string;   // "HH:mm:ss"
  end_time?: string;     // "HH:mm:ss"
  multiplier: number;
  is_active: boolean;
}

export interface AvailabilitySlot {
  id: string;
  parking_spot_id: string;
  slot_time: string;
  is_occupied: boolean;
  booking_id?: string;
}

export interface BookingEstimation {
  base_price: number;
  total_price: number;
  multiplier_applied: number;
  hours: number;
  rules_applied: string[];
}
