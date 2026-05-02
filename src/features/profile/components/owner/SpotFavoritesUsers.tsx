import { Heart } from 'lucide-react';
import { useSpotFavoriteUsers } from '../../hooks/useFavorites';

// GDPR: muestra solo el recuento, no identidad de los usuarios que marcaron favorito
export function SpotFavoritesUsers({ spotId }: { spotId: string }) {
  const { data: users = [], isLoading } = useSpotFavoriteUsers(spotId);

  if (isLoading) return null;
  if (users.length === 0) return null;

  return (
    <div className="flex items-center gap-1 text-sm font-medium text-red-500 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
      <Heart className="h-3 w-3 fill-red-500" />
      <span>{users.length}</span>
    </div>
  );
}
