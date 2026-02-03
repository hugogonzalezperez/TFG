import { supabase } from '../../../shared/lib/supabase';
import { Parking, Garage } from '../types/parking.types';

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
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching garages:', error);
      throw error;
    }

    return (data || []).map(garage => ({
      id: garage.id,
      name: garage.name,
      address: garage.address,
      city: garage.city,
      lat: garage.lat,
      lng: garage.lng,
      is_active: garage.is_active,
      is_verified: true,
      total_spots: garage.total_spots,
      owner_id: garage.owner_id,
      rating: 4.8,
      reviews: 12,
      spots: garage.parking_spots.map((spot: any) => ({
        id: spot.id,
        garage_id: spot.garage_id,
        name: `${garage.name} - ${spot.spot_number}`,
        address: garage.address,
        city: garage.city,
        base_price_per_hour: spot.base_price_per_hour,
        current_price_per_hour: spot.current_price_per_hour,
        lat: garage.lat,
        lng: garage.lng,
        is_active: spot.is_active,
        is_verified: true,
        image: 'https://images.unsplash.com/photo-1619335680796-54f13b88c6ba?q=80&w=400',
        description: spot.description,
        total_spots: 1,
        spot_number: spot.spot_number,
        type: spot.type,
        owner: spot.owner ? {
          id: spot.owner.id,
          name: spot.owner.name,
          avatar: spot.owner.avatar_url
        } : {
          id: spot.owner_id,
          name: 'Propietario',
          avatar: null
        }
      }))
    }));
  },

  /**
   * Mantiene compatibilidad con el método anterior si es necesario
   */
  async getParkingSpots(): Promise<Parking[]> {
    const garages = await this.getGaragesWithSpots();
    return garages.flatMap(g => g.spots || []);
  }
};
