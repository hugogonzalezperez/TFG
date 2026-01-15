import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { useFilters } from '../context/FilterContext';
import { HomeSkeleton } from '../components/loaders/homeSkeleton';
import { Shield, CreditCard, Star } from 'lucide-react';
import {
  SearchBar,
  LocationCard,
  BenefitCard,
} from '../components/shared';
import { AppHeader } from '../components/layout/Header';
import { AppFooter } from '../components/layout/Footer';

export function Home() {
  const navigate = useNavigate();
  const { setDateTimeFilters } = useFilters();
  const { logout, loading, authUser } = useAuth();

  const [searchData, setSearchData] = useState({
    location: 'Santa Cruz de Tenerife',
    date: '',
    startTime: '',
    endTime: '',
  });

  // Mostrar skeleton mientras se cargan los datos del usuario
  if (loading) {
    return <HomeSkeleton />;
  }

  const isSearchDisabled =
    !searchData.date || !searchData.startTime || !searchData.endTime;

  const handleSearch = () => {
    setDateTimeFilters({
      startDate: searchData.date,
      startTime: searchData.startTime,
      endDate: searchData.date,
      endTime: searchData.endTime,
    });
    navigate('/map', { state: { searchData } });
  };

  const popularLocations = [
    { name: 'Santa Cruz', spots: 156 },
    { name: 'La Laguna', spots: 89 },
    { name: 'Puerto de la Cruz', spots: 67 },
    { name: 'Los Cristianos', spots: 124 },
    { name: 'Costa Adeje', spots: 98 },
    { name: 'Playa de las Américas', spots: 142 },
  ];

  const benefits = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Seguro y verificado',
      description: 'Todas las plazas están verificadas y aseguradas',
    },
    {
      icon: <CreditCard className="h-8 w-8" />,
      title: 'Ahorra hasta 60%',
      description: 'Precios más bajos que parkings públicos',
    },
    {
      icon: <Star className="h-8 w-8" />,
      title: 'Valoraciones reales',
      description: 'Lee opiniones de otros conductores',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header/Navigation */}
      <AppHeader authUser={authUser} onLogout={logout} />

      {/* Hero Section */}
      <div className="relative bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-6xl font-bold mb-4 text-foreground">
              Encuentra aparcamiento
              <span className="block text-primary mt-2">
                en cualquier lugar de Tenerife
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Reserva plazas privadas hasta un 60% más baratas que los parkings públicos
            </p>
          </div>

          {/* Search Bar */}
          <SearchBar
            searchData={searchData}
            onSearchDataChange={setSearchData}
            onSearch={handleSearch}
            disabled={isSearchDisabled}
          />
        </div>
      </div>

      {/* Popular Locations */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Zonas populares en Tenerife
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {popularLocations.map((location) => (
            <LocationCard
              key={location.name}
              name={location.name}
              spots={location.spots}
              onClick={() => {
                setSearchData({ ...searchData, location: location.name });
                handleSearch();
              }}
            />
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-muted/30 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center">
            ¿Por qué elegir Parky?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <BenefitCard
                key={index}
                icon={benefit.icon}
                title={benefit.title}
                description={benefit.description}
              />
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary py-16 text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            ¿Tienes una plaza de aparcamiento sin usar?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Genera ingresos pasivos alquilándola cuando no la uses
          </p>
          <Button
            onClick={() => navigate('/owner-profile')}
            size="lg"
            className="bg-white text-primary hover:bg-white/90 h-14 px-8 text-lg"
          >
            Empieza a ganar dinero
          </Button>
        </div>
      </div>

      {/* Footer */}
      <AppFooter />
    </div>
  );
}