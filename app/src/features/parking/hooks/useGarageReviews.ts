import { useQuery } from '@tanstack/react-query';
import { parkingService } from '../services/parking.service';

export const useGarageReviews = (garageId: string | undefined) => {
  return useQuery({
    queryKey: ['garage-reviews', garageId],
    queryFn: () => {
      if (!garageId) throw new Error('Garage ID is required');
      return parkingService.getGarageReviews(garageId);
    },
    enabled: !!garageId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
