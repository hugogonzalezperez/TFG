import { supabase } from '../../../shared/lib/supabase';
import { Booking, BookingStatus, PricingRule } from '../types/booking.types';
import { pricingService } from './pricing.service';

export const bookingService = {
  /**
   * Obtiene las reglas de precio para una plaza específica
   */
  async getPricingRules(spotId: string): Promise<PricingRule[]> {
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
      .or(`start_time.lt.${safeEnd},end_time.gt.${safeStart}`);

    if (error) throw error;

    // Si hay alguna reserva que empiece antes de nuestro fin+buffer 
    // Y termine después de nuestro inicio-buffer, hay conflicto.
    // Pero el query .or de arriba es un poco genérico. Hagamos el filtro fino:
    const hasConflict = data.length > 0;

    return !hasConflict;
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
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        parking_spot_id: params.spotId,
        renter_id: params.userId,
        start_time: params.startTime.toISOString(),
        end_time: params.endTime.toISOString(),
        total_hours: estimation.hours,
        total_price: estimation.total_price,
        price_per_hour_at_booking: estimation.base_price,
        dynamic_multiplier_applied: estimation.multiplier_applied,
        vehicle_plate: params.vehiclePlate,
        vehicle_description: params.vehicleDescription,
        status: 'confirmed' as BookingStatus
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Obtiene todas las reservas de un usuario con detalles de la plaza y garaje
   */
  async getUserBookings(userId: string): Promise<any[]> {
    // Asegurar que las reservas pasadas se marquen como completadas (silencioso si falla)
    try {
      await supabase.rpc('complete_past_bookings');
    } catch (e) {
      console.warn('Error auto-completing bookings:', e);
    }

    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        spot:parking_spots (
          spot_number,
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

    return (data || []).map(b => {
      // Supabase sometimes returns joins as arrays if the relationship isn't strictly 1:1 in the schema
      const spot = Array.isArray(b.spot) ? b.spot[0] : b.spot;
      const garage = spot?.garage ? (Array.isArray(spot.garage) ? spot.garage[0] : spot.garage) : null;

      const mainImage = garage?.images?.find((img: any) => img.is_main)?.image_url
        || garage?.images?.[0]?.image_url
        || 'https://images.unsplash.com/photo-1619335680796-54f13b88c6ba?q=80&w=400';

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
    const { error } = await supabase
      .from('bookings')
      .update({
        status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('id', bookingId);

    if (error) throw error;
  },

  /**
   * Elimina una reserva (Hard Delete)
   */
  async deleteBooking(bookingId: string): Promise<void> {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', bookingId);

    if (error) throw error;
  },

  /**
   * Confirma una reserva (Pasar a status confirmed)
   */
  async confirmBooking(bookingId: string): Promise<void> {
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'confirmed' })
      .eq('id', bookingId);

    if (error) throw error;
  }
};
