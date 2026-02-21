import { MapPin, Star, Map as MapIcon } from 'lucide-react';
import { Card, Badge, Button } from '../../../ui';
import { Garage, Parking } from '../types/parking.types';

interface GarageCardProps {
  garage: Garage;
  filteredSpots: Parking[];
  isSelected?: boolean;
  onSelect: (garage: Garage) => void;
  onHover?: (garageId: string | null) => void;
  variant?: 'full' | 'compact';
}

export function GarageCard({
  garage,
  filteredSpots,
  isSelected,
  onSelect,
  onHover,
  variant = 'full'
}: GarageCardProps) {

  const getPriceRange = (spots: Parking[]) => {
    if (!spots || spots.length === 0) return 'N/A';
    const prices = spots.map((s) => s.current_price_per_hour);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    if (min === max) return `${min.toFixed(2)}€`;
    return `${min.toFixed(2)} - ${max.toFixed(2)}€`;
  };

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
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card
      className={`p-4 hover:shadow-lg transition-all cursor-pointer border-2 ${isSelected ? 'border-primary ring-1 ring-primary/20' : 'border-transparent'
        }`}
      onClick={() => onSelect(garage)}
    >
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-32 h-40 sm:h-32 bg-muted rounded-lg flex items-center justify-center text-muted-foreground overflow-hidden flex-shrink-0">
          {garage.image || garage.spots?.[0]?.image ? (
            <img
              src={garage.image || garage.spots?.[0]?.image}
              alt={garage.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <MapIcon className="w-10 h-10 opacity-20" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-lg mb-1 truncate">{garage.name}</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1 truncate">
                <MapPin className="h-4 w-4" />
                {garage.address}, {garage.city}
              </p>
            </div>
            {garage.is_verified && (
              <Badge variant="secondary" className="bg-secondary/10 text-secondary border-none">
                ✓ Verificado
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-4 text-sm mb-4">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-accent text-accent" />
              <span className="font-semibold">{garage.rating || '4.5'}</span>
              <span className="text-muted-foreground">({garage.reviews || 0})</span>
            </div>
            <span className="text-muted-foreground">•</span>
            <Badge variant="outline" className="font-normal">{filteredSpots.length} plazas disponibles</Badge>
          </div>

          <div className="flex items-center justify-between mt-auto">
            <div>
              <span className="text-xl font-bold text-primary">{getPriceRange(filteredSpots)}</span>
              <span className="text-muted-foreground text-sm"> /hora</span>
            </div>
            <Button className="bg-accent hover:bg-accent/90 text-white font-medium">
              Reservar ahora
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
