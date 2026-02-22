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
