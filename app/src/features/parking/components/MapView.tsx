import { useState, useEffect, useMemo } from 'react';
import { ParkingMap } from './ParkingMap'
import { GarageDetailModal } from './GarageDetailModal';
import { Filters } from './Filters';
import { FilterDrawer } from './FilterDrawer';
import { FilterSidebar } from './FilterSidebar';
import { Button } from '../../../ui/button';
import { Card, Input, Badge } from '../../../ui';
import {
  MapPin,
  Star,
  Euro,
  ArrowLeft,
  Search,
  SlidersHorizontal,
  List,
  Map as MapIcon,
  Navigation,
} from 'lucide-react';
import { useFilters } from '../context/FilterContext';
import { filterParkings, sortParkingsByDistance } from '../utils/parkingFilters';



import { useNavigate, useLocation } from 'react-router-dom';
import { useGarages } from '../hooks/useGarages';
import { Parking, Garage } from '../types/parking.types';
import { AnimatedLoader } from '../../../shared/components/loaders';
import { ErrorMessage } from '../../../ui';
import { geocodingService } from '../../../shared/services/geocoding.service';

export function MapView() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchData = location.state;

  const { filters, setSearchQuery, setDateTimeFilters, selectedParkingId, setSelectedParkingId } = useFilters();
  const [view, setView] = useState<'map' | 'list'>('map');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const [selectedGarage, setSelectedGarage] = useState<Garage | null>(null);
  const [hoveredGarageId, setHoveredGarageId] = useState<string | null>(null);
  const [isGarageModalOpen, setIsGarageModalOpen] = useState(false);

  // Estado para el centro del mapa
  const [mapCenter, setMapCenter] = useState<[number, number]>([28.4682, -16.2546]);
  const [mapZoom, setMapZoom] = useState(14);

  // Uso del hook profesional React Query
  const { data: allGarages = [], isLoading: loading, error: queryError } = useGarages();
  const [error, setError] = useState<string | null>(null);

  // Sincronizar error de Query con el estado local para compatibilidad con la UI de ErrorMessage
  useEffect(() => {
    if (queryError) {
      setError('No se pudieron cargar los garajes. Revisa tu conexión.');
    }
  }, [queryError]);

  // Cargar datos de fecha/hora y geolocalizar dirección inicial
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

      if (searchData?.location) {
        handleGeocode(searchData.location);
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

  const allSpots = useMemo(() => allGarages.flatMap(g => g.spots || []), [allGarages]);

  const filteredSpots = useMemo(() => {
    return filterParkings(allSpots, filters);
  }, [allSpots, filters]);

  // Garajes filtrados (solo aquellos que tengan plazas que pasen el filtro)
  const filteredGarages = useMemo(() => {
    return allGarages.filter(g =>
      g.spots?.some((s: Parking) => filteredSpots.some(fs => fs.id === s.id))
    );
  }, [allGarages, filteredSpots]);

  const handleSearch = (term: string) => {
    setSearchQuery(term);
  };

  const handleGarageClick = (garage: Garage) => {
    setSelectedGarage(garage);
    setIsGarageModalOpen(true);
  };

  const handleSpotHover = (spot: Parking) => {
    setSelectedParkingId(spot.id);
  };

  const handleSpotSelect = (spot: Parking) => {
    setSelectedParkingId(spot.id);
    setIsGarageModalOpen(false);
    navigate(`/parking/${spot.id}`, { state: spot });
  };

  // Get filtered spots for the selected garage
  const garageFilteredSpots = useMemo(() => {
    if (!selectedGarage) return [];
    return filteredSpots.filter(s => s.garage_id === selectedGarage.id);
  }, [selectedGarage, filteredSpots]);

  // Helper para rango de precios
  const getPriceRange = (spots: Parking[]) => {
    if (!spots || spots.length === 0) return 'N/A';
    const prices = spots.map((s) => s.current_price_per_hour);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    if (min === max) return `${min.toFixed(2)}€`;
    return `${min.toFixed(2)} - ${max.toFixed(2)}€`;
  };

  /* // Debug logs
  useEffect(() => {
    console.log('Filters:', filters);
    console.log('Filtered Spots:', filteredSpots.length);
    if (selectedGarage) {
      console.log('Selected Garage Spots:', selectedGarage.spots?.length);
      console.log('Garage Filtered Spots in Modal:', garageFilteredSpots.length);
    }
  }, [filters, filteredSpots, selectedGarage, garageFilteredSpots]); */

  if (loading) return <AnimatedLoader message="Buscando plazas libres en Santa Cruz..." />;

  return (
    <div className="h-screen flex flex-col bg-background">
      <ErrorMessage message={error || ''} onClose={() => setError(null)} />

      <GarageDetailModal
        garage={selectedGarage}
        // Only pass spots that match the global filter
        visibleSpots={garageFilteredSpots}
        isOpen={isGarageModalOpen}
        onClose={() => setIsGarageModalOpen(false)}
        onSpotSelect={handleSpotSelect}
      />
      {/* Header */}
      <div className="bg-card border-b border-border p-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div className="flex-1 flex items-center gap-2">
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Buscar ubicación..."
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            {view === 'map' && (
              <Filters onOpen={() => setIsFilterDrawerOpen(true)} />
            )}
          </div>

          <div className="hidden md:flex gap-2">
            <Button
              variant={view === 'map' ? 'default' : 'outline'}
              onClick={() => setView('map')}
              className="gap-2"
            >
              <MapIcon className="h-4 w-4" />
              Mapa
            </Button>
            <Button
              variant={view === 'list' ? 'default' : 'outline'}
              onClick={() => setView('list')}
              className="gap-2"
            >
              <List className="h-4 w-4" />
              Lista
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {view === 'list' && <FilterSidebar />}
        {/* Map or List View */}
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
            <div className="w-full h-full overflow-y-auto p-4">
              <div className="max-w-4xl mx-auto space-y-4">
                <h2 className="text-2xl font-semibold mb-4">
                  {filteredGarages.length} garajes encontrados
                </h2>
                {filteredGarages.length > 0 ? (
                  filteredGarages.map((garage) => (
                    <Card
                      key={garage.id}
                      className={`p-4 hover:shadow-lg transition-all cursor-pointer ${selectedGarage?.id === garage.id ? 'ring-2 ring-primary' : ''
                        }`}
                      onClick={() => handleGarageClick(garage)}
                    >
                      <div className="flex gap-4">
                        {/* Placeholder image or first spot image logic */}
                        <div className="w-32 h-32 bg-muted rounded-lg flex items-center justify-center text-muted-foreground overflow-hidden">
                          {garage.image || garage.spots?.[0]?.image ? (
                            <img
                              src={garage.image || garage.spots?.[0]?.image}
                              alt={garage.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <MapIcon className="w-10 h-10 opacity-20" />
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-lg mb-1">{garage.name}</h3>
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {garage.address}, {garage.city}
                              </p>
                            </div>
                            {garage.is_verified && (
                              <Badge variant="secondary" className="bg-secondary/10 text-secondary">
                                Verificado
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-accent text-accent" />
                              <span className="font-semibold">{garage.rating || 'N/A'}</span>
                              <span className="text-muted-foreground">({garage.reviews || 0})</span>
                            </div>
                            <Badge variant="outline">{garage.total_spots} plazas</Badge>
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <div>
                              <span className="text-xl font-bold text-primary">{getPriceRange(garage.spots || [])}</span>
                              <span className="text-muted-foreground text-sm"> /hora</span>
                            </div>
                            <Button className="bg-accent hover:bg-accent/90 text-white">
                              Ver plazas
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground text-lg">
                      No se encontraron garajes con los filtros seleccionados
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar with results (desktop only for map view) */}
        {view === 'map' && (
          <div className="hidden lg:block w-96 border-l border-border bg-card overflow-y-auto">
            <div className="p-4 border-b border-border sticky top-0 bg-card z-10">
              <h2 className="font-semibold text-lg">
                {filteredGarages.length} garajes
              </h2>
              <p className="text-sm text-muted-foreground">cerca de ti</p>
            </div>
            <div className="divide-y divide-border">
              {filteredGarages.length > 0 ? (
                filteredGarages.map((garage) => {
                  // Calculate specific filtered spots for this garage to show correct price range
                  const garageSpots = filteredSpots.filter(s => s.garage_id === garage.id);

                  return (
                    <div
                      key={garage.id}
                      className={`p-4 cursor-pointer transition-colors ${selectedGarage?.id === garage.id
                        ? 'bg-primary/5 border-l-4 border-primary'
                        : 'hover:bg-muted/50'
                        }`}
                      onClick={() => handleGarageClick(garage)}
                      onMouseEnter={() => setHoveredGarageId(garage.id)}
                      onMouseLeave={() => setHoveredGarageId(null)}
                    >
                      <div className="flex gap-3">
                        <div className="w-20 h-20 bg-muted rounded-lg flex-shrink-0 flex items-center justify-center text-muted-foreground overflow-hidden">
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
                          <h3 className="font-semibold mb-1 truncate">{garage.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2 truncate">
                            {garage.address}
                          </p>
                          <div className="flex items-center gap-2 text-sm mb-2">
                            <Badge variant="secondary" className="text-[10px] h-5">
                              {garageSpots.length} libres
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-primary text-sm">{getPriceRange(garageSpots)}/h</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  No hay resultados con los filtros seleccionados
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile view toggle */}
      <div className="md:hidden border-t border-border bg-card p-2 flex gap-2">
        <Button
          variant={view === 'map' ? 'default' : 'outline'}
          onClick={() => setView('map')}
          className="flex-1 gap-2"
        >
          <MapIcon className="h-4 w-4" />
          Mapa
        </Button>
        <Button
          variant={view === 'list' ? 'default' : 'outline'}
          onClick={() => setView('list')}
          className="flex-1 gap-2"
        >
          <List className="h-4 w-4" />
          Lista
        </Button>
      </div>

      {/* Filter Drawer */}
      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
      />
    </div>
  );
}