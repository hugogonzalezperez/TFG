import { MessageCircle, Star } from 'lucide-react';
import { Card, Avatar, Button } from '../../../../ui';

interface ParkingOwnerCardProps {
  owner: {
    id: string;
    name: string;
    avatar?: string;
    rating?: number;
    reviewCount?: number;
  };
}

export function ParkingOwnerCard({ owner }: ParkingOwnerCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <img src={owner.avatar} alt={owner.name} />
          </Avatar>
          <div>
            <h3 className="font-semibold text-lg">{owner.name}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-accent text-accent" />
                <span>{owner.rating !== undefined ? owner.rating : 'N/A'}</span>
              </div>
              {owner.reviewCount && (
                <>
                  <span>•</span>
                  <span>{owner.reviewCount} valoraciones</span>
                </>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Tiempo de respuesta: 1h aprox
            </p>
          </div>
        </div>
        <Button variant="outline" className="gap-2">
          <MessageCircle className="h-4 w-4" />
          Contactar
        </Button>
      </div>
    </Card>
  );
}
