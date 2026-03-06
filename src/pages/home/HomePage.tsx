import { useState, useEffect, useMemo } from 'react';
import { Input, Card, Button, DatePicker, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../ui';
import { Car, MapPin, Calendar, Clock, Search, Star, Shield, CreditCard } from 'lucide-react';
import { useFilters } from '../../features/parking';
import { useAuth } from '../../features/auth';
import { HomeSkeleton } from '../../shared/components/loaders';
import { isNative } from '@/mobile';

import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const { setDateTimeFilters, resetFilters } = useFilters();
  const { loading } = useAuth();

  // Reset filters when entering home page to ensure fresh state
  useEffect(() => {
    resetFilters();
  }, [resetFilters]);

  const [searchData, setSearchData] = useState({
    location: 'Santa Cruz de Tenerife',
    startTime: '',
    endTime: '',
  });
  const [entryDate, setEntryDate] = useState<Date | undefined>(undefined);
  const [exitDate, setExitDate] = useState<Date | undefined>(undefined);

  const timeOptions = useMemo(() => {
    const options = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 15) {
        options.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
      }
    }
    return options;
  }, []);


  // Mostrar skeleton mientras se cargan los datos del usuario
  if (loading) {
    return <HomeSkeleton />;
  }

  // Ahora la búsqueda es más flexible: solo la ubicación es obligatoria
  const isSearchDisabled = !searchData.location.trim();

  const handleSearch = () => {
    const datePart = entryDate ? entryDate.toISOString().split('T')[0] : '';
    const exitDatePart = exitDate ? exitDate.toISOString().split('T')[0] : datePart;
    if (datePart && searchData.startTime && searchData.endTime) {
      setDateTimeFilters({
        startDate: datePart,
        startTime: searchData.startTime,
        endDate: exitDatePart,
        endTime: searchData.endTime,
      });
    } else {
      setDateTimeFilters({ startDate: '', startTime: '', endDate: '', endTime: '' });
    }
    navigate('/map', {
      state: {
        ...searchData,
        startDate: datePart,
        endDate: exitDatePart
      }
    });
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
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-background">
        {/* Decorative Background Blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-5%] left-[-10%] w-[60%] md:w-[40%] h-[40%] md:h-[50%] bg-primary/10 rounded-full blur-[80px] md:blur-[120px] animate-blob"></div>
          <div className="absolute bottom-[10%] right-[-5%] w-[50%] md:w-[35%] h-[40%] md:h-[45%] bg-secondary/10 rounded-full blur-[70px] md:blur-[100px] animate-blob animation-delay-2000"></div>
          <div className="absolute top-[20%] right-[10%] w-[40%] md:w-[25%] h-[30%] md:h-[35%] bg-accent/5 rounded-full blur-[60px] md:blur-[80px] animate-blob animation-delay-4000"></div>

          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-[url('https://parallel.report/assets/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10"></div>
        </div>

        <div className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${isNative() ? 'py-4' : 'py-10 md:py-16 lg:py-24'}`}>
          <div className="text-center mb-10 md:mb-16">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-6 text-foreground tracking-tight leading-[1.1]">
              Encuentra <span className="text-primary">aparcamiento</span>
              <span className="block mt-2 sm:mt-3">
                en cualquier lugar de <span className="text-primary">Tenerife</span>
              </span>
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto font-medium px-4">
              Reserva plazas privadas hasta un <span className="text-foreground font-bold">60% más baratas</span> que los parkings públicos
            </p>
          </div>

          {/* Search Card */}
          <Card className="max-w-5xl mx-auto p-1 md:p-2 shadow-[0_10px_40px_rgba(18,29,182,0.1)] md:shadow-[0_20px_50px_rgba(18,29,182,0.15)] rounded-2xl md:rounded-3xl border-0 bg-card/80 backdrop-blur-xl">
            <div className="p-5 md:p-8 lg:p-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 mb-6 md:mb-8">
                {/* Ubicación */}
                <div className="space-y-1.5 md:space-y-2">
                  <label className="text-xs md:text-sm font-semibold flex items-center text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 mr-2 text-primary" />
                    Ubicación
                  </label>
                  <Input
                    placeholder="¿Dónde aparcar?"
                    value={searchData.location}
                    onChange={(e) => setSearchData({ ...searchData, location: e.target.value })}
                    className="h-14 bg-muted/50 border-none rounded-xl text-base px-4"
                  />
                </div>

                {/* Entrada */}
                <div className="space-y-1.5 md:space-y-2">
                  <label className="text-xs md:text-sm font-semibold flex items-center text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5 mr-2 text-primary" />
                    Entrada
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-[5]">
                      <DatePicker
                        date={entryDate}
                        onChange={(date) => {
                          setEntryDate(date);
                          if (date && (!exitDate || exitDate < date)) {
                            setExitDate(date);
                          }
                        }}
                        placeholder="Fecha entrada"
                        minDate={new Date()}
                        className="h-14 bg-muted/50 border-none rounded-xl text-base"
                      />
                    </div>
                    <div className="flex-[3]">
                      <Select value={searchData.startTime} onValueChange={(val) => setSearchData(p => ({ ...p, startTime: val }))}>
                        <SelectTrigger className="h-14 bg-muted/50 border-none rounded-xl text-base font-medium">
                          <SelectValue placeholder="Hora" />
                        </SelectTrigger>
                        <SelectContent>{timeOptions.map(t => <SelectItem key={`si-${t}`} value={t}>{t}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Salida */}
                <div className="space-y-1.5 md:space-y-2">
                  <label className="text-xs md:text-sm font-semibold flex items-center text-muted-foreground">
                    <Clock className="h-3.5 w-3.5 mr-2 text-primary" />
                    Salida
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-[5]">
                      <DatePicker
                        date={exitDate}
                        onChange={setExitDate}
                        placeholder="Fecha salida"
                        minDate={entryDate || new Date()}
                        className="h-14 bg-muted/50 border-none rounded-xl text-base"
                      />
                    </div>
                    <div className="flex-[3]">
                      <Select value={searchData.endTime} onValueChange={(val) => setSearchData(p => ({ ...p, endTime: val }))}>
                        <SelectTrigger className="h-14 bg-muted/50 border-none rounded-xl text-base font-medium">
                          <SelectValue placeholder="Hora" />
                        </SelectTrigger>
                        <SelectContent>{timeOptions.map(t => <SelectItem key={`so-${t}`} value={t}>{t}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleSearch}
                disabled={isSearchDisabled}
                className="w-full h-14 md:h-16 bg-accent hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-lg md:text-xl rounded-xl md:rounded-2xl shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-3"
              >
                <Search className="h-5 w-5 md:h-6 md:w-6" />
                {isSearchDisabled ? 'Introduce una ubicación' : 'Buscar aparcamiento'}
              </Button>
            </div>
          </Card>
        </div>

        {/* Clear boundary transition */}
        <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-background to-transparent opacity-100 z-10"></div>
      </div>

      {/* Popular Locations */}
      <div className="relative bg-muted/40 border-y border-border/50 z-20 shadow-[0_-1px_3px_rgba(0,0,0,0.05)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <h2 className="text-2xl md:text-4xl font-bold mb-10 md:mb-12 text-center tracking-tight text-foreground">
            Zonas populares en <span className="text-primary">Tenerife</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {popularLocations.map((location) => (
              <Card
                key={location.name}
                className="p-5 md:p-6 hover:shadow-lg transition-all cursor-pointer hover:border-primary group bg-card"
                onClick={() => {
                  setSearchData({ ...searchData, location: location.name });
                  handleSearch();
                }}
              >
                <MapPin className="h-6 w-6 md:h-8 md:w-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold mb-1 text-base md:text-lg">{location.name}</h3>
                <p className="text-xs md:text-sm text-muted-foreground">{location.spots} plazas</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-muted/30 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-10 md:mb-12 text-center">¿Por qué elegir Parky?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-center sm:text-left md:text-center">
            {benefits.map((benefit, index) => (
              <Card key={index} className="p-6 md:p-8 hover:shadow-xl transition-shadow flex flex-col items-center">
                <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-primary/10 text-primary rounded-2xl mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm md:text-base text-muted-foreground">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary py-12 md:py-16 text-primary-foreground">
        <div className="max-w-4xl mx-auto px-6 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">
            ¿Tienes una plaza de aparcamiento sin usar?
          </h2>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Genera ingresos pasivos alquilándola cuando no la uses
          </p>
          <Button
            onClick={() => navigate('/owner-profile')}
            size="lg"
            className="bg-white text-primary hover:bg-white/90 h-14 px-8 text-lg w-full sm:w-auto"
          >
            Empieza a ganar dinero
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-footer-background text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-1 sm:col-span-2 md:col-span-1">
              <div className="flex items-center mb-4">
                <div className="bg-white p-2 rounded-xl">
                  <Car className="h-6 w-6 text-primary" />
                </div>
                <h3 className="ml-2 text-xl font-bold">Parky</h3>
              </div>
              <p className="text-white/70 max-w-xs">
                La forma más fácil de encontrar aparcamiento en Tenerife
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-lg">Empresa</h4>
              <ul className="space-y-2 text-white/70">
                <li><a href="#" className="hover:text-white transition-colors">Sobre nosotros</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cómo funciona</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Prensa</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Carreras</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-lg">Soporte</h4>
              <ul className="space-y-2 text-white/70">
                <li><a href="#" className="hover:text-white transition-colors">Centro de ayuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Seguridad</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Términos</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-lg">Síguenos</h4>
              <ul className="space-y-4 text-white/70">
                <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 mt-12 pt-8 text-center text-white/70">
            <p>&copy; 2026 Parky. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}