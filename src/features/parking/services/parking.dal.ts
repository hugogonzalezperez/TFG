// Data Access Layer

import { supabase } from '../../../shared/lib/supabase';
import { Database } from '../../../types/database.types';

type GarageRow = Database['public']['Tables']['garages']['Row'];
type ParkingSpotRow = Database['public']['Tables']['parking_spots']['Row'];
type UserRow = Database['public']['Tables']['users']['Row'];

// Type for the join query result
export interface GarageResponse extends GarageRow {
  parking_spots: (ParkingSpotRow & {
    owner: Pick<UserRow, 'id' | 'name' | 'avatar_url'> | null;
    parking_spot_images?: Database['public']['Tables']['parking_spot_images']['Row'][];
    bookings?: {
      id: string;
      start_time: string;
      end_time: string;
      status: string;
    }[];
  })[];
  garage_images: Database['public']['Tables']['garage_images']['Row'][];
  reviews: { rating: number }[];
}

export const parkingDal = {
  /**
   * Obtiene todos los garajes que tienen al menos una plaza activa
   */
  async fetchGaragesWithSpots(): Promise<GarageResponse[]> {
    const { data, error } = await supabase
      .from('garages')
      .select(`
        *,
        parking_spots (
          *,
          owner:users (id, name, avatar_url),
          parking_spot_images (*),
          bookings (id, start_time, end_time, status)
        ),
        garage_images (*),
        reviews (rating)
      `)
      .eq('is_active', true)
      .returns<GarageResponse[]>();

    if (data) {
      data.forEach(garage => {
        garage.parking_spots.forEach(spot => {
          if (spot.bookings) {
            spot.bookings = spot.bookings.filter(b => ['confirmed', 'active'].includes(b.status));
          }
        });
      });
    }

    if (error) throw error;
    return data || [];
  },

  /**
   * Obtiene las reseñas de un garaje específico
   */
  async fetchGarageReviews(garageId: string) {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        user:users (id, name, avatar_url)
      `)
      .eq('garage_id', garageId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Envía una nueva reseña
   */
  async insertReview(params: {
    garage_id: string;
    user_id: string;
    booking_id?: string;
    rating: number;
    comment: string;
  }) {
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        garage_id: params.garage_id,
        user_id: params.user_id,
        booking_id: params.booking_id,
        rating: params.rating,
        comment: params.comment
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Obtiene un parking spot específico por su ID prefetching de relaciones
   */
  async fetchParkingSpotById(id: string) {
    const { data, error } = await supabase
      .from('parking_spots')
      .select(`
        *,
        garage:garages (
          *,
          garage_images (*),
          reviews (rating)
        ),
        owner:users (id, name, avatar_url),
        parking_spot_images (*),
        bookings (id, start_time, end_time, status)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Obtiene reseñas de un owner específico
   */
  async fetchOwnerReviews(ownerId: string) {
    const { data, error } = await supabase
      .from('reviews')
      .select('rating, garage:garages!inner(owner_id)')
      .eq('garage.owner_id', ownerId);

    if (error) throw error;
    return data;
  },

  /**
   * Solo crea el garaje (sin plazas)
   */
  async insertGarage(data: {
    owner_id: string;
    name: string;
    address: string;
    city: string;
    lat: number;
    lng: number;
    postal_code?: string | null;
    description?: string;
  }) {
    const { data: garage, error } = await supabase
      .from('garages')
      .insert({
        owner_id: data.owner_id,
        name: data.name,
        address: data.address,
        city: data.city,
        lat: data.lat,
        lng: data.lng,
        postal_code: data.postal_code,
        total_spots: 0,
        is_active: true,
        description: data.description
      })
      .select()
      .single();

    if (error) throw error;
    return garage;
  },

  /**
   * Crea una plaza en un garaje existente e incrementa contador de plazas
   */
  async insertParkingSpot(data: {
    garage_id: string;
    owner_id: string;
    spot_number: string;
    price: number;
    description?: string;
    type: string;
  }) {
    const { data: spot, error: spotError } = await supabase
      .from('parking_spots')
      .insert({
        garage_id: data.garage_id,
        owner_id: data.owner_id,
        spot_number: data.spot_number,
        base_price_per_hour: data.price,
        current_price_per_hour: data.price,
        description: data.description,
        is_active: true,
        type: data.type
      })
      .select()
      .single();

    if (spotError) throw spotError;

    // Incrementar el contador de plazas del garaje
    await supabase.rpc('increment_garage_spots', { garage_id_param: data.garage_id });

    return spot;
  },

  /**
   * Inserta imagenes para una plaza
   */
  async insertParkingSpotImages(spotId: string, images: string[]) {
    if (!images || images.length === 0) return;

    const imagesToInsert = images.map((url, index) => ({
      parking_spot_id: spotId,
      image_url: url,
      display_order: index
    }));

    const { error } = await supabase
      .from('parking_spot_images')
      .insert(imagesToInsert);

    if (error) throw error;
  },

  /**
   * Sube o asocia imágenes a un garaje
   */
  async insertGarageImages(garageId: string, images: string[]) {
    if (!images || images.length === 0) return;

    const imagesToInsert = images.map((url, index) => ({
      garage_id: garageId,
      image_url: url,
      is_main: index === 0,
      display_order: index
    }));

    const { error } = await supabase
      .from('garage_images')
      .insert(imagesToInsert);

    if (error) throw error;
  },

  /**
   * Eliminar una plaza y decrementa contador
   */
  async deleteParkingSpot(spotId: string, garageId: string) {
    const { error } = await supabase
      .from('parking_spots')
      .delete()
      .eq('id', spotId);

    if (error) throw error;

    // Decrementar contador
    await supabase.rpc('decrement_garage_spots', { garage_id_param: garageId });
  },

  async updateGarage(garageId: string, updates: Partial<GarageRow>) {
    const { data, error } = await supabase
      .from('garages')
      .update(updates)
      .eq('id', garageId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateParkingSpot(spotId: string, updates: Partial<ParkingSpotRow>) {
    const { data, error } = await supabase
      .from('parking_spots')
      .update(updates)
      .eq('id', spotId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteGarageImages(garageId: string) {
    const { error } = await supabase
      .from('garage_images')
      .delete()
      .eq('garage_id', garageId);

    if (error) throw error;
  },

  async deleteParkingSpotImages(spotId: string) {
    const { error } = await supabase
      .from('parking_spot_images')
      .delete()
      .eq('parking_spot_id', spotId);

    if (error) throw error;
  },

  async deleteGarage(garageId: string) {
    const { error } = await supabase
      .from('garages')
      .delete()
      .eq('id', garageId);

    if (error) {
      throw error;
    }

    // Verify if it was actually deleted (check for RLS or dependency blocks)
    const { data: exists } = await supabase
      .from('garages')
      .select('id')
      .eq('id', garageId)
      .maybeSingle();

    if (exists) {
      throw new Error('El garaje no pudo ser borrado. Verifica que eres el dueño y que no tenga reservas activas.');
    }
  }
};
