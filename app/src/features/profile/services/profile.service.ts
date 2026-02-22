import { profileDal } from './profile.dal';

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
    const totalBookings = await profileDal.fetchUserBookingCount(userId);

    // Check if user is also an owner to show their average rating
    const isOwner = await profileDal.checkUserIsOwner(userId);

    let averageRating = 5.0;
    if (isOwner) {
      const ownerStats = await this.getOwnerStats(userId);
      averageRating = ownerStats.averageRating;
    }

    return {
      totalBookings,
      averageRating,
    };
  },

  /**
   * Obtiene estadísticas de un propietario
   */
  async getOwnerStats(ownerId: string): Promise<OwnerStats> {
    // 1. Obtener todas las reservas de sus plazas
    const bookings = await profileDal.fetchOwnerBookingsForStats(ownerId);

    // 2. Obtener plazas activas
    const activeSpots = await profileDal.fetchOwnerActiveSpotsCount(ownerId);

    // 3. Obtener rating real de sus garajes mediante RPC
    const avgRating = await profileDal.fetchOwnerAverageRating(ownerId);

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
    return await profileDal.fetchOwnerGarages(ownerId);
  },

  /**
   * Obtiene todas las reservas hechas en plazas de este propietario
   */
  async getOwnerBookings(ownerId: string): Promise<any[]> {
    // Asegurar que las reservas pasadas se marquen como completadas (silencioso si falla)
    await profileDal.autoCompletePastBookings();

    const data = await profileDal.fetchOwnerBookings(ownerId);

    return data.map(b => {
      const spot = b.spot as any;
      const garage = spot?.garage;
      return {
        ...b,
        parkingName: garage?.name || 'Garaje no disponible',
        spotNumber: spot?.spot_number || 'N/A'
      };
    });
  },

  /**
   * Obtiene todas las valoraciones recibidas en los garajes de un propietario
   */
  async getOwnerReviews(ownerId: string): Promise<any[]> {
    return await profileDal.fetchOwnerReviews(ownerId);
  }
};
