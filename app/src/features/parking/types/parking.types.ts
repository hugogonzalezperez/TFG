// =====================================================
// TIPOS DE PARKING
// =====================================================

export interface Parking {
  id: number;
  name: string;
  location: string;
  city: string;
  price: number;
  rating: number;
  reviews: number;
  distance: number;
  lat: number;
  lng: number;
  type: 'Cubierta' | 'Subterráneo' | 'Al aire libre';
  verified: boolean;
  image: string;
  images?: string[];
  available?: boolean;
  owner?: {
    name: string;
    avatar: string;
    rating: number;
    reviewCount: number;
    responseTime: string;
    memberSince: string;
  };
  amenities?: string[];
  description?: string;
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
