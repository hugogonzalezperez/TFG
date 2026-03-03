import { useQuery } from '@tanstack/react-query';
import { parkingService } from '../services/parking.service';
import { Garage } from '../types/parking.types';

export const useGarages = () => {
  return useQuery<Garage[], Error>({
    queryKey: ['garages'],
    queryFn: () => parkingService.getGaragesWithSpots(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
