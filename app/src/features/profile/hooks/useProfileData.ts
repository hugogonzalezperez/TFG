import { useQuery } from '@tanstack/react-query';
import { profileService } from '../services/profile.service';
import { bookingService } from '../../booking/services/booking.service';

export const useUserStats = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['user-stats', userId],
    queryFn: () => profileService.getUserStats(userId!),
    enabled: !!userId,
  });
};

export const useUserBookings = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['user-bookings', userId],
    queryFn: () => bookingService.getUserBookings(userId!),
    enabled: !!userId,
  });
};

export const useOwnerStats = (ownerId: string | undefined) => {
  return useQuery({
    queryKey: ['owner-stats', ownerId],
    queryFn: () => profileService.getOwnerStats(ownerId!),
    enabled: !!ownerId,
  });
};

export const useOwnerGarages = (ownerId: string | undefined) => {
  return useQuery({
    queryKey: ['owner-garages', ownerId],
    queryFn: () => profileService.getOwnerGarages(ownerId!),
    enabled: !!ownerId,
  });
};

export const useOwnerBookings = (ownerId: string | undefined) => {
  return useQuery({
    queryKey: ['owner-bookings', ownerId],
    queryFn: () => profileService.getOwnerBookings(ownerId!),
    enabled: !!ownerId,
  });
};
