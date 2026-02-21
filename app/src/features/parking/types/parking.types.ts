// =====================================================
// TIPOS DE PARKING
// =====================================================

export interface Garage {
  id: string;
  name: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  is_active: boolean;
  is_verified: boolean;
  total_spots: number;
  owner_id: string;
  description?: string;
  image?: string;
  images?: string[];
  rating?: number;
  reviews?: number;
  spots?: Parking[];
}

export interface Parking {
  id: string; // UUID de parking_spots
  garage_id: string; // UUID de garages
  name: string;
  spot_number: string;
  address: string;
  city: string;
  base_price_per_hour: number;
  current_price_per_hour: number;
  rating?: number;
  reviews?: number;
  distance?: number;
  lat: number;
  lng: number;
  type?: 'Cubierta' | 'Subterráneo' | 'Al aire libre';
  is_active: boolean;
  is_verified: boolean;
  image: string;
  images?: string[];
  description?: string;
  total_spots: number;
  owner?: {
    id: string;
    name: string;
    avatar?: string;
    rating?: number;
    reviewCount?: number;
  };
  amenities?: string[];
  rules?: string[];
}

export interface ParkingFilter {
  types: Set<string>;
  availability: 'all' | 'available';
  priceRange: [number, number];
  amenities: Set<string>;
  searchQuery: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
}
