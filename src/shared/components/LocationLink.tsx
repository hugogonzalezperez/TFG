import { MapPin } from 'lucide-react';
import { cn } from '../../shared/lib/cn';
import { useIsMobile } from '../../shared/hooks/use-mobile';

interface LocationLinkProps {
  address: string;
  city?: string;
  className?: string;
}

export function LocationLink({ address, city, className }: LocationLinkProps) {
  const isMobile = useIsMobile();
  const fullAddress = city ? `${address}, ${city}` : address;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;

  return (
    <a
      href={mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        isMobile ? "flex items-start gap-2" : "inline-flex items-center gap-2",
        "text-muted-foreground hover:text-primary transition-colors cursor-pointer group min-w-0",
        className
      )}
    >
      <MapPin className={cn(
        "h-4 w-4 shrink-0 group-hover:scale-110 transition-transform",
        isMobile && "mt-0.5"
      )} />
      <span className={cn(
        "underline-offset-4 group-hover:underline min-w-0 flex-1",
        isMobile ? "break-words" : "truncate"
      )}>
        {fullAddress}
      </span>
    </a>
  );
}
