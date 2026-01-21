import { useState, useEffect, useMemo } from 'react';
import { ParkingMap } from './ParkingMap'
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



// Mock data de plazas
const parkingSpots: any[] = [
  {
    id: 1,
    name: 'Plaza Centro',
    location: 'Calle Castillo, 45',
    city: 'Santa Cruz',
    price: 2.5,
    rating: 4.8,
    reviews: 124,
    distance: 0.3,
    lat: 28.4682,
    lng: -16.2546,
    type: 'Cubierta',
    verified: true,
    image: 'https://images.unsplash.com/photo-1619335680796-54f13b88c6ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJraW5nJTIwZ2FyYWdlJTIwbW9kZXJufGVufDF8fHx8MTc2NzY0NTU0M3ww&ixlib=rb-4.1.0&q=80&w=400',
  },
  {
    id: 2,
    name: 'Garaje Privado Marina',
    location: 'Av. Marítima, 12',
    city: 'Santa Cruz',
    price: 3.0,
    rating: 4.9,
    reviews: 89,
    distance: 0.5,
    lat: 28.4695,
    lng: -16.2523,
    type: 'Subterráneo',
    verified: true,
    image: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bmRlcmdyb3VuZCUyMHBhcmtpbmd8ZW58MXx8fHwxNzY3NjQ1NTQzfDA&ixlib=rb-4.1.0&q=80&w=400',
  },
  {
    id: 3,
    name: 'Plaza Residencial',
    location: 'C/ San Francisco, 78',
    city: 'La Laguna',
    price: 2.0,
    rating: 4.6,
    reviews: 56,
    distance: 1.2,
    lat: 28.4875,
    lng: -16.3154,
    type: 'Al aire libre',
    verified: true,
    image: 'https://images.unsplash.com/photo-1761479353275-a66a51af32ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXNpZGVudGlhbCUyMHBhcmtpbmd8ZW58MXx8fHwxNzY3NjQ1NTQ0fDA&ixlib=rb-4.1.0&q=80&w=400',
  },
  {
    id: 4,
    name: 'Parking Zona Norte',
    location: 'Plaza del Adelantado',
    city: 'La Laguna',
    price: 1.8,
    rating: 4.7,
    reviews: 142,
    distance: 1.5,
    lat: 28.4876,
    lng: -16.3140,
    type: 'Cubierta',
    verified: true,
    image: 'https://images.unsplash.com/photo-1621929747188-0b4dc28498d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXQlMjBwYXJraW5nfGVufDF8fHx8MTc2NzY0NTU0NHww&ixlib=rb-4.1.0&q=80&w=400',
  },
  {
    id: 5,
    name: 'Garaje Centro Comercial',
    location: 'C/ Bethencourt Alfonso',
    city: 'Santa Cruz',
    price: 2.2,
    rating: 4.5,
    reviews: 98,
    distance: 0.8,
    lat: 28.4670,
    lng: -16.2560,
    type: 'Subterráneo',
    verified: true,
    image: 'https://images.unsplash.com/photo-1619335680796-54f13b88c6ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJraW5nJTIwZ2FyYWdlJTIwbW9kZXJufGVufDF8fHx8MTc2NzY0NTU0M3ww&ixlib=rb-4.1.0&q=80&w=400',
  },
  {
    id: 6,
    name: 'Plaza Familiar',
    location: 'Rambla General Franco',
    city: 'Santa Cruz',
    price: 2.8,
    rating: 4.9,
    reviews: 167,
    distance: 0.4,
    lat: 28.4688,
    lng: -16.2535,
    type: 'Cubierta',
    verified: true,
    image: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bmRlcmdyb3VuZCUyMHBhcmtpbmd8ZW58MXx8fHwxNzY3NjQ1NTQzfDA&ixlib=rb-4.1.0&q=80&w=400',
  },
];

import { useNavigate, useLocation } from 'react-router-dom';

export function MapView() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchData = location.state;

  const { filters, setSearchQuery, setDateTimeFilters, selectedParkingId, setSelectedParkingId } = useFilters();
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
  }, [searchData, initialDataLoaded, setDateTimeFilters]);

  const filteredSpots = useMemo(() => {
    return filterParkings(parkingSpots, filters);
  }, [filters]);

  const handleSearch = (term: string) => {
    setSearchQuery(term);
  };

  const handleSpotSelect = (spot: any) => {
    setSelectedParkingId(spot.id);
  };

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
                        navigate(`/parking/${spot.id}`, { state: spot });
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
                      navigate(`/parking/${spot.id}`, { state: spot });
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