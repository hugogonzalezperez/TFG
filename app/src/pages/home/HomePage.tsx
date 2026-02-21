import { useState, useEffect } from 'react';
import { Input, Card, Button } from '../../ui';
import { Car, MapPin, Calendar, Clock, Search, Star, Shield, CreditCard, Menu, User, LogOut } from 'lucide-react';
import { useFilters } from '../../features/parking';
import { useAuth } from '../../features/auth';
import { HomeSkeleton } from '../../shared/components/loaders';

import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const { setDateTimeFilters, resetFilters } = useFilters();
  const { logout, loading, authUser } = useAuth();

  // Reset filters when entering home page to ensure fresh state
  useEffect(() => {
    resetFilters();
  }, [resetFilters]);

  const [searchData, setSearchData] = useState({
    location: 'Santa Cruz de Tenerife',
    date: '',
    startTime: '',
    endTime: '',
  });

  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Mostrar skeleton mientras se cargan los datos del usuario
  if (loading) {
    return <HomeSkeleton />;
  }

  // Ahora la búsqueda es más flexible: solo la ubicación es obligatoria
  const isSearchDisabled = !searchData.location.trim();

  const handleSearch = () => {
    // Si hay datos de fecha/hora, los guardamos en el contexto
    if (searchData.date && searchData.startTime && searchData.endTime) {
      setDateTimeFilters({
        startDate: searchData.date,
        startTime: searchData.startTime,
        endDate: searchData.date,
        endTime: searchData.endTime,
      });
    } else {
      // Si no hay fechas, limpiamos filtros temporales previos para mostrar todo
      setDateTimeFilters({
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
      });
    }

    // Navigate to map
    navigate('/map', { state: searchData });
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
      <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
              <div className="bg-primary p-2 rounded-xl">
                <Car className="h-6 w-6 text-white" />
              </div>
              <h1 className="ml-2 text-2xl font-bold text-foreground">Parky</h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button onClick={() => navigate('/map')} className="text-foreground hover:text-primary transition-colors">
                Encuentra aparcamiento
              </button>
              <button
                onClick={() => navigate('/owner-profile')}
                className="text-foreground hover:text-primary transition-colors"
              >
                Alquila tu plaza
              </button>
              <button className="text-foreground hover:text-primary transition-colors">
                ¿Cómo funciona?
              </button>
            </nav>

            {/* User Menu */}
            <div className="hidden md:flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/profile')}
                className="flex items-center space-x-2"
              >
                {authUser?.user?.avatar_url ? (
                  <img
                    src={authUser.user.avatar_url}
                    alt={authUser.user.name}
                    className="h-8 w-8 rounded-full object-cover border-2 border-primary"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                )}
                <span>{authUser?.user?.name?.split(' ')[0] || 'Mi cuenta'}</span>
              </Button>
              <Button
                variant="exit"
                onClick={logout}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-5 w-5" />
                <span>Salir</span>
              </Button>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="md:hidden py-4 space-y-2 border-t border-border">
              {/* User info in mobile */}
              <div className="flex items-center gap-3 px-4 py-3 bg-muted/50 rounded-lg mb-2">
                {authUser?.user?.avatar_url ? (
                  <img
                    src={authUser.user.avatar_url}
                    alt={authUser.user.name}
                    className="h-10 w-10 rounded-full object-cover border-2 border-primary"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                )}
                <div>
                  <p className="font-semibold">{authUser?.user?.name || 'Usuario'}</p>
                  <p className="text-xs text-muted-foreground">{authUser?.user?.email}</p>
                </div>
              </div>

              <button className="block w-full text-left px-4 py-2 hover:bg-muted rounded-lg">
                Encuentra aparcamiento
              </button>
              <button
                onClick={() => navigate('/owner-profile')}
                className="block w-full text-left px-4 py-2 hover:bg-muted rounded-lg"
              >
                Alquila tu plaza
              </button>
              <button className="block w-full text-left px-4 py-2 hover:bg-muted rounded-lg">
                ¿Cómo funciona?
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="block w-full text-left px-4 py-2 hover:bg-muted rounded-lg"
              >
                Mi cuenta
              </button>
              <button
                onClick={logout}
                className="block w-full text-left px-4 py-2 hover:bg-muted rounded-lg text-destructive"
              >
                Salir
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-background">
        {/* Decorative Background Blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[50%] bg-primary/10 rounded-full blur-[120px] animate-blob"></div>
          <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[45%] bg-secondary/10 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
          <div className="absolute top-[20%] right-[10%] w-[25%] h-[35%] bg-accent/5 rounded-full blur-[80px] animate-blob animation-delay-4000"></div>

          {/* Grid pattern overlay for extra texture */}
          <div className="absolute inset-0 bg-[url('https://parallel.report/assets/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center mb-16">
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 text-foreground tracking-tight">
              Encuentra <span className="text-primary">aparcamiento</span>
              <span className="block mt-3">
                en cualquier lugar de <span className="text-primary">Tenerife</span>
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto font-medium">
              Reserva plazas privadas hasta un <span className="text-foreground font-bold">60% más baratas</span> que los parkings públicos
            </p>
          </div>

          {/* Search Card */}
          <Card className="max-w-5xl mx-auto p-2 lg:p-2 shadow-[0_20px_50px_rgba(18,29,182,0.15)] rounded-3xl border-0 bg-card/80 backdrop-blur-xl">
            <div className="p-6 lg:p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-primary" />
                    Ubicación
                  </label>
                  <Input
                    placeholder="¿Dónde aparcar?"
                    value={searchData.location}
                    onChange={(e) => setSearchData({ ...searchData, location: e.target.value })}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-primary" />
                    Fecha
                  </label>
                  <Input
                    type="date"
                    value={searchData.date}
                    onChange={(e) => setSearchData({ ...searchData, date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-primary" />
                    Entrada
                  </label>
                  <Input
                    type="time"
                    step="600" // 10 minutos
                    value={searchData.startTime}
                    onChange={(e) => setSearchData({ ...searchData, startTime: e.target.value })}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-primary" />
                    Salida
                  </label>
                  <Input
                    type="time"
                    step="600" // 10 minutos
                    value={searchData.endTime}
                    onChange={(e) => {
                      // Prevent end time from being before start time
                      if (searchData.startTime && e.target.value < searchData.startTime) {
                        return;
                      }
                      setSearchData({ ...searchData, endTime: e.target.value });
                    }}
                    min={searchData.startTime || '00:00'}
                    className="h-12"
                  />
                </div>
              </div>

              <Button
                onClick={handleSearch}
                disabled={isSearchDisabled}
                className="w-full h-16 bg-accent hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xl rounded-2xl shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-3"
              >
                <Search className="h-6 w-6" />
                {isSearchDisabled ? 'Introduce una ubicación' : 'Buscar aparcamiento'}
              </Button>
            </div>
          </Card>
        </div>

        {/* Clear boundary transition */}
        <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-background to-transparent opacity-100 z-10"></div>
      </div>

      {/* Popular Locations - High contrast background and clear separation */}
      <div className="relative bg-muted/40 border-y border-border/50 z-20 shadow-[0_-1px_3px_rgba(0,0,0,0.05)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <h2 className="text-4xl font-bold mb-12 text-center tracking-tight text-foreground">
            Zonas populares en <span className="text-primary">Tenerife</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {popularLocations.map((location) => (
              <Card
                key={location.name}
                className="p-6 hover:shadow-lg transition-all cursor-pointer hover:border-primary group"
                onClick={() => {
                  setSearchData({ ...searchData, location: location.name });
                  handleSearch();
                }}
              >
                <MapPin className="h-8 w-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold mb-1">{location.name}</h3>
                <p className="text-sm text-muted-foreground">{location.spots} plazas</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-muted/30 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center">¿Por qué elegir Parky?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="p-8 text-center hover:shadow-xl transition-shadow">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-2xl mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </Card>
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
      <footer className="bg-footer-background text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="bg-white p-2 rounded-xl">
                  <Car className="h-6 w-6 text-primary" />
                </div>
                <h3 className="ml-2 text-xl font-bold">Parky</h3>
              </div>
              <p className="text-white/70">
                La forma más fácil de encontrar aparcamiento en Tenerife
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-white/70">
                <li><a href="#" className="hover:text-white">Sobre nosotros</a></li>
                <li><a href="#" className="hover:text-white">Cómo funciona</a></li>
                <li><a href="#" className="hover:text-white">Prensa</a></li>
                <li><a href="#" className="hover:text-white">Carreras</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Soporte</h4>
              <ul className="space-y-2 text-white/70">
                <li><a href="#" className="hover:text-white">Centro de ayuda</a></li>
                <li><a href="#" className="hover:text-white">Contacto</a></li>
                <li><a href="#" className="hover:text-white">Seguridad</a></li>
                <li><a href="#" className="hover:text-white">Términos</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Síguenos</h4>
              <ul className="space-y-2 text-white/70">
                <li><a href="#" className="hover:text-white">Instagram</a></li>
                <li><a href="#" className="hover:text-white">Facebook</a></li>
                <li><a href="#" className="hover:text-white">Twitter</a></li>
                <li><a href="#" className="hover:text-white">LinkedIn</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/70">
            <p>&copy; 2026 Parky. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}