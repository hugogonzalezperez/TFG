import { MapPin, Star, Map as MapIcon } from 'lucide-react';
import { Card, Badge, Button } from '../../../ui';
import { Garage, Parking } from '../types/parking.types';
import { cn } from '../../../shared/lib/cn';
import { useIsMobile } from '../../../shared/hooks/use-mobile';

interface GarageCardProps {
  garage: Garage;
  filteredSpots: Parking[];
  isSelected?: boolean;
  onSelect: (garage: Garage) => void;
  onHover?: (garageId: string | null) => void;
  variant?: 'full' | 'compact' | 'carousel';
}

export function GarageCard({
  garage,
  filteredSpots,
  isSelected,
  onSelect,
  onHover,
  variant = 'full'
}: GarageCardProps) {
  const isMobile = useIsMobile();

  const getPriceRange = (spots: Parking[]) => {
    if (!spots || spots.length === 0) return 'N/A';
    const prices = spots.map((s) => s.current_price_per_hour);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    if (min === max) return `${min.toFixed(2)}€`;
    return `${min.toFixed(2)} - ${max.toFixed(2)}€`;
  };

  if (variant === 'carousel') {
    return (
      <div
        className={cn(
          "snap-center w-[250px] shrink-0 p-3 bg-card rounded-2xl border-2 transition-all shadow-xl",
          isSelected ? 'border-accent ring-2 ring-primary/20 scale-[1.02]' : 'border-transparent'
        )}
        onClick={() => onSelect(garage)}
      >
        <div className="flex gap-3">
          <div className="w-14 h-14 bg-muted rounded-lg flex-shrink-0 overflow-hidden relative">
            {garage.image || garage.spots?.[0]?.image ? (
              <img
                src={garage.image || garage.spots?.[0]?.image}
                alt={garage.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <MapIcon className="w-8 h-8 opacity-20" />
            )}
            <div className="absolute top-1 left-1">
              <Badge className="bg-primary/95 text-[8px] h-4 px-1 border-none font-bold">
                {getPriceRange(filteredSpots)}
              </Badge>
            </div>
          </div>
          <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
            <div>
              <h3 className="font-bold text-sm truncate leading-tight mb-1">{garage.name}</h3>
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground truncate">
                <MapPin className="h-3 w-3 shrink-0" />
                <span className="truncate">{garage.city}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Star className="h-2.5 w-2.5 fill-accent text-accent" />
                <span className="text-[10px] font-bold">{garage.rating || '4.5'}</span>
              </div>
              <Badge variant="secondary" className="text-[9px] h-4 px-1 font-bold">
                {filteredSpots.length} LIBRES
              </Badge>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div
        className={`p-4 cursor-pointer transition-colors ${isSelected
          ? 'bg-primary/5 border-l-4 border-primary'
          : 'hover:bg-muted/50 border-l-4 border-transparent'
          }`}
        onClick={() => onSelect(garage)}
        onMouseEnter={() => onHover?.(garage.id)}
        onMouseLeave={() => onHover?.(null)}
      >
        <div className="flex gap-3">
          <div className="w-20 h-20 bg-muted rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
            {garage.image || garage.spots?.[0]?.image ? (
              <img
                src={garage.image || garage.spots?.[0]?.image}
                alt={garage.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <MapIcon className="w-8 h-8 opacity-20" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold mb-1 truncate text-sm sm:text-base">{garage.name}</h3>
            <p className="text-xs text-muted-foreground mb-2 truncate">
              {garage.address}
            </p>
            <div className="flex items-center gap-2 text-xs mb-2">
              <Badge variant="secondary" className="text-[10px] h-5">
                {filteredSpots.length} libres
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-primary text-sm">{getPriceRange(filteredSpots)}/h</span>
              <div className="flex items-center gap-1">
                <span className="text-[13px] font-bold">{garage.rating || 'N/A'}</span>
                <Star className="h-4 w-4 fill-accent text-accent" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card
      className={cn(
        "w-full p-3 sm:p-4 hover:shadow-lg transition-all cursor-pointer border-2 min-h-[110px]",
        isSelected ? 'border-primary ring-1 ring-primary/20' : 'border-transparent'
      )}
      onClick={() => onSelect(garage)}
    >
      <div className="flex flex-row gap-3 sm:gap-4 h-auto min-w-0">
        {/* Imagen con tamaño fijo y responsivo */}
        <div className="w-24 h-24 sm:w-36 sm:h-36 bg-muted rounded-xl flex items-center justify-center text-muted-foreground overflow-hidden flex-shrink-0 relative">
          {garage.image || garage.spots?.[0]?.image ? (
            <img
              src={garage.image || garage.spots?.[0]?.image}
              alt={garage.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <MapIcon className="w-8 h-8 sm:w-10 sm:h-10 opacity-20" />
          )}
          {garage.is_verified && (
            <div className="absolute top-1 left-1 md:hidden">
              <div className="bg-secondary p-0.5 rounded-full shadow-sm text-white">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          <div className="space-y-1 min-w-0">
            <div className={cn(
              "flex items-start justify-between gap-2 min-w-0",
              isMobile && "flex-wrap"
            )}>
              <h3 className={cn(
                "font-bold text-base sm:text-lg leading-tight flex-1",
                isMobile ? "break-words" : "truncate"
              )}>
                {garage.name}
              </h3>
              {garage.is_verified && (
                <Badge variant="secondary" className="hidden md:flex bg-secondary/10 text-secondary border-none h-5 px-1.5 text-[10px] shrink-0">
                  ✓ Verificado
                </Badge>
              )}
            </div>

            <div className={cn(
              "text-[11px] sm:text-sm text-muted-foreground flex gap-1 min-w-0",
              isMobile ? "items-start" : "items-center"
            )}>
              <MapPin className={cn("h-3 w-3 shrink-0", isMobile && "mt-0.5")} />
              <span className={cn(
                "flex-1",
                isMobile ? "break-words" : "truncate block"
              )}>
                {garage.address}, {garage.city}
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 text-[11px] sm:text-sm mt-1 sm:mt-2">
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-accent text-accent" />
                <span className="font-bold">{garage.rating || '4.5'}</span>
              </div>
              <span className="text-muted-foreground">|</span>
              <span className="text-secondary font-medium">{filteredSpots.length} plazas</span>
            </div>
          </div>

          <div className="flex items-end justify-between mt-3 gap-2 flex-wrap">
            <div className="flex flex-col min-w-fit">
              <span className="text-lg sm:text-xl font-extrabold text-primary leading-none">{getPriceRange(filteredSpots)}</span>
              <span className="text-[10px] sm:text-xs text-muted-foreground">/hora</span>
            </div>
            <Button size="sm" className="bg-accent hover:bg-accent/90 text-white font-bold rounded-lg px-3 sm:px-4 h-8 sm:h-10 text-[10px] sm:text-sm shrink-0">
              Reservar
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
