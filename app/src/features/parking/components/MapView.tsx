import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useFilters } from '../context/FilterContext';
import { useGarages } from '../hooks/useGarages';
import { filterParkings } from '../utils/parkingFilters';
import { geocodingService } from '../../../shared/services/geocoding.service';
import { cn } from '../../../shared/lib/cn';
import { useIsMobile } from '../../../shared/hooks/use-mobile';

import { ParkingMap } from './ParkingMap';
import { GarageDetailModal } from './GarageDetailModal';
import { MapViewHeader } from './MapViewHeader';
import { GarageCard } from './GarageCard';
import { FilterDrawer } from './FilterDrawer';
import { FilterSidebar } from './FilterSidebar';
import { AnimatedLoader } from '../../../shared/components/loaders';
import { ErrorMessage, Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '../../../ui';
import { Garage, Parking } from '../types/parking.types';
import { Button } from '../../../ui/button';
import { Map as MapIcon, List } from 'lucide-react';

export function MapView() {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const searchData = location.state;

  const { filters, setSearchQuery, setDateTimeFilters, setSelectedParkingId } = useFilters();
  const [view, setView] = useState<'map' | 'list'>('map');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const [selectedGarage, setSelectedGarage] = useState<Garage | null>(null);
  const [hoveredGarageId, setHoveredGarageId] = useState<string | null>(null);
  const [isGarageModalOpen, setIsGarageModalOpen] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

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
      if (searchData?.startDate) {
        setDateTimeFilters({
          startDate: searchData.startDate,
          startTime: searchData.startTime || '',
          endDate: searchData.endDate || searchData.startDate,
          endTime: searchData.endTime || '',
        });
      }
      if (searchData?.location) {
        handleGeocode(searchData.location);
        setSearchQuery(searchData.location);
      }
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
    const isAlreadySelected = selectedGarage?.id === garage.id;

    setSelectedGarage(garage);
    setMapCenter([garage.lat, garage.lng]);
    setMapZoom(16);

    if (isMobile) {
      if (view === 'list' || isAlreadySelected) {
        setIsGarageModalOpen(true);
      } else {
        // En móvil, hacemos scroll al elemento en el carrusel
        const index = filteredGarages.findIndex(g => g.id === garage.id);
        if (index !== -1 && carouselRef.current) {
          const cardWidth = 262; // 250px w + 12px gap
          carouselRef.current.scrollTo({
            left: index * cardWidth,
            behavior: 'smooth'
          });
        }
      }
    } else {
      setIsGarageModalOpen(true);
    }
  };

  // Sincronizar carrusel -> mapa
  const handleCarouselScroll = () => {
    if (!carouselRef.current || !isMobile || view !== 'map') return;

    const scrollLeft = carouselRef.current.scrollLeft;
    const cardWidth = 262;
    const index = Math.round(scrollLeft / cardWidth);

    if (filteredGarages[index] && filteredGarages[index].id !== selectedGarage?.id) {
      const g = filteredGarages[index];
      setSelectedGarage(g);
      setMapCenter([g.lat, g.lng]);
    }
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

      <div className="flex-1 flex overflow-hidden min-w-0">
        {view === 'list' && !isMobile && <FilterSidebar />}

        <div className="flex-1 relative min-w-0">
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

              {/* Mobile Carousel - Estilo Airbnb */}
              {isMobile && filteredGarages.length > 0 && (
                <div
                  ref={carouselRef}
                  onScroll={handleCarouselScroll}
                  className="absolute bottom-20 left-0 right-0 z-20 flex gap-3 px-6 overflow-x-auto snap-x scroll-smooth no-scrollbar pb-4"
                >
                  {filteredGarages.map((garage) => (
                    <GarageCard
                      key={garage.id}
                      garage={garage}
                      filteredSpots={filteredSpots.filter((s) => s.id === garage.id || s.garage_id === garage.id)}
                      isSelected={selectedGarage?.id === garage.id}
                      onSelect={handleGarageClick}
                      variant="carousel"
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="absolute inset-0 overflow-y-auto overflow-x-hidden bg-muted/20">
              <div className="w-full px-4 py-6 sm:px-6 max-w-4xl mx-auto pb-40 space-y-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-extrabold tracking-tight">
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
          <div className="hidden lg:block w-120 border-l border-border bg-card overflow-y-auto shadow-xl z-10">
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

      {/* Mobile Navigation - Apple Maps style floating toggle */}
      <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-30 flex bg-card/90 backdrop-blur-md border border-border p-0.5 rounded-full shadow-2xl scale-[1] sm:scale-100">
        <button
          onClick={() => setView('map')}
          className={cn(
            "flex items-center gap-2 px-6 py-1.5 rounded-full text-sm font-semibold transition-all",
            view === 'map'
              ? "bg-primary text-white shadow-lg"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <MapIcon className="h-4 w-4" />
          Mapa
        </button>
        <button
          onClick={() => setView('list')}
          className={cn(
            "flex items-center gap-2 px-6 py-1.5 rounded-full text-sm font-semibold transition-all",
            view === 'list'
              ? "bg-primary text-white shadow-lg"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <List className="h-4 w-4" />
          Lista
        </button>
      </div>

      <FilterDrawer isOpen={isFilterDrawerOpen} onClose={() => setIsFilterDrawerOpen(false)} />

      {/* Bottom Sheet for Mobile Map */}
      <Drawer open={isBottomSheetOpen} onOpenChange={setIsBottomSheetOpen}>
        <DrawerContent className="pb-8">
          <DrawerHeader className="sr-only">
            <DrawerTitle>Detalles del garaje</DrawerTitle>
          </DrawerHeader>
          {selectedGarage && (
            <div className="px-4">
              <GarageCard
                garage={selectedGarage}
                filteredSpots={garageFilteredSpots}
                onSelect={() => {
                  setIsBottomSheetOpen(false);
                  setIsGarageModalOpen(true);
                }}
                variant="full"
              />
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}