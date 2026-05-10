import { logger } from '../../../shared/lib/logger';
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
      .select('id, parking_spot_id, rule_name, day_of_week, start_time, end_time, multiplier, is_active')
      .eq('parking_spot_id', spotId)
      .eq('is_active', true);

    if (error) throw error;
    return data || [];
  },

  async checkAvailability(spotId: string, startTime: Date, endTime: Date): Promise<boolean> {
    // Margen de 30 minutos para limpieza entre reservas
    const BUFFER_MS = 30 * 60 * 1000;
    const safeStart = new Date(startTime.getTime() - BUFFER_MS).toISOString();
    const safeEnd   = new Date(endTime.getTime()   + BUFFER_MS).toISOString();

    // RPC SECURITY DEFINER — no expone PII de reservas ajenas (CRIT-E fix)
    const { data, error } = await supabase.rpc('check_parking_spot_availability', {
      p_spot_id:   spotId,
      p_start_time: safeStart,
      p_end_time:   safeEnd,
    });

    if (error) throw error;
    return data as boolean;
  },

  /**
   * Obtiene las reservas confirmadas/activas para una plaza específica en el futuro
   */
  async fetchSpotBookings(spotId: string) {
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('bookings')
      .select('id, parking_spot_id, renter_id, start_time, end_time, total_hours, total_price, status, vehicle_plate, vehicle_description')
      .eq('parking_spot_id', spotId)
      .in('status', ['confirmed', 'active'])
      .gte('end_time', now)
      .is('deleted_at', null)
      .order('start_time', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  /**
   * Obtiene el precio calculado en servidor para una reserva (seguridad: evita manipulación client-side)
   */
  async getServerCalculatedPrice(params: {
    spotId: string;
    startTime: string;
    endTime: string;
  }): Promise<{ totalPrice: number; pricePerHour: number; multiplierApplied: number; totalHours: number }> {
    const { data, error } = await supabase.functions.invoke('calculate-price', {
      body: params,
    });
    if (error) throw new Error(`Error calculando precio: ${error.message}`);
    return data;
  },

  /**
   * Inserta una reserva completa — el precio final se recalcula en servidor
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
    // Precio recalculado en servidor — ignora totalPrice del cliente
    const serverPrice = await bookingDal.getServerCalculatedPrice({
      spotId: params.spotId,
      startTime: params.startTime,
      endTime: params.endTime,
    });

    // CRIT-2: precio 0 no es válido — si la Edge Function retorna 0, algo está mal
    if (!serverPrice.totalPrice || serverPrice.totalPrice <= 0) {
      throw new Error('Precio calculado inválido. Verifica que la plaza tenga un precio base mayor a 0.');
    }

    const { data, error } = await supabase
      .from('bookings')
      .insert({
        parking_spot_id: params.spotId,
        renter_id: params.userId,
        start_time: params.startTime,
        end_time: params.endTime,
        total_hours: serverPrice.totalHours,
        total_price: serverPrice.totalPrice,
        price_per_hour_at_booking: serverPrice.pricePerHour,
        dynamic_multiplier_applied: serverPrice.multiplierApplied,
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
      await supabase.functions.invoke('complete-past-bookings');
    } catch (e) {
      logger.warn('Error auto-completing bookings:', e);
    }
  },

  /**
   * Obtiene todas las reservas de un usuario con detalles de la plaza y garaje
   */
  async fetchUserBookings(userId: string) {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        id, parking_spot_id, renter_id, start_time, end_time, total_hours, total_price,
        price_per_hour_at_booking, dynamic_multiplier_applied, status,
        vehicle_plate, vehicle_description, created_at, updated_at,
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
      .is('deleted_at', null)
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

  async deleteBooking(bookingId: string) {
    const { error } = await supabase
      .from('bookings')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', bookingId);

    if (error) throw error;
  }
};
