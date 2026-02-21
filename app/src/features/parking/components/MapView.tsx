import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useFilters } from '../context/FilterContext';
import { useGarages } from '../hooks/useGarages';
import { filterParkings } from '../utils/parkingFilters';
import { geocodingService } from '../../../shared/services/geocoding.service';

import { ParkingMap } from './ParkingMap';
import { GarageDetailModal } from './GarageDetailModal';
import { MapViewHeader } from './MapViewHeader';
import { GarageCard } from './GarageCard';
import { FilterDrawer } from './FilterDrawer';
import { FilterSidebar } from './FilterSidebar';
import { AnimatedLoader } from '../../../shared/components/loaders';
import { ErrorMessage } from '../../../ui';
import { Garage, Parking } from '../types/parking.types';
import { Button } from '../../../ui/button';
import { Map as MapIcon, List } from 'lucide-react';

export function MapView() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchData = location.state;

  const { filters, setSearchQuery, setDateTimeFilters, setSelectedParkingId } = useFilters();
  const [view, setView] = useState<'map' | 'list'>('map');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const [selectedGarage, setSelectedGarage] = useState<Garage | null>(null);
  const [hoveredGarageId, setHoveredGarageId] = useState<string | null>(null);
  const [isGarageModalOpen, setIsGarageModalOpen] = useState(false);

  // Map state
  const [mapCenter, setMapCenter] = useState<[number, number]>([28.4682, -16.2546]);
  const [mapZoom, setMapZoom] = useState(14);

  const { data: allGarages = [], isLoading: loading, error: queryError } = useGarages();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (queryError) setError('No se pudieron cargar los garajes. Revisa tu conexión.');
  }, [queryError]);

  useEffect(() => {
    if (!initialDataLoaded) {
      if (searchData?.date) {
        setDateTimeFilters({
          startDate: searchData.date,
          startTime: searchData.startTime || '',
          endDate: searchData.date,
          endTime: searchData.endTime || '',
        });
      }
      if (searchData?.location) handleGeocode(searchData.location);
      setInitialDataLoaded(true);
    }
  }, [searchData, initialDataLoaded, setDateTimeFilters]);

  const handleGeocode = async (query: string) => {
    try {
      const result = await geocodingService.forwardGeocode(query);
      if (result) {
        setMapCenter([result.lat, result.lng]);
        setMapZoom(15);
      }
    } catch (err) {
      console.error('Error centrado mapa:', err);
    }
  };

  const allSpots = useMemo(() => allGarages.flatMap((g) => g.spots || []), [allGarages]);
  const filteredSpots = useMemo(() => filterParkings(allSpots, filters), [allSpots, filters]);

  const filteredGarages = useMemo(() => {
    return allGarages.filter((g) =>
      g.spots?.some((s: Parking) => filteredSpots.some((fs) => fs.id === s.id))
    );
  }, [allGarages, filteredSpots]);

  const handleGarageClick = (garage: Garage) => {
    setSelectedGarage(garage);
    setIsGarageModalOpen(true);
  };

  const handleSpotSelect = (spot: Parking) => {
    setSelectedParkingId(spot.id);
    setIsGarageModalOpen(false);
    navigate(`/parking/${spot.id}`, { state: spot });
  };

  const garageFilteredSpots = useMemo(() => {
    if (!selectedGarage) return [];
    return filteredSpots.filter((s) => s.garage_id === selectedGarage.id);
  }, [selectedGarage, filteredSpots]);

  if (loading) return <AnimatedLoader message="Buscando plazas libres en Santa Cruz..." />;

  return (
    <div className="h-screen flex flex-col bg-background">
      <ErrorMessage message={error || ''} onClose={() => setError(null)} />

      <GarageDetailModal
        garage={selectedGarage}
        visibleSpots={garageFilteredSpots}
        isOpen={isGarageModalOpen}
        onClose={() => setIsGarageModalOpen(false)}
        onSpotSelect={handleSpotSelect}
      />

      <MapViewHeader
        view={view}
        setView={setView}
        searchQuery={filters.searchQuery}
        onSearch={setSearchQuery}
        onOpenFilters={() => setIsFilterDrawerOpen(true)}
      />

      <div className="flex-1 flex overflow-hidden">
        {view === 'list' && <FilterSidebar />}

        <div className="flex-1 relative">
          {view === 'map' ? (
            <div className="flex-1 relative h-full">
              <ParkingMap
                garages={filteredGarages}
                onGarageClick={handleGarageClick}
                selectedGarageId={selectedGarage?.id}
                hoveredGarageId={hoveredGarageId}
                center={mapCenter}
                zoom={mapZoom}
              />
            </div>
          ) : (
            <div className="w-full h-full overflow-y-auto p-4 sm:p-6 bg-muted/20">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">
                    {filteredGarages.length} garajes encontrados
                  </h2>
                </div>
                <div className="space-y-4">
                  {filteredGarages.map((garage) => (
                    <GarageCard
                      key={garage.id}
                      garage={garage}
                      filteredSpots={filteredSpots.filter((s) => s.garage_id === garage.id)}
                      isSelected={selectedGarage?.id === garage.id}
                      onSelect={handleGarageClick}
                      variant="full"
                    />
                  ))}
                  {filteredGarages.length === 0 && (
                    <div className="text-center py-12 bg-card rounded-xl border border-dashed">
                      <p className="text-muted-foreground text-lg">
                        No se encontraron garajes con estos filtros.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Desktop Sidebar (Map View) */}
        {view === 'map' && (
          <div className="hidden lg:block w-96 border-l border-border bg-card overflow-y-auto shadow-xl z-10">
            <div className="p-4 border-b border-border sticky top-0 bg-card z-20 backdrop-blur-sm bg-card/90">
              <h2 className="font-bold text-lg">{filteredGarages.length} resultados</h2>
              <p className="text-sm text-muted-foreground">en esta zona</p>
            </div>
            <div className="divide-y divide-border">
              {filteredGarages.map((garage) => (
                <GarageCard
                  key={garage.id}
                  garage={garage}
                  filteredSpots={filteredSpots.filter((s) => s.garage_id === garage.id)}
                  isSelected={selectedGarage?.id === garage.id}
                  onSelect={handleGarageClick}
                  onHover={setHoveredGarageId}
                  variant="compact"
                />
              ))}
              {filteredGarages.length === 0 && (
                <div className="p-8 text-center text-muted-foreground italic">
                  Prueba a ampliar el área de búsqueda
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-border bg-card p-3 flex gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <Button
          variant={view === 'map' ? 'default' : 'outline'}
          onClick={() => setView('map')}
          className="flex-1 gap-2 rounded-xl h-11"
        >
          <MapIcon className="h-4 w-4" />
          Mapa
        </Button>
        <Button
          variant={view === 'list' ? 'default' : 'outline'}
          onClick={() => setView('list')}
          className="flex-1 gap-2 rounded-xl h-11"
        >
          <List className="h-4 w-4" />
          Lista
        </Button>
      </div>

      <FilterDrawer isOpen={isFilterDrawerOpen} onClose={() => setIsFilterDrawerOpen(false)} />
    </div>
  );
}