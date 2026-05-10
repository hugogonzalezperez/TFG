import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { profileService } from '../services/profile.service';
import { bookingService } from '../../booking/services/booking.service';
import { supabase } from '../../../shared/lib/supabase';

export const useUserStats = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['user-stats', userId],
    queryFn: () => profileService.getUserStats(userId!),
    enabled: !!userId,
    // Provide default fallback to avoid undefined states
    select: (data) => data || { totalBookings: 0, averageRating: 5.0 },
  });
};

export const useUserBookings = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  // Realtime: invalidate on any booking change for this renter
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`user-bookings-${userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookings', filter: `renter_id=eq.${userId}` },
        () => {
          queryClient.invalidateQueries({ queryKey: ['user-bookings', userId] });
          queryClient.invalidateQueries({ queryKey: ['user-stats', userId] });
        },
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [userId, queryClient]);

  return useQuery({
    queryKey: ['user-bookings', userId],
    queryFn: () => bookingService.getUserBookings(userId!),
    enabled: !!userId,
    refetchInterval: 60000, // 1 min fallback — realtime handles instant updates
    select: (data) => [...data].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
  });
};

export const useOwnerStats = (ownerId: string | undefined) => {
  return useQuery({
    queryKey: ['owner-stats', ownerId],
    queryFn: () => profileService.getOwnerStats(ownerId!),
    enabled: !!ownerId,
    refetchInterval: 30000, // Refresh every 30s
    select: (data) => data || { totalEarnings: 0, monthlyEarnings: 0, totalBookings: 0, averageRating: 0, activeSpots: 0 },
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
    refetchInterval: 10000, // Refresh every 10s
    select: (data) => [...data].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
  });
};
export const useOwnerReviews = (ownerId: string | undefined) => {
  return useQuery({
    queryKey: ['owner-reviews', ownerId],
    queryFn: () => profileService.getOwnerReviews(ownerId!),
    enabled: !!ownerId,
  });
};
