import { Heart } from 'lucide-react';
import { useSpotFavoriteUsers } from '../../hooks/useFavorites';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../../ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../ui/avatar';

export function SpotFavoritesUsers({ spotId }: { spotId: string }) {
  const { data: users = [], isLoading } = useSpotFavoriteUsers(spotId);

  if (isLoading) return null;
  if (users.length === 0) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex items-center gap-1 text-sm font-medium text-red-500 cursor-help bg-red-50 px-2 py-0.5 rounded-full border border-red-100 hover:bg-red-100 transition-colors">
          <Heart className="h-3 w-3 fill-red-500" />
          <span>{users.length}</span>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-3">
        <p className="text-xs font-semibold mb-2">Usuarios interesados:</p>
        <div className="flex flex-col gap-2">
          {users.map((user: any, i: number) => (
            <div key={user.id || i} className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={user.avatar_url} />
                <AvatarFallback className="text-[10px]">{user.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <span className="text-xs">{user.name || 'Usuario Anónimo'}</span>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
