import { supabase } from '../../../shared/lib/supabase';

export interface UserStats {
  totalBookings: number;
  averageRating: number;
}

export interface OwnerStats {
  totalEarnings: number;
  monthlyEarnings: number;
  totalBookings: number;
  averageRating: number;
  activeSpots: number;
}

export const profileService = {
  /**
   * Obtiene estadísticas básicas de un usuario (como inquilino)
   */
  async getUserStats(userId: string): Promise<UserStats> {
    const { count, error: bookingsError } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('renter_id', userId);

    if (bookingsError) throw bookingsError;

    // Check if user is also an owner to show their average rating
    const { data: ownerGarages } = await supabase
      .from('garages')
      .select('id')
      .eq('owner_id', userId)
      .limit(1);

    let averageRating = 5.0;
    if (ownerGarages && ownerGarages.length > 0) {
      const ownerStats = await this.getOwnerStats(userId);
      averageRating = ownerStats.averageRating;
    }

    return {
      totalBookings: count || 0,
      averageRating,
    };
  },

  /**
   * Obtiene estadísticas de un propietario
   */
  async getOwnerStats(ownerId: string): Promise<OwnerStats> {
    // 1. Obtener todas las reservas de sus plazas
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('total_price, created_at, status, spot:parking_spots!inner(owner_id)')
      .eq('spot.owner_id', ownerId)
      .in('status', ['confirmed', 'active', 'completed']);

    if (bookingsError) throw bookingsError;

    // 2. Obtener plazas activas
    const { count: activeSpots, error: spotsError } = await supabase
      .from('parking_spots')
      .select('*', { count: 'exact', head: true })
      .eq('owner_id', ownerId)
      .eq('is_active', true);

    if (spotsError) throw spotsError;

    // 3. Obtener rating real de sus garajes
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('rating, garage:garages!inner(owner_id)')
      .eq('garage.owner_id', ownerId);

    if (reviewsError) throw reviewsError;

    const avgRating = reviews && reviews.length > 0
      ? reviews.reduce((acc, current) => acc + current.rating, 0) / reviews.length
      : 5.0;

    // Calcular ingresos
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    let totalEarnings = 0;
    let monthlyEarnings = 0;

    bookings?.forEach(b => {
      const price = Number(b.total_price);
      totalEarnings += price;

      const bookingDate = new Date(b.created_at);
      if (bookingDate >= firstDayOfMonth) {
        monthlyEarnings += price;
      }
    });

    return {
      totalEarnings,
      monthlyEarnings,
      totalBookings: bookings?.length || 0,
      averageRating: Number(avgRating.toFixed(1)),
      activeSpots: activeSpots || 0,
    };
  },

  /**
   * Obtiene todos los garajes (con sus plazas) de un propietario
   */
  async getOwnerGarages(ownerId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('garages')
      .select(`
        *,
        parking_spots (*)
      `)
      .eq('owner_id', ownerId);

    if (error) throw error;
    return data || [];
  },

  /**
   * Obtiene todas las reservas hechas en plazas de este propietario
   */
  async getOwnerBookings(ownerId: string): Promise<any[]> {
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
  }
};
