import { Star, MapPin } from 'lucide-react';
import { Badge } from '../../../../ui';

interface ParkingHeaderProps {
  name: string;
  rating?: number;
  reviews?: number;
  address: string;
  city: string;
  type?: string;
}

export function ParkingHeader({ name, rating, reviews, address, city, type }: ParkingHeaderProps) {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{name}</h1>
      <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-4">
        <div className="flex items-center gap-1">
          <Star className="h-5 w-5 fill-accent text-accent" />
          <span className="font-semibold text-foreground">{rating || 'N/A'}</span>
          <span>({reviews || 0} valoraciones)</span>
        </div>
        <span>•</span>
        <div className="flex items-center gap-1">
          <MapPin className="h-5 w-5" />
          <span>{address}, {city}</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline">{type}</Badge>
        <Badge variant="outline" className="bg-secondary/10 text-secondary">
          Disponible ahora
        </Badge>
      </div>
    </div>
  );
}
