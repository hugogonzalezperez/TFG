import { supabase } from '../../../shared/lib/supabase';
import { Parking, Garage } from '../types/parking.types';
import { Database } from '../../../types/database.types';

type GarageRow = Database['public']['Tables']['garages']['Row'];
type ParkingSpotRow = Database['public']['Tables']['parking_spots']['Row'];
type UserRow = Database['public']['Tables']['users']['Row'];

// Type for the join query result
interface GarageResponse extends GarageRow {
  parking_spots: (ParkingSpotRow & {
    owner: Pick<UserRow, 'id' | 'name' | 'avatar_url'> | null;
  })[];
}

export const parkingService = {
  /**
   * Obtiene todos los garajes que tienen al menos una plaza activa
   */
  async getGaragesWithSpots(): Promise<Garage[]> {
    const { data, error } = await supabase
      .from('garages')
      .select(`
        *,
        parking_spots (
          *,
          owner:users (id, name, avatar_url)
        )
      `)
      .eq('is_active', true)
      .returns<GarageResponse[]>();

    if (error) {
      console.error('Error fetching garages:', error);
      throw error;
    }

    if (!data) return [];

    return data.map((garage) => ({
      id: garage.id,
      name: garage.name,
      address: garage.address,
      city: garage.city,
      lat: garage.lat,
      lng: garage.lng,
      is_active: garage.is_active || false,
      is_verified: true, // TODO: Add to DB if needed
      total_spots: garage.total_spots || 0,
      owner_id: garage.owner_id,
      rating: 4.8, // Fallback/Mock
      reviews: 12, // Fallback/Mock
      image: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?q=80&w=400', // Garage image fallback
      spots: garage.parking_spots.map((spot) => ({
        id: spot.id,
        garage_id: spot.garage_id,
        name: `${garage.name} - ${spot.spot_number}`,
        address: garage.address,
        city: garage.city,
        base_price_per_hour: spot.base_price_per_hour,
        current_price_per_hour: spot.current_price_per_hour,
        lat: garage.lat,
        lng: garage.lng,
        is_active: spot.is_active || false,
        is_verified: true,
        image: 'https://images.unsplash.com/photo-1619335680796-54f13b88c6ba?q=80&w=400',
        description: spot.description || undefined,
        total_spots: 1,
        spot_number: spot.spot_number,
        type: (spot.type as Parking['type']) || 'Subterráneo',
        owner: spot.owner
          ? {
            id: spot.owner.id,
            name: spot.owner.name,
            avatar: spot.owner.avatar_url || undefined,
          }
          : {
            id: spot.owner_id,
            name: 'Propietario',
            avatar: undefined,
          },
      })),
    }));
  },

  /**
   * Mantiene compatibilidad con el método anterior si es necesario
   */
  async getParkingSpots(): Promise<Parking[]> {
    const garages = await this.getGaragesWithSpots();
    return garages.flatMap((g) => g.spots || []);
  },

  /**
   * Obtiene un parking spot específico por su ID
   */
  async getParkingSpotById(id: string): Promise<Parking> {
    const { data, error } = await supabase
      .from('parking_spots')
      .select(`
        *,
        garage:garages (*),
        owner:users (id, name, avatar_url)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching parking spot:', error);
      throw error;
    }

    if (!data) {
      throw new Error('Parking spot not found');
    }

    const garage = data.garage;
    const spot = data;

    return {
      id: spot.id,
      garage_id: spot.garage_id,
      name: `${garage.name} - ${spot.spot_number}`,
      address: garage.address,
      city: garage.city,
      base_price_per_hour: spot.base_price_per_hour,
      current_price_per_hour: spot.current_price_per_hour,
      lat: garage.lat,
      lng: garage.lng,
      is_active: spot.is_active || false,
      is_verified: true,
      image: 'https://images.unsplash.com/photo-1619335680796-54f13b88c6ba?q=80&w=400',
      images: [
        'https://images.unsplash.com/photo-1619335680796-54f13b88c6ba?q=80&w=400',
        'https://images.unsplash.com/photo-1590674899484-d5640e854abe?q=80&w=400'
      ],
      description: spot.description || undefined,
      total_spots: 1,
      spot_number: spot.spot_number,
      type: (spot.type as Parking['type']) || 'Subterráneo',
      owner: spot.owner
        ? {
          id: spot.owner.id,
          name: spot.owner.name,
          avatar: spot.owner.avatar_url || undefined,
        }
        : {
          id: spot.owner_id,
          name: 'Propietario',
          avatar: undefined,
        },
      amenities: ['Vigilancia 24/7', 'Cámara de seguridad', 'WiFi', 'Carga eléctrica'], // Fallback/Mock
      rules: ['Altura máxima: 2.10m', 'Horario de acceso: 24 horas'], // Fallback/Mock
    };
  },
};
