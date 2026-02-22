import { Star, MapPin } from 'lucide-react';
import { Card, Button } from '../../../../ui';
import { useAuth } from '../../../auth';
import { useUserFavorites } from '../../hooks/useFavorites';
import { useNavigate } from 'react-router-dom';

export function FavoritesList() {
  const navigate = useNavigate();
  const { authUser } = useAuth();
  const { data: favoriteSpots = [], isLoading } = useUserFavorites(authUser?.user?.id);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Mis favoritos</h2>
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <Card key={i} className="p-4 h-48 animate-pulse bg-muted/50" />
          ))}
        </div>
      ) : favoriteSpots.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {favoriteSpots.map((spot: any) => (
            <Card key={spot.id} className="overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer flex flex-col" onClick={() => navigate(`/parking/${spot.parking_spot_id}`)}>
              <div className="h-40 w-full overflow-hidden relative">
                <img src={spot.image} alt={spot.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                  <span className="text-xs font-bold">{spot.rating > 0 ? spot.rating : 'Nuevo'}</span>
                </div>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-bold text-lg leading-tight mb-1">{spot.name}</h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mb-3">
                  <MapPin className="h-3 w-3" /> {spot.location}
                </p>
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/50">
                  <span className="text-xl font-black text-primary">{spot.price}€<span className="text-sm font-medium text-muted-foreground">/h</span></span>
                  <Button size="sm" className="bg-primary hover:bg-primary/90" onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/parking/${spot.parking_spot_id}`);
                  }}>
                    Reservar
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Aún no tienes favoritos</p>
        </Card>
      )}
    </div>
  );
}
