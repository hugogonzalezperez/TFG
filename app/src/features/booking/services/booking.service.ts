import { Booking, BookingStatus, PricingRule } from '../types/booking.types';
import { pricingService } from './pricing.service';
import { bookingDal } from './booking.dal';

export const bookingService = {
  /**
   * Obtiene las reglas de precio para una plaza específica
   */
  async getPricingRules(spotId: string): Promise<PricingRule[]> {
    return await bookingDal.fetchPricingRules(spotId);
  },

  async checkAvailability(spotId: string, startTime: Date, endTime: Date): Promise<boolean> {
    return await bookingDal.checkAvailability(spotId, startTime, endTime);
  },

  /**
   * Obtiene las reservas confirmadas/activas para una plaza específica en el futuro
   */
  async getSpotBookings(spotId: string): Promise<Booking[]> {
    return await bookingDal.fetchSpotBookings(spotId) as any;
  },

  /**
   * Crea una reserva completa
   */
  async createBooking(params: {
    spotId: string;
    userId: string;
    startTime: Date;
    endTime: Date;
    basePrice: number;
    vehiclePlate: string;
    vehicleDescription: string;
  }): Promise<Booking> {
    // 1. Obtener reglas y calcular precio final (Seguridad lado cliente + validación DB)
    const rules = await this.getPricingRules(params.spotId);
    const estimation = pricingService.calculateEstimation(
      params.basePrice,
      params.startTime,
      params.endTime,
      rules
    );

    // 2. Insertar reserva
    const data = await bookingDal.insertBooking({
      spotId: params.spotId,
      userId: params.userId,
      startTime: params.startTime.toISOString(),
      endTime: params.endTime.toISOString(),
      totalHours: estimation.hours,
      totalPrice: estimation.total_price,
      basePriceStr: estimation.base_price,
      multiplierApplied: estimation.multiplier_applied,
      vehiclePlate: params.vehiclePlate,
      vehicleDescription: params.vehicleDescription,
      status: 'confirmed' as BookingStatus
    });

    return data as any;
  },

  /**
   * Obtiene todas las reservas de un usuario con detalles de la plaza y garaje
   */
  async getUserBookings(userId: string): Promise<any[]> {
    // Asegurar que las reservas pasadas se marquen como completadas (silencioso si falla)
    await bookingDal.autoCompletePastBookings();

    const data = await bookingDal.fetchUserBookings(userId);

    return data.map(b => {
      // Supabase sometimes returns joins as arrays if the relationship isn't strictly 1:1 in the schema
      const spot = Array.isArray(b.spot) ? b.spot[0] : b.spot;
      const garage = spot?.garage ? (Array.isArray(spot.garage) ? spot.garage[0] : spot.garage) : null;

      const spotImage = spot?.images?.[0]?.image_url;
      const garageImage = garage?.images?.find((img: any) => img.is_main)?.image_url || garage?.images?.[0]?.image_url;

      const mainImage = spotImage || garageImage || 'https://images.unsplash.com/photo-1619335680796-54f13b88c6ba?q=80&w=400';

      const hasReview = Array.isArray(b.reviews) ? b.reviews.length > 0 : !!b.reviews;

      return {
        ...b,
        parkingName: garage?.name || (spot ? `Plaza ${spot.spot_number}` : 'Garaje no disponible'),
        location: garage ? `${garage.address}, ${garage.city}` : 'Ubicación no disponible',
        spotNumber: spot?.spot_number || 'N/A',
        image: mainImage,
        rated: hasReview,
        garage_id: garage?.id || spot?.garage_id
      };
    });
  },

  /**
   * Cancela una reserva
   */
  async cancelBooking(bookingId: string): Promise<void> {
    await bookingDal.updateBookingStatus(bookingId, 'cancelled');
  },

  /**
   * Elimina una reserva (Hard Delete)
   */
  async deleteBooking(bookingId: string): Promise<void> {
    await bookingDal.deleteBooking(bookingId);
  },

  /**
   * Confirma una reserva (Pasar a status confirmed)
   */
  async confirmBooking(bookingId: string): Promise<void> {
    await bookingDal.updateBookingStatus(bookingId, 'confirmed');
  }
};
