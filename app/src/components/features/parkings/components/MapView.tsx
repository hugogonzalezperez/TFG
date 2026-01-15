import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ParkingMap } from './ParkingMap'
import { Filters } from '../../Filters';
import { FilterDrawer } from '../../FilterDrawer';
import { FilterSidebar } from '../../FilterSidebar';
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
import { useFilters } from '../../../../context/FilterContext';
import { useParkings } from '../hooks/useParkings.ts';
import { filterParkings, sortParkingsByDistance } from '../../../../utils/parkingFilters';
import { AnimatedLoader } from '../../../loaders/animatedLoader';
import { ErrorMessage } from '../../../ui/errorMessage';

export function MapView() {
  return <MapViewContent />;
}

function MapViewContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { filters, setSearchQuery, setDateTimeFilters, selectedParkingId, setSelectedParkingId } = useFilters();
  const { parkings, isLoading, error } = useParkings();
  const searchData = location.state?.searchData;

  const [view, setView] = useState<'map' | 'list'>('map');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  // Cargar datos de fecha/hora desde searchData (viene de Home) - SOLO UNA VEZ
  useEffect(() => {
    if (searchData?.date && !initialDataLoaded) {
      setDateTimeFilters({
        startDate: searchData.date,
        startTime: searchData.startTime || '',
        endDate: searchData.date,
        endTime: searchData.endTime || '',
      });
      setInitialDataLoaded(true);
    }
  }, [searchData?.date, searchData?.startTime, searchData?.endTime, initialDataLoaded, setDateTimeFilters]);

  const filteredSpots = useMemo(() => {
    return filterParkings(parkings, filters);
  }, [parkings, filters]);

  const handleSearch = (term: string) => {
    setSearchQuery(term);
  };

  const handleSpotSelect = (spot: any) => {
    setSelectedParkingId(spot.id);
  };

  if (isLoading) {
    return <AnimatedLoader message="Buscando aparcamientos..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="h-screen flex flex-col bg-background">
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
            <ParkingMap
              spots={filteredSpots}
              onSelect={handleSpotSelect}
              selectedSpotId={selectedParkingId}
            />
          ) : (
            <div className="w-full h-full overflow-y-auto p-4">
              <div className="max-w-4xl mx-auto space-y-4">
                <h2 className="text-2xl font-semibold mb-4">
                  {filteredSpots.length} plazas disponibles
                </h2>
                {filteredSpots.length > 0 ? (
                  filteredSpots.map((spot) => (
                    <Card
                      key={spot.id}
                      className={`p-4 hover:shadow-lg transition-all cursor-pointer ${selectedParkingId === spot.id ? 'ring-2 ring-primary' : ''
                        }`}
                      onClick={() => {
                        handleSpotSelect(spot);
                        navigate(`/parking/${spot.id}`, { state: { parkingData: spot } });
                      }}
                    >
                      <div className="flex gap-4">
                        <img
                          src={spot.image}
                          alt={spot.name}
                          className="w-32 h-32 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-lg mb-1">{spot.name}</h3>
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {spot.location}, {spot.city}
                              </p>
                            </div>
                            {spot.verified && (
                              <Badge variant="secondary" className="bg-secondary/10 text-secondary">
                                Verificado
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-accent text-accent" />
                              <span className="font-semibold">{spot.rating}</span>
                              <span className="text-muted-foreground">({spot.reviews})</span>
                            </div>
                            <span className="text-muted-foreground">{spot.distance} km</span>
                            <Badge variant="outline">{spot.type}</Badge>
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <div>
                              <span className="text-2xl font-bold text-primary">{spot.price}€</span>
                              <span className="text-muted-foreground">/hora</span>
                            </div>
                            <Button className="bg-accent hover:bg-accent/90 text-white">
                              Ver detalles
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground text-lg">
                      No se encontraron plazas con los filtros seleccionados
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
                {filteredSpots.length} plazas disponibles
              </h2>
              <p className="text-sm text-muted-foreground">en tu búsqueda</p>
            </div>
            <div className="divide-y divide-border">
              {filteredSpots.length > 0 ? (
                filteredSpots.map((spot) => (
                  <div
                    key={spot.id}
                    className={`p-4 cursor-pointer transition-colors ${selectedParkingId === spot.id
                      ? 'bg-primary/5 border-l-4 border-primary'
                      : 'hover:bg-muted/50'
                      }`}
                    onClick={() => {
                      handleSpotSelect(spot);
                      navigate(`/parking/${spot.id}`, { state: { parkingData: spot } });
                    }}
                    onMouseEnter={() => handleSpotSelect(spot)}
                  >
                    <div className="flex gap-3">
                      <img
                        src={spot.image}
                        alt={spot.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold mb-1 truncate">{spot.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2 truncate">
                          {spot.location}
                        </p>
                        <div className="flex items-center gap-2 text-sm mb-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-accent text-accent" />
                            <span className="font-semibold">{spot.rating}</span>
                          </div>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-muted-foreground">{spot.distance} km</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-primary">{spot.price}€/h</span>
                          <Badge variant="outline" className="text-xs">
                            {spot.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
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