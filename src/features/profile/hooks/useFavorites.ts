import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { favoritesService } from '../services/favorites.service';

export const useUserFavorites = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['user-favorites', userId],
    queryFn: () => favoritesService.getUserFavorites(userId!),
    enabled: !!userId,
  });
};

export const useIsFavorite = (userId: string | undefined, spotId: string | undefined) => {
  return useQuery({
    queryKey: ['is-favorite', userId, spotId],
    queryFn: () => favoritesService.checkIsFavorite(userId!, spotId!),
    enabled: !!userId && !!spotId,
  });
};

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, spotId, isCurrentlyFavorite }: { userId: string, spotId: string, isCurrentlyFavorite: boolean }) =>
      favoritesService.toggleFavorite(userId, spotId, isCurrentlyFavorite),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['is-favorite', variables.userId, variables.spotId] });
      queryClient.invalidateQueries({ queryKey: ['user-favorites', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['spot-favorites-users', variables.spotId] });
    },
  });
};

export const useSpotFavoriteUsers = (spotId: string | undefined) => {
  return useQuery({
    queryKey: ['spot-favorites-users', spotId],
    queryFn: () => favoritesService.getSpotFavoriteUsers(spotId!),
    enabled: !!spotId,
  });
};
