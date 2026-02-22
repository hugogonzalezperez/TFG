import { Star } from 'lucide-react';
import { LocationLink } from '../../../../shared/components/LocationLink';
import { cn } from '../../../../shared/lib/cn';
import { useIsMobile } from '../../../../shared/hooks/use-mobile';

interface ParkingHeaderProps {
  name: string;
  rating?: number;
  reviews?: number;
  address: string;
  city: string;
  type?: string;
}

export function ParkingHeader({ name, rating, reviews, address, city }: ParkingHeaderProps) {
  const isMobile = useIsMobile();

  return (
    <div className={cn("space-y-4", !isMobile && "space-y-0")}>
      <h1 className={cn(
        "tracking-tight text-foreground leading-tight",
        isMobile ? "text-2xl font-extrabold" : "text-3xl font-bold mb-4"
      )}>
        {name}
      </h1>

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
