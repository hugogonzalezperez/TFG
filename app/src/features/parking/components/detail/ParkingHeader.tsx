import { Star } from 'lucide-react';
import { Badge } from '../../../../ui';
import { LocationLink } from '../../../../shared/components/LocationLink';

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
        <button
          onClick={() => document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' })}
          className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer group"
        >
          <Star className="h-5 w-5 fill-accent text-accent group-hover:scale-110 transition-transform" />
          <span className="font-semibold text-foreground">{rating || 'N/A'}</span>
          <span className="text-sm text-muted-foreground underline-offset-4 group-hover:underline">
            ({reviews || 0} {reviews === 1 ? 'valoración' : 'valoraciones'})
          </span>
        </button>
        <span>•</span>
        <LocationLink address={address} city={city} />
      </div>
    </div>
  );
}
