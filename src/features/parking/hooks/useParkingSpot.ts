import { useQuery } from '@tanstack/react-query';
import { parkingService } from '../services/parking.service';
import { Parking } from '../types/parking.types';

export const useParkingSpot = (id: string | undefined) => {
  return useQuery<Parking, Error>({
    queryKey: ['parking', id],
    queryFn: () => {
      if (!id) throw new Error('Parking ID is required');
      return parkingService.getParkingSpotById(id);
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
