import { Star } from 'lucide-react';
import { Card, Button } from '../../../../ui';

export function FavoritesList() {
  // Mocked for now as requested
  const favoriteSpots = [
    { id: 1, name: 'Plaza Centro', location: 'Santa Cruz', price: 2.5, rating: 4.8 },
    { id: 2, name: 'Garaje Privado Marina', location: 'Santa Cruz', price: 3.0, rating: 4.9 },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Mis favoritos</h2>
      {favoriteSpots.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {favoriteSpots.map((spot) => (
            <Card key={spot.id} className="p-4 hover:shadow-lg transition-shadow">
              <h3 className="font-semibold mb-2">{spot.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">{spot.location}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-accent text-accent" />
                  <span className="font-semibold">{spot.rating}</span>
                </div>
                <span className="text-lg font-bold text-primary">{spot.price}€/h</span>
              </div>
              <Button className="w-full mt-4 bg-primary hover:bg-primary/90">
                Reservar ahora
              </Button>
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
