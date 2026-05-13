import { useQuery } from '@tanstack/react-query';
import { bookingService } from '../services/booking.service';
import { Booking } from '../types/booking.types';

export const useSpotBookings = (spotId: string | undefined) => {
  return useQuery<Booking[], Error>({
    queryKey: ['spotBookings', spotId],
    queryFn: () => {
      if (!spotId) throw new Error('Spot ID is required');
      return bookingService.getSpotBookings(spotId);
    },
    enabled: !!spotId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export interface RichBooking {
  id: string;
  parking_spot_id: string;
  renter_id: string;
  start_time: string;
  end_time: string;
  total_hours: number;
  total_price: number;
  status: Booking['status'];
  renter: { id: string; name: string; avatar_url: string | null } | null;
}

export const useSpotBookingsRich = (spotId: string | undefined) => {
  return useQuery<RichBooking[], Error>({
    queryKey: ['spotBookingsRich', spotId],
    queryFn: () => {
      if (!spotId) throw new Error('Spot ID is required');
      return bookingService.getSpotBookingsRich(spotId) as Promise<RichBooking[]>;
    },
    enabled: !!spotId,
    staleTime: 1000 * 60 * 2,
  });
};
