// Data Access Layer

import { supabase } from '../../../shared/lib/supabase';

export const profileDal = {
  /**
   * Obtiene estadísticas básicas de un usuario (como inquilino)
   */
  async fetchUserBookingCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('renter_id', userId)
      .in('status', ['confirmed', 'active', 'pending']);

    if (error) throw error;
    return count || 0;
  },

  /**
   * Check if a user owns any garages
   */
  async checkUserIsOwner(userId: string): Promise<boolean> {
    const { data } = await supabase
      .from('garages')
      .select('id')
      .eq('owner_id', userId)
      .limit(1);

    return !!(data && data.length > 0);
  },

  /**
   * Obtienes las reservas de un propietario para calcular earnings
   */
  async fetchOwnerBookingsForStats(ownerId: string) {
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('total_price, created_at, status, spot:parking_spots!inner(owner_id)')
      .eq('spot.owner_id', ownerId)
      .in('status', ['confirmed', 'active', 'completed']);

    if (error) throw error;
    return bookings || [];
  },

  async fetchOwnerActiveSpotsCount(ownerId: string): Promise<number> {
    const { count, error } = await supabase
      .from('parking_spots')
      .select('*', { count: 'exact', head: true })
      .eq('owner_id', ownerId)
      .eq('is_active', true);

    if (error) throw error;
    return count || 0;
  },

  async fetchOwnerAverageRating(ownerId: string): Promise<number> {
    const { data: avgRating } = await supabase
      .rpc('get_owner_average_rating', { owner_uuid: ownerId });
    return Number(avgRating) || 0;
  },

  /**
   * Obtiene todos los garajes (con sus plazas) de un propietario
   */
  async fetchOwnerGarages(ownerId: string) {
    const { data, error } = await supabase
      .from('garages')
      .select(`
        *,
        garage_images (*),
        parking_spots (
          *,
          parking_spot_images (*)
        )
      `)
      .eq('owner_id', ownerId);

    if (error) throw error;
    return data || [];
  },

  /**
   * Completa las reservas pasadas (silencioso)
   */
  async autoCompletePastBookings() {
    try {
      await supabase.rpc('complete_past_bookings');
    } catch (e) {
      console.warn('Error auto-completing bookings for owner:', e);
    }
  },

  /**
   * Obtiene todas las reservas hechas en plazas de este propietario
   */
  async fetchOwnerBookings(ownerId: string) {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        renter:users!bookings_renter_id_fkey(name, email, avatar_url),
        spot:parking_spots!inner(
          spot_number,
          owner_id,
          garage:garages!inner(name, owner_id)
        )
      `)
      .eq('spot.owner_id', ownerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Obtiene todas las valoraciones recibidas en los garajes de un propietario
   */
  async fetchOwnerReviews(ownerId: string) {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        user:users!reviews_user_id_fkey(name, avatar_url),
        garage:garages!inner(name, owner_id)
      `)
      .eq('garage.owner_id', ownerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
};
