import { useState, useEffect } from 'react';
import {
  Button,
  Input,
  RangeSlider,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from '../../../ui';
import { X } from 'lucide-react';
import { useFilters } from '../context/FilterContext';
import { ParkingFilter } from '../types/parking.types';
import { useIsMobile } from '../../../shared/hooks/use-mobile';
import { cn } from '../../../shared/lib/cn';
import { ScrollArea } from '@radix-ui/react-scroll-area';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FilterDrawer({ isOpen, onClose }: FilterDrawerProps) {
  const isMobile = useIsMobile();
  const { filters, setTypes, setAvailability, setPriceRange, setDateTimeFilters, resetFilters } = useFilters();

  // Estado temporal mientras el drawer está abierto
  const [tempFilters, setTempFilters] = useState<ParkingFilter>(filters);
  const [hasChanged, setHasChanged] = useState(false);

  // Sincronizar tempFilters con filters cuando se abre
  useEffect(() => {
    if (isOpen) {
      setTempFilters(filters);
      setHasChanged(false);
    }
  }, [isOpen, filters]);

  // Aplicar filtros automáticamente al cerrar si han cambiado
  useEffect(() => {
    if (!isOpen && hasChanged) {
      setTypes(tempFilters.types);
      setAvailability(tempFilters.availability);
      setPriceRange(tempFilters.priceRange);
      setDateTimeFilters({
        startDate: tempFilters.startDate,
        startTime: tempFilters.startTime,
        endDate: tempFilters.endDate,
        endTime: tempFilters.endTime,
      });
    }
  }, [isOpen, hasChanged, tempFilters, setTypes, setAvailability, setPriceRange, setDateTimeFilters]);

  const parkingTypes = ['Cubierta', 'Subterráneo', 'Al aire libre'];

  const handleTypeChange = (type: string) => {
    const newTypes = new Set(tempFilters.types);
    if (newTypes.has(type)) {
      newTypes.delete(type);
    } else {
      newTypes.add(type);
    }
    setTempFilters({ ...tempFilters, types: newTypes });
    setHasChanged(true);
  };

  const handleAvailabilityToggle = () => {
    setTempFilters({
      ...tempFilters,
      availability: tempFilters.availability === 'all' ? 'available' : 'all',
    });
    setHasChanged(true);
  };

  const handlePriceChange = (min: number, max: number) => {
    setTempFilters({ ...tempFilters, priceRange: [min, max] });
    setHasChanged(true);
  };

  const handleApplyFilters = () => {
    setTypes(tempFilters.types);
    setAvailability(tempFilters.availability);
    setPriceRange(tempFilters.priceRange);
    setDateTimeFilters({
      startDate: tempFilters.startDate,
      startTime: tempFilters.startTime,
      endDate: tempFilters.endDate,
      endTime: tempFilters.endTime,
    });
    setHasChanged(false); // Evitar que el useEffect de cierre lo vuelva a aplicar
    onClose();
  };

  const handleResetFilters = () => {
    resetFilters();
    setTempFilters({
      types: new Set(['Cubierta', 'Subterráneo', 'Al aire libre']),
      availability: 'all',
      priceRange: [0, 100],
      amenities: new Set(),
      searchQuery: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
    });
    setHasChanged(true);
  };

  const isFiltered =
    tempFilters.types.size < 3 ||
    tempFilters.availability !== 'all' ||
    tempFilters.priceRange[0] !== 0 ||
    tempFilters.priceRange[1] !== 100 ||
    tempFilters.startDate !== '' ||
    tempFilters.startTime !== '' ||
    tempFilters.endDate !== '' ||
    tempFilters.endTime !== '';

  const Content = (
    <div className="flex flex-col h-full max-h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 space-y-8 min-h-0">
        {/* Tipo de aparcamiento */}
        <div className="space-y-4">
          <label className="text-sm font-bold text-foreground uppercase tracking-wider">
            Tipo de aparcamiento
          </label>
          <div className="grid grid-cols-1 gap-2">
            {parkingTypes.map((type) => (
              <label
                key={type}
                className={cn(
                  "flex items-center gap-3 cursor-pointer p-3 rounded-xl border transition-all",
                  tempFilters.types.has(type)
                    ? "bg-primary/5 border-primary shadow-sm"
                    : "bg-muted/30 border-transparent hover:bg-muted/50"
                )}
              >
                <input
                  type="checkbox"
                  checked={tempFilters.types.has(type)}
                  onChange={() => handleTypeChange(type)}
                  className="w-5 h-5 rounded-md cursor-pointer accent-primary border-muted"
                />
                <span className="text-sm font-medium text-foreground">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Disponibilidad */}
        <div className="space-y-4">
          <label className="text-sm font-bold text-foreground uppercase tracking-wider">
            Disponibilidad
          </label>
          <label className={cn(
            "flex items-center gap-3 cursor-pointer p-4 rounded-xl border transition-all",
            tempFilters.availability === 'available'
              ? "bg-primary/5 border-primary shadow-sm"
              : "bg-muted/30 border-transparent hover:bg-muted/50"
          )}>
            <input
              type="checkbox"
              checked={tempFilters.availability === 'available'}
              onChange={handleAvailabilityToggle}
              className="w-5 h-5 rounded-md cursor-pointer accent-primary"
            />
            <span className="text-sm font-medium text-foreground">Solo mostrar plazas disponibles</span>
          </label>
        </div>

        {/* Rango de precio */}
        <div className="space-y-6">
          <label className="text-sm font-bold text-foreground uppercase tracking-wider">
            Presupuesto
          </label>
          <div className="px-2">
            <RangeSlider
              min={0}
              max={100}
              minValue={tempFilters.priceRange[0]}
              maxValue={tempFilters.priceRange[1]}
              onMinChange={(value) => handlePriceChange(value, tempFilters.priceRange[1])}
              onMaxChange={(value) => handlePriceChange(tempFilters.priceRange[0], value)}
              step={0.5}
              unit="€"
            />
          </div>
        </div>

        {/* Fecha y hora */}
        <div className="space-y-6 pt-6 border-t border-border">
          <label className="text-sm font-bold text-foreground uppercase tracking-wider">
            Fechas de reserva
          </label>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground font-semibold">Entrada</label>
                <Input
                  type="date"
                  value={tempFilters.startDate}
                  onChange={(e) => {
                    setTempFilters({ ...tempFilters, startDate: e.target.value });
                    setHasChanged(true);
                  }}
                  min={new Date().toISOString().split('T')[0]}
                  className="h-11 bg-muted/20 border-muted focus:border-primary rounded-lg text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground font-semibold">Hora</label>
                <Input
                  type="time"
                  value={tempFilters.startTime}
                  onChange={(e) => {
                    setTempFilters({ ...tempFilters, startTime: e.target.value });
                    setHasChanged(true);
                  }}
                  className="h-11 bg-muted/20 border-muted focus:border-primary rounded-lg text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground font-semibold">Salida</label>
                <Input
                  type="date"
                  value={tempFilters.endDate}
                  onChange={(e) => {
                    setTempFilters({ ...tempFilters, endDate: e.target.value });
                    setHasChanged(true);
                  }}
                  min={tempFilters.startDate || new Date().toISOString().split('T')[0]}
                  className="h-11 bg-muted/20 border-muted focus:border-primary rounded-lg text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground font-semibold">Hora</label>
                <Input
                  type="time"
                  value={tempFilters.endTime}
                  onChange={(e) => {
                    setTempFilters({ ...tempFilters, endTime: e.target.value });
                    setHasChanged(true);
                  }}
                  className="h-11 bg-muted/20 border-muted focus:border-primary rounded-lg text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer con botones - Visible siempre */}
      <div className="bg-card border-t border-border p-4 space-y-3 pb-10 md:pb-6 flex-shrink-0">
        <Button
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12 shadow-xl shadow-primary/20 rounded-xl"
          onClick={handleApplyFilters}
        >
          {isFiltered ? 'Ver resultados' : 'Aplicar filtros'}
        </Button>
        {isFiltered && (
          <Button
            variant="ghost"
            className="w-full text-muted-foreground hover:text-background h-10 text-xs"
            onClick={handleResetFilters}
          >
            Restablecer todo
          </Button>
        )}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DrawerContent className="h-[90vh] flex flex-col">
          <DrawerHeader className="border-b border-border text-center flex-shrink-0">
            <DrawerTitle>Filtros</DrawerTitle>
          </DrawerHeader>
          <div className="flex-1 min-h-0">
            {Content}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="p-0 sm:max-w-md flex flex-col">
        <SheetHeader className="p-6 border-b border-border flex-shrink-0">
          <SheetTitle>Filtros de búsqueda</SheetTitle>
        </SheetHeader>
        <div className="flex-1 min-h-0">
          {Content}
        </div>
      </SheetContent>
    </Sheet>
  );
}