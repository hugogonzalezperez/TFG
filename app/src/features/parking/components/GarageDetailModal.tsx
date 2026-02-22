import { Garage, Parking } from '../types/parking.types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../../../ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '../../../ui/drawer';
import { Button } from '../../../ui/button';
import { Badge } from '../../../ui/badge';
import { MapPin, Euro, Car, ArrowRight } from 'lucide-react';
import { cn } from '../../../shared/lib/cn';
import { useIsMobile } from '../../../shared/hooks/use-mobile';

interface GarageDetailModalProps {
  garage: Garage | null;
  visibleSpots?: Parking[];
  isOpen: boolean;
  onClose: () => void;
  onSpotSelect: (spot: Parking) => void;
}

export function GarageDetailModal({
  garage,
  visibleSpots,
  isOpen,
  onClose,
  onSpotSelect,
}: GarageDetailModalProps) {
  const isMobile = useIsMobile();

  if (!garage) return null;

  const spotsToShow = visibleSpots ?? garage.spots ?? [];

  const getPriceRange = (spots: Parking[]) => {
    if (!spots || spots.length === 0) return 'N/A';
    const prices = spots.map((s) => s.current_price_per_hour);
    const min = Math.min(...prices);
    const max = Math.max(...prices);

    if (min === max) return `${min.toFixed(2)}€`;
    return `${min.toFixed(2)}€ - ${max.toFixed(2)}€`;
  };

  const getSpotTypeLabel = (type?: string) => {
    switch (type) {
      case 'Cubierta': return 'Cubierta';
      case 'Subterráneo': return 'Subterránea';
      case 'Al aire libre': return 'Exterior';
      default: return 'Estándar';
    }
  }

  const getSpotTypeColor = (type?: string) => {
    switch (type) {
      case 'Subterráneo': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
      case 'Al aire libre': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      default: return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
    }
  }

  const Content = (
    <>
      {/* Header con imagen o fallback */}
      <div className="relative h-32 md:h-40 w-full bg-muted/50 overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent z-10" />

        {/* Imagen real del garaje o fallback */}
        <div className="absolute inset-0">
          {garage.image ? (
            <img
              src={garage.image}
              alt={garage.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-primary/5">
              <Car className="w-12 h-12 opacity-20" />
            </div>
          )}
        </div>

        <div className="absolute bottom-4 left-6 z-20">
          <Badge variant="secondary" className="mb-2 bg-background/80 backdrop-blur text-foreground">
            <Euro className="w-3 h-3 mr-1" />
            {getPriceRange(garage.spots || [])} / hora
          </Badge>
        </div>
      </div>

      <div className="p-5 md:p-6 pt-2 flex flex-col gap-6 overflow-y-auto min-h-0">
        <div className="text-left">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                {garage.name}
              </h2>
              <p className="flex items-center mt-1 text-sm md:text-base text-muted-foreground">
                <MapPin className="w-4 h-4 mr-1 shrink-0" />
                <span className="line-clamp-1">{garage.address}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 pb-4">
          <h3 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">
            Plazas Disponibles ({spotsToShow.length})
          </h3>

          <div className="grid gap-3">
            {spotsToShow.map((spot) => (
              <div
                key={spot.id}
                className={cn(
                  "group relative flex items-center justify-between p-4 rounded-xl border bg-card hover:border-primary/50 hover:shadow-sm transition-all cursor-pointer",
                  !spot.is_active && "opacity-60 grayscale"
                )}
                onClick={() => onSpotSelect(spot)}
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">{spot.spot_number}</span>
                    <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium", getSpotTypeColor(spot.type))}>
                      {getSpotTypeLabel(spot.type)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {spot.description || "Sin descripción"}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="block font-bold text-lg text-primary">
                      {spot.current_price_per_hour.toFixed(2)}€
                    </span>
                    <span className="text-xs text-muted-foreground">/ hora</span>
                  </div>
                  <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {spotsToShow.length === 0 && (
            <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-xl border border-dashed">
              No hay plazas disponibles con los filtros seleccionados
            </div>
          )}
        </div>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DrawerContent className="max-h-[85vh]">
          {Content}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-hidden flex flex-col p-0 gap-0">
        {Content}
      </DialogContent>
    </Dialog>
  );
}
