// Data Access Layer

import { supabase } from '../../../shared/lib/supabase';
import { BookingStatus, PricingRule } from '../types/booking.types';

export const bookingDal = {
  /**
   * Obtiene las reglas de precio para una plaza específica
   */
  async fetchPricingRules(spotId: string): Promise<PricingRule[]> {
    const { data, error } = await supabase
      .from('pricing_rules')
      .select('*')
      .eq('parking_spot_id', spotId)
      .eq('is_active', true);

    if (error) throw error;
    return data || [];
  },

  async checkAvailability(spotId: string, startTime: Date, endTime: Date): Promise<boolean> {
    // Para el TFG: Margen de 30 minutos (0.5 horas)
    const BUFFER_MS = 30 * 60 * 1000;

    // Rango "sucio" que queremos proteger
    const safeStart = new Date(startTime.getTime() - BUFFER_MS).toISOString();
    const safeEnd = new Date(endTime.getTime() + BUFFER_MS).toISOString();

    // Consultamos si hay reservas confirmadas que solapen con nuestro rango protegido
    const { data, error } = await supabase
      .from('bookings')
      .select('id')
      .eq('parking_spot_id', spotId)
      .in('status', ['confirmed', 'active'])
      .lt('start_time', safeEnd)
      .gt('end_time', safeStart);

    if (error) throw error;

    const hasConflict = data.length > 0;
    return !hasConflict;
  },

  /**
   * Obtiene las reservas confirmadas/activas para una plaza específica en el futuro
   */
  async fetchSpotBookings(spotId: string) {
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('parking_spot_id', spotId)
      .in('status', ['confirmed', 'active'])
      .gte('end_time', now) // Solo traemos las presentes o futuras
      .order('start_time', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  /**
   * Inserta una reserva completa
   */
  async insertBooking(params: {
    spotId: string;
    userId: string;
    startTime: string;
    endTime: string;
    totalHours: number;
    totalPrice: number;
    basePriceStr: number;
    multiplierApplied: number;
    vehiclePlate: string;
    vehicleDescription: string;
    status: BookingStatus;
  }) {
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        parking_spot_id: params.spotId,
        renter_id: params.userId,
        start_time: params.startTime,
        end_time: params.endTime,
        total_hours: params.totalHours,
        total_price: params.totalPrice,
        price_per_hour_at_booking: params.basePriceStr,
        dynamic_multiplier_applied: params.multiplierApplied,
        vehicle_plate: params.vehiclePlate,
        vehicle_description: params.vehicleDescription,
        status: params.status
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Completa las reservas pasadas (silencioso)
   */
  async autoCompletePastBookings() {
    try {
      await supabase.rpc('complete_past_bookings');
    } catch (e) {
      console.warn('Error auto-completing bookings:', e);
    }
  },

  /**
   * Obtiene todas las reservas de un usuario con detalles de la plaza y garaje
   */
  async fetchUserBookings(userId: string) {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        spot:parking_spots (
          spot_number,
          images:parking_spot_images (
            image_url,
            display_order
          ),
          garage:garages (
            id,
            name,
            address,
            city,
            images:garage_images (
              image_url,
              is_main
            )
          )
        ),
        reviews (id)
      `)
      .eq('renter_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Actualiza el status de una reserva
   */
  async updateBookingStatus(bookingId: string, status: BookingStatus) {
    const { error } = await supabase
      .from('bookings')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', bookingId);

    if (error) throw error;
  },

  /**
   * Elimina una reserva (Hard Delete)
   */
  async deleteBooking(bookingId: string) {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', bookingId);

    if (error) throw error;
  }
};
