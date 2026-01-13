import { useState } from 'react';
import { Button, Input, RangeSlider } from '../ui';
import { X } from 'lucide-react';
import { useFilters, ParkingFilter } from '../../context/FilterContext';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FilterDrawer({ isOpen, onClose }: FilterDrawerProps) {
  const { filters, setTypes, setAvailability, setPriceRange, setDateTimeFilters, resetFilters } = useFilters();

  // Estado temporal mientras el drawer está abierto
  const [tempFilters, setTempFilters] = useState<ParkingFilter>(filters);

  const parkingTypes = ['Cubierta', 'Subterráneo', 'Al aire libre'];

  const handleTypeChange = (type: string) => {
    const newTypes = new Set(tempFilters.types);
    if (newTypes.has(type)) {
      newTypes.delete(type);
    } else {
      newTypes.add(type);
    }
    setTempFilters({ ...tempFilters, types: newTypes });
  };

  const handleAvailabilityToggle = () => {
    setTempFilters({
      ...tempFilters,
      availability: tempFilters.availability === 'all' ? 'available' : 'all',
    });
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

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-96 bg-card shadow-lg z-50 overflow-y-auto transform transition-transform">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Filtros</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Tipo de aparcamiento */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground">
              Tipo de aparcamiento
            </label>
            <div className="space-y-2">
              {parkingTypes.map((type) => (
                <label
                  key={type}
                  className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-accent/30 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={tempFilters.types.has(type)}
                    onChange={() => handleTypeChange(type)}
                    className="w-4 h-4 rounded cursor-pointer accent-primary"
                  />
                  <span className="text-sm text-foreground">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Disponibilidad */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground">
              Disponibilidad
            </label>
            <label className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-accent/30 transition-colors">
              <input
                type="checkbox"
                checked={tempFilters.availability === 'available'}
                onChange={handleAvailabilityToggle}
                className="w-4 h-4 rounded cursor-pointer accent-primary"
              />
              <span className="text-sm text-foreground">Solo disponibles</span>
            </label>
          </div>

          {/* Rango de precio */}
          <div className="space-y-4">
            <RangeSlider
              min={0}
              max={100}
              minValue={tempFilters.priceRange[0]}
              maxValue={tempFilters.priceRange[1]}
              onMinChange={(value) => setTempFilters({ ...tempFilters, priceRange: [value, tempFilters.priceRange[1]] })}
              onMaxChange={(value) => setTempFilters({ ...tempFilters, priceRange: [tempFilters.priceRange[0], value] })}
              step={0.5}
              label="Rango de precio (€/hora)"
              unit="€"
            />
          </div>

          {/* Fecha y hora */}
          <div className="space-y-4 pt-4 border-t border-border">
            <h3 className="text-sm font-semibold text-foreground">Fechas y horarios</h3>

            <div className="space-y-2">
              <label className="text-xs text-muted-foreground block font-medium">Fecha de inicio</label>
              <Input
                type="date"
                value={tempFilters.startDate}
                onChange={(e) => setTempFilters({ ...tempFilters, startDate: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-muted-foreground block font-medium">Hora de inicio</label>
              <Input
                type="time"
                value={tempFilters.startTime}
                onChange={(e) => setTempFilters({ ...tempFilters, startTime: e.target.value })}
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-muted-foreground block font-medium">Fecha de fin</label>
              <Input
                type="date"
                value={tempFilters.endDate}
                onChange={(e) => setTempFilters({ ...tempFilters, endDate: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-muted-foreground block font-medium">Hora de fin</label>
              <Input
                type="time"
                value={tempFilters.endTime}
                onChange={(e) => setTempFilters({ ...tempFilters, endTime: e.target.value })}
                className="h-10"
              />
            </div>
          </div>

          {/* Amenidades (placeholder) */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground">
              Amenidades
            </label>
            <div className="space-y-2 opacity-50">
              {['Cubierto', 'CCTV', 'Cargador EV'].map((amenity) => (
                <label
                  key={amenity}
                  className="flex items-center gap-3 cursor-not-allowed p-2 rounded"
                >
                  <input
                    type="checkbox"
                    disabled
                    className="w-4 h-4 rounded cursor-not-allowed"
                  />
                  <span className="text-sm text-muted-foreground">{amenity}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-muted-foreground italic">Próximamente</p>
          </div>
        </div>

        {/* Footer con botones */}
        <div className="sticky bottom-0 bg-foreground border-t border-border p-4 space-y-3">
          {isFiltered && (
            <Button
              variant="outline"
              className="w-full"
              onClick={handleResetFilters}
            >
              Limpiar filtros
            </Button>
          )}
          <Button
            className="w-full"
            onClick={handleApplyFilters}
          >
            Aplicar filtros
          </Button>
        </div>
      </div>
    </>
  );
}