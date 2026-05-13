import { useState } from 'react';
import { Button, DatePicker, TimePicker } from '../../../ui';
import { RangeSlider } from '../../../ui/RangeSlider';
import { ChevronDown } from 'lucide-react';
import { useFilters } from '../context/FilterContext';
import { toLocalDateStr, getMinTimeForDate, laterTime, addOneMinute } from '@/shared/lib/time-utils';

export function FilterSidebar() {
  const { filters, toggleType, setAvailability, setPriceRange, setDateTimeFilters, resetFilters } = useFilters();
  const [expandedSections, setExpandedSections] = useState({
    type: true,
    availability: true,
    price: true,
    datetime: false,
  });

  const parkingTypes = ['Cubierta', 'Subterráneo', 'Al aire libre'];

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleTypeChange = (type: string) => {
    toggleType(type);
  };

  const handleAvailabilityToggle = () => {
    setAvailability(filters.availability === 'all' ? 'available' : 'all');
  };

  const isFiltered =
    filters.types.size < 3 ||
    filters.availability !== 'all' ||
    filters.priceRange[0] !== 0 ||
    filters.priceRange[1] !== 100 ||
    filters.startDate !== '' ||
    filters.startTime !== '' ||
    filters.endDate !== '' ||
    filters.endTime !== '';

  return (
    <div className="w-80 bg-card border-r border-border overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-card border-b border-border p-4 z-10">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold text-lg">Filtros</h2>
          {isFiltered && (
            <span className="px-2 py-1 bg-primary text-white text-xs rounded-full font-medium">
              Activos
            </span>
          )}
        </div>
        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="w-full text-muted-foreground hover:text-foreground text-xs"
          >
            Limpiar filtros
          </Button>
        )}
      </div>

      {/* Contenido */}
      <div className="p-4 space-y-4">
        {/* Tipo de aparcamiento */}
        <div className="border-b border-border pb-4">
          <button
            onClick={() => toggleSection('type')}
            className="flex items-center gap-2 font-semibold text-foreground w-full hover:text-primary transition-colors mb-3"
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform ${expandedSections.type ? 'rotate-0' : '-rotate-90'
                }`}
            />
            Tipo de aparcamiento
          </button>
          {expandedSections.type && (
            <div className="space-y-2 ml-2">
              {parkingTypes.map((type) => (
                <label
                  key={type}
                  className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-accent/30 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={filters.types.has(type)}
                    onChange={() => handleTypeChange(type)}
                    className="w-4 h-4 rounded cursor-pointer accent-primary"
                  />
                  <span className="text-sm text-foreground">{type}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Disponibilidad */}
        <div className="border-b border-border pb-4">
          <button
            onClick={() => toggleSection('availability')}
            className="flex items-center gap-2 font-semibold text-foreground w-full hover:text-primary transition-colors mb-3"
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform ${expandedSections.availability ? 'rotate-0' : '-rotate-90'
                }`}
            />
            Disponibilidad
          </button>
          {expandedSections.availability && (
            <div className="ml-2">
              <label className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-accent/30 transition-colors">
                <input
                  type="checkbox"
                  checked={filters.availability === 'available'}
                  onChange={handleAvailabilityToggle}
                  className="w-4 h-4 rounded cursor-pointer accent-primary"
                />
                <span className="text-sm text-foreground">Solo disponibles</span>
              </label>
            </div>
          )}
        </div>

        {/* Rango de precio */}
        <div className="pb-4">
          <button
            onClick={() => toggleSection('price')}
            className="flex items-center gap-2 font-semibold text-foreground w-full hover:text-primary transition-colors mb-3"
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform ${expandedSections.price ? 'rotate-0' : '-rotate-90'
                }`}
            />
            Precio (€/hora)
          </button>
          {expandedSections.price && (
            <div className="ml-2 pt-2">
              <RangeSlider
                min={0}
                max={100}
                minValue={filters.priceRange[0]}
                maxValue={filters.priceRange[1]}
                onMinChange={(value) => setPriceRange([value, filters.priceRange[1]])}
                onMaxChange={(value) => setPriceRange([filters.priceRange[0], value])}
                step={0.5}
                label=""
                unit="€"
              />
            </div>
          )}
        </div>

        {/* Fecha y hora */}
        <div className="border-b border-border pb-4">
          <button
            onClick={() => toggleSection('datetime')}
            className="flex items-center gap-2 font-semibold text-foreground w-full hover:text-primary transition-colors"
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform ${expandedSections.datetime ? 'rotate-0' : '-rotate-90'
                }`}
            />
            Fechas y horarios
          </button>
          {expandedSections.datetime && (
            <div className="space-y-3 ml-2 pt-3">
              {/* Entrada */}
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground font-medium block">Entrada</label>
                <div className="flex gap-1.5">
                  <div className="flex-[3] min-w-0">
                    <DatePicker
                      date={filters.startDate ? new Date(filters.startDate) : undefined}
                      onChange={(date) => {
                        const val = date ? toLocalDateStr(date) : '';
                        const endDate = (date && filters.endDate && new Date(filters.endDate) < date)
                          ? val
                          : filters.endDate;
                        setDateTimeFilters({ startDate: val, startTime: filters.startTime, endDate, endTime: filters.endTime });
                      }}
                      minDate={new Date()}
                      placeholder="Fecha"
                      className="h-9 text-xs"
                    />
                  </div>
                  <div className="flex-[2] min-w-0">
                    <TimePicker
                      value={filters.startTime}
                      onChange={(val) => {
                        const sameDay = filters.startDate && filters.startDate === filters.endDate;
                        const endTime = sameDay && filters.endTime && filters.endTime <= val ? '' : filters.endTime;
                        setDateTimeFilters({ startDate: filters.startDate, startTime: val, endDate: filters.endDate, endTime });
                      }}
                      minTime={getMinTimeForDate(filters.startDate || undefined)}
                      className="h-9 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Salida */}
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground font-medium block">Salida</label>
                <div className="flex gap-1.5">
                  <div className="flex-[3] min-w-0">
                    <DatePicker
                      date={filters.endDate ? new Date(filters.endDate) : undefined}
                      onChange={(date) => {
                        const val = date ? toLocalDateStr(date) : '';
                        const sameDay = val && val === filters.startDate;
                        const endTime = sameDay && filters.endTime && filters.endTime <= filters.startTime ? '' : filters.endTime;
                        setDateTimeFilters({ startDate: filters.startDate, startTime: filters.startTime, endDate: val, endTime });
                      }}
                      minDate={filters.startDate ? new Date(filters.startDate) : new Date()}
                      placeholder="Fecha"
                      className="h-9 text-xs"
                    />
                  </div>
                  <div className="flex-[2] min-w-0">
                    <TimePicker
                      value={filters.endTime}
                      onChange={(val) => setDateTimeFilters({ startDate: filters.startDate, startTime: filters.startTime, endDate: filters.endDate, endTime: val })}
                      minTime={laterTime(
                        getMinTimeForDate(filters.endDate || undefined),
                        filters.startDate && filters.endDate && filters.startDate === filters.endDate
                          ? addOneMinute(filters.startTime)
                          : undefined,
                      )}
                      className="h-9 text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}