import { supabase } from '../../../shared/lib/supabase';

export const smartAccessDal = {
  /**
   * Registra una acción de acceso (abrir/cerrar) directamente vinculada a la reserva.
   * Note: Tables smart_access and access_logs are being consolidated into booking_access_logs.
   */
  async insertAccessLog(bookingId: string, action: 'open' | 'close', success: boolean = true) {
    const { data, error } = await supabase
      .from('booking_access_logs')
      .insert({
        booking_id: bookingId,
        action: action,
        success: success,
        user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Unknown',
      })
      .select()
      .single();

    if (error) {
      console.error('Error in insertAccessLog:', error);
      throw error;
    }
    return data;
  }
};
