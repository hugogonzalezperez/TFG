// =====================================================
// TIPOS TYPESCRIPT PARA LA BASE DE DATOS
// =====================================================

export type AuthProviderType = 'email' | 'google' | 'facebook';

export type BookingStatus = 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export type RefundStatus = 'pending' | 'approved' | 'rejected' | 'completed';

export type UserRoleType = 'admin' | 'user' | 'owner';

// =====================================================
// TABLAS
// =====================================================

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthProvider {
  id: string;
  user_id: string;
  provider: AuthProviderType;
  provider_uid?: string;
  password_hash?: string;
  created_at: string;
}

export interface Role {
  id: string;
  name: UserRoleType;
  description?: string;
  created_at: string;
}

export interface UserRole {
  user_id: string;
  role_id: string;
  assigned_at: string;
}

export interface Garage {
  id: string;
  owner_id: string;
  name: string;
  description?: string;
  address: string;
  city: string;
  postal_code?: string;
  lat: number;
  lng: number;
  total_spots: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface GarageImage {
  id: string;
  garage_id: string;
  image_url: string;
  is_main: boolean;
  display_order: number;
  created_at: string;
}

export interface ParkingSpot {
  id: string;
  garage_id: string;
  owner_id: string;
  spot_number: string;
  base_price_per_hour: number;
  current_price_per_hour: number;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ParkingSpotImage {
  id: string;
  parking_spot_id: string;
  image_url: string;
  display_order: number;
  created_at: string;
}

export interface PriceHistory {
  id: string;
  parking_spot_id: string;
  price_per_hour: number;
  reason?: string;
  created_at: string;
}

export interface Booking {
  id: string;
  parking_spot_id: string;
  renter_id: string;
  start_time: string;
  end_time: string;
  total_hours: number;
  total_price: number;
  status: BookingStatus;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  booking_id: string;
  user_id: string;
  amount_total: number;
  platform_fee: number;
  owner_amount: number;
  stripe_payment_id?: string;
  status: PaymentStatus;
  created_at: string;
  updated_at: string;
}

export interface Refund {
  id: string;
  payment_id: string;
  amount: number;
  reason: string;
  status: RefundStatus;
  processed_at?: string;
  created_at: string;
}

export interface Review {
  id: string;
  garage_id: string;
  user_id: string;
  booking_id?: string;
  rating: number;
  comment?: string;
  created_at: string;
  updated_at: string;
}

export interface SmartAccess {
  id: string;
  booking_id: string;
  garage_id: string;
  access_code: string;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
  created_at: string;
}

export interface AccessLog {
  id: string;
  smart_access_id: string;
  opened_at: string;
  success: boolean;
  ip_address?: string;
  user_agent?: string;
  location_lat?: number;
  location_lng?: number;
}

// =====================================================
// TIPOS DE RESPUESTA EXTENDIDOS (CON JOINS)
// =====================================================

export interface UserWithRoles extends User {
  roles?: Role[];
}

export interface GarageWithImages extends Garage {
  images?: GarageImage[];
  owner?: User;
  average_rating?: number;
  total_reviews?: number;
}

export interface ParkingSpotWithDetails extends ParkingSpot {
  garage?: Garage;
  images?: ParkingSpotImage[];
}

export interface BookingWithDetails extends Booking {
  parking_spot?: ParkingSpotWithDetails;
  renter?: User;
  payment?: Payment;
  smart_access?: SmartAccess;
}

// =====================================================
// TIPOS PARA FORMULARIOS Y REQUESTS
// =====================================================

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
  isOwner?: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SocialAuthRequest {
  provider: 'google' | 'facebook';
  provider_uid: string;
  email: string;
  name: string;
  avatar_url?: string;
}

export interface CreateGarageRequest {
  name: string;
  description?: string;
  address: string;
  city: string;
  postal_code?: string;
  lat: number;
  lng: number;
  total_spots: number;
  images?: string[];
}

export interface CreateBookingRequest {
  parking_spot_id: string;
  start_time: string;
  end_time: string;
  total_hours: number;
  total_price: number;
}

// =====================================================
// TIPOS PARA AUTENTICACIÓN
// =====================================================

export interface AuthUser {
  user: User;
  roles: UserRoleType[];
  hasRole: (role: UserRoleType) => boolean;
  isOwner: boolean;
  isAdmin: boolean;
}

export interface AuthResponse {
  user: User;
  session?: {
    access_token: string;
    refresh_token: string;
    expires_at: number;
  };
}