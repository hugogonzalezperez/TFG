import { MapPin } from 'lucide-react';
import { cn } from '../../shared/lib/cn';

interface LocationLinkProps {
  address: string;
  city?: string;
  className?: string;
}

export function LocationLink({ address, city, className }: LocationLinkProps) {
  const fullAddress = city ? `${address}, ${city}` : address;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;

  return (
    <a
      href={mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer group",
        className
      )}
    >
      <MapPin className="h-4 w-4 group-hover:scale-110 transition-transform" />
      <span className="underline-offset-4 group-hover:underline">{fullAddress}</span>
    </a>
  );
}
