import { logger } from '../../../shared/lib/logger';
import { supabase } from '../../../shared/lib/supabase';
import { smartAccessDal } from './smartAccess.dal';

async function assertBookingActive(bookingId: string): Promise<void> {
  const now = new Date().toISOString();

  // HIGH-3: verificar que el usuario autenticado es el titular de la reserva
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No autenticado');

  const { data, error } = await supabase
    .from('bookings')
    .select('id, status, start_time, end_time')
    .eq('id', bookingId)
    .eq('renter_id', user.id)
    .single();

  if (error || !data) {
    // Mensaje genérico — no revelar si la reserva existe pero pertenece a otro usuario
    throw new Error('Reserva no encontrada');
  }

  if (data.status !== 'active') {
    throw new Error(`Acceso denegado: reserva en estado '${data.status}'`);
  }

  if (now < data.start_time || now > data.end_time) {
    throw new Error('Acceso denegado: fuera del horario de la reserva');
  }
}

export const smartAccessService = {
  async openDoor(bookingId: string): Promise<boolean> {
    try {
      await assertBookingActive(bookingId);
      await smartAccessDal.insertAccessLog(bookingId, 'open', true);
      return true;
    } catch (error) {
      logger.error('Error opening door:', error);
      await smartAccessDal.insertAccessLog(bookingId, 'open', false).catch(() => {});
      return false;
    }
  },

  async closeDoor(bookingId: string): Promise<boolean> {
    try {
      await assertBookingActive(bookingId);
      await smartAccessDal.insertAccessLog(bookingId, 'close', true);
      return true;
    } catch (error) {
      logger.error('Error closing door:', error);
      await smartAccessDal.insertAccessLog(bookingId, 'close', false).catch(() => {});
      return false;
    }
  }
};
