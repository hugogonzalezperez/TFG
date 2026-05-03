import { useState, useEffect, useMemo, useRef } from 'react';
import { Input, Card, Button, DatePicker, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../ui';
import {
  Car, MapPin, Calendar, Clock, Search,
  Star, Shield, Check, X, BadgeCheck, ArrowRight, ChevronLeft, ChevronRight,
  TrendingUp, Euro, CreditCard,
  Twitter, Instagram, Linkedin, Mail, Phone, Zap, Wallet
} from 'lucide-react';
import { useFilters } from '../../features/parking';
import { useAuth } from '../../features/auth';
import { HomeSkeleton } from '../../shared/components/loaders';
import { isNative } from '@/mobile';
import { useNavigate } from 'react-router-dom';

const ZONES = [
  {
    id: 1,
    name: 'Santa Cruz',
    subtitle: 'Centro urbano',
    spots: 156,
    price: '2.50€/h',
    rating: 4.8,
    hot: true,
    image: 'https://images.unsplash.com/photo-1703693837521-e76ee7b8dc74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  },
  {
    id: 2,
    name: 'La Laguna',
    subtitle: 'Ciudad universitaria',
    spots: 89,
    price: '2.00€/h',
    rating: 4.7,
    hot: false,
    image: 'https://images.unsplash.com/photo-1616428394230-ba242d33e3ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  },
  {
    id: 3,
    name: 'Puerto de la Cruz',
    subtitle: 'Costa norte',
    spots: 67,
    price: '2.20€/h',
    rating: 4.9,
    hot: true,
    image: 'https://images.unsplash.com/photo-1771407573830-a21d9b6a1e5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  },
  {
    id: 4,
    name: 'Los Cristianos',
    subtitle: 'Costa sur',
    spots: 124,
    price: '3.00€/h',
    rating: 4.6,
    hot: false,
    image: 'https://images.unsplash.com/photo-1766293777298-992506f9fb84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  },
  {
    id: 5,
    name: 'Costa Adeje',
    subtitle: 'Zona turística',
    spots: 98,
    price: '3.50€/h',
    rating: 4.8,
    hot: true,
    image: 'https://images.unsplash.com/photo-1776323753894-53ffa5d198f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  },
  {
    id: 6,
    name: 'Aeropuerto Sur',
    subtitle: 'TFS · Larga estancia',
    spots: 47,
    price: '1.80€/h',
    rating: 4.9,
    hot: true,
    image: 'https://images.unsplash.com/photo-1761397300888-348e0dbdcc09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  },
];

const BENEFITS = [
  {
    icon: <Zap className="w-5 h-5" />,
    title: 'Reserva en 30 segundos',
    desc: 'Encuentra y reserva tu plaza antes de salir de casa. Sin estrés, sin vueltas.',
    stat: '30s',
    statLabel: 'tiempo medio de reserva',
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: '100% verificado y seguro',
    desc: 'Cada plaza pasa por un proceso de verificación. Tú solo aparcas.',
    stat: '100%',
    statLabel: 'plazas verificadas',
  },
  {
    icon: <CreditCard className="w-5 h-5" />,
    title: 'Sin letra pequeña',
    desc: 'Precio transparente desde el primer momento. Lo que ves es lo que pagas.',
    stat: '0€',
    statLabel: 'cargos ocultos',
  },
  {
    icon: <Clock className="w-5 h-5" />,
    title: 'Acceso inteligente 24/7',
    desc: 'Abre y cierra el garaje desde la app, a cualquier hora. Sin esperas, sin contacto físico.',
    stat: '24/7',
    statLabel: 'acceso disponible',
  },
];

const COMPARISON = [
  { feature: 'Reserva anticipada desde el móvil', parky: true, traditional: false },
  { feature: 'Precio fijo garantizado', parky: true, traditional: false },
  { feature: 'Cancelación gratuita', parky: true, traditional: false },
  { feature: 'Acceso inteligente 24/7', parky: true, traditional: false },
  { feature: 'Sin comisiones ocultas', parky: true, traditional: false },
  { feature: 'Plazas verificadas', parky: true, traditional: true },
];

const REVIEWS = [
  {
    id: 1,
    name: 'María L.',
    city: 'Santa Cruz de Tenerife',
    avatar: 'ML',
    rating: 5,
    text: 'Increíble. Antes perdía 20 minutos buscando aparcamiento en el centro. Ahora reservo la noche antes y llego directo. Totalmente recomendable.',
    time: 'hace 2 días',
    reservations: 23,
  },
  {
    id: 2,
    name: 'Carlos S.',
    city: 'La Laguna',
    avatar: 'CS',
    rating: 5,
    text: 'Lo usé durante los exámenes en la ULL y fue perfecto. Plaza a 5 minutos del campus, precio fijo, sin sorpresas. Parky ya es indispensable.',
    time: 'hace 1 semana',
    reservations: 41,
  },
  {
    id: 3,
    name: 'Ana F.',
    city: 'Los Cristianos',
    avatar: 'AF',
    rating: 5,
    text: 'Me sorprendió lo fácil que es. En 30 segundos tenía mi plaza reservada cerca del puerto. Precio imbatible comparado con los parkings de la zona.',
    time: 'hace 3 días',
    reservations: 15,
  },
  {
    id: 4,
    name: 'Pablo M.',
    city: 'Puerto de la Cruz',
    avatar: 'PM',
    rating: 4,
    text: 'Muy buena experiencia. La plaza estaba exactamente donde decía en el mapa. El propietario muy amable. Repetiré sin duda.',
    time: 'hace 5 días',
    reservations: 8,
  },
];

const EARN_STEPS = [
  { icon: <Car className="w-5 h-5" />, step: 'Paso 1', title: 'Registra tu plaza', desc: 'Añade tu plaza en menos de 5 minutos' },
  { icon: <Calendar className="w-5 h-5" />, step: 'Paso 2', title: 'Define disponibilidad', desc: 'Tú decides cuándo alquilarla' },
  { icon: <Wallet className="w-5 h-5" />, step: 'Paso 3', title: 'Empieza a ganar', desc: 'Recibe pagos seguros cada mes' },
];

const EARN_ROWS = [
  { hours: '4h/día', label: 'de disponibilidad', amount: '120€/mes' },
  { hours: '8h/día', label: 'de disponibilidad', amount: '280€/mes' },
  { hours: '24/7', label: 'de disponibilidad', amount: '450€/mes' },
];

const FOOTER_LINKS = {
  Producto: ['Buscar plaza', 'Publicar plaza', 'Cómo funciona', 'Precios', 'App móvil'],
  Empresa: ['Sobre nosotros', 'Blog', 'Prensa', 'Carreras'],
  Soporte: ['Centro de ayuda', 'Contacto', 'Reportar problema'],
  Legal: ['Términos de uso', 'Privacidad', 'Cookies', 'Aviso legal'],
};

export default function Home() {
  const navigate = useNavigate();
  const { setDateTimeFilters, resetFilters } = useFilters();
  const { loading } = useAuth();
  const zonesRef = useRef<HTMLDivElement>(null);

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

  if (loading) {
    return <HomeSkeleton />;
  }

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
      state: { ...searchData, startDate: datePart, endDate: exitDatePart },
    });
  };

  const navigateToZone = (zoneName: string) => {
    setDateTimeFilters({ startDate: '', startTime: '', endDate: '', endTime: '' });
    navigate('/map', { state: { location: zoneName } });
  };

  const scrollZones = (dir: 'left' | 'right') => {
    zonesRef.current?.scrollBy({ left: dir === 'left' ? -296 : 296, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">

      {/* ── 1. HERO ── full viewport, header is fixed and floats above ── */}
      <section className={`relative flex flex-col overflow-hidden ${isNative() ? 'min-h-[80vh]' : 'min-h-[100svh]'}`}>
        {/* Background image — covers full section including area behind sticky header */}
        <div className="absolute inset-0">
          <img
            src="/hero_section.png"
            alt="Costa de Tenerife"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-[#0A0C23]/[0.68]" />
        </div>

        {/* Content — pt accounts for header (h-16 = 4rem) + extra breathing room */}
        <div className={`relative z-10 flex-1 flex flex-col items-center justify-center w-full max-w-7xl mx-auto px-4 sm:px-6 ${isNative() ? 'py-6' : 'pt-28 pb-16 md:pt-32 md:pb-20'}`}>

          {/* Headline */}
          <h1
            className="text-center text-white mb-5 text-[clamp(2.4rem,6vw,4.5rem)] font-black leading-[1.05] tracking-[-0.04em] max-w-[820px]"
          >
            Encuentra{' '}
            <span className="text-accent">aparcamiento</span>
            <br />
            en cualquier lugar de{' '}
            <span className="text-blue-500">
              Tenerife
            </span>
            .
          </h1>

          <p
            className="text-center mb-10 text-[clamp(1rem,2vw,1.25rem)] text-white/75 max-w-[540px] leading-[1.65]"
          >
            Reserva plazas privadas hasta un{' '}
            <strong className="text-white">60% más baratas</strong>{' '}
            que los parkings públicos. Seguro, verificado y sin estrés.
          </p>

          {/* Search Card */}
          <Card className="w-full max-w-5xl p-1 md:p-2 shadow-2xl rounded-2xl md:rounded-3xl border-0 bg-white/95 backdrop-blur-xl">
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

        {/* Wave */}
        <div className="relative z-10">
          <svg viewBox="0 0 1440 60" className="w-full block -mb-[2px]" preserveAspectRatio="none">
            <path d="M0,60 C360,0 1080,0 1440,60 L1440,60 L0,60 Z" fill="#ffffff" />
          </svg>
        </div>
      </section>

      {/* ── 2. ZONAS POPULARES — v0 style ── */}
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Header row */}
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
                Zonas populares en{' '}
                <span className="text-primary">Tenerife</span>
              </h2>
              <p className="text-muted-foreground mt-1">Descubre las zonas con más plazas disponibles</p>
            </div>
            {/* Carousel arrows */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => scrollZones('left')}
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollZones('right')}
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Zones carousel */}
          <div
            ref={zonesRef}
            className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {ZONES.map((zone) => (
              <div
                key={zone.id}
                className="flex-shrink-0 w-64 md:w-72 bg-white rounded-2xl overflow-hidden border border-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group snap-start"
                onClick={() => navigateToZone(zone.name)}
              >
                {/* Image */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={zone.image}
                    alt={zone.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent from-40% to-black/65" />

                  {/* Alta demanda badge — amber/yellow like v0 */}
                  {zone.hot && (
                    <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-400 text-amber-900">
                      <Zap className="w-3 h-3 fill-amber-900" />
                      <span className="text-[10px] font-bold">Alta demanda</span>
                    </div>
                  )}

                  {/* Rating */}
                  <div
                    className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/55 backdrop-blur-sm"
                  >
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-[11px] font-semibold text-white">{zone.rating}</span>
                  </div>

                  {/* Zone name overlay */}
                  <div className="absolute bottom-3 left-3">
                    <div className="flex items-center gap-1.5 text-white">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="font-bold text-sm">{zone.name}</span>
                    </div>
                  </div>
                </div>

                {/* Card body */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Plazas disponibles</p>
                      <p className="text-2xl font-extrabold text-foreground leading-none mt-0.5">{zone.spots}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Desde</p>
                      <p className="text-lg font-extrabold text-primary leading-none mt-0.5">{zone.price}</p>
                    </div>
                  </div>
                  <button
                    className="w-full py-2 text-sm font-semibold rounded-xl border border-primary text-primary hover:bg-primary hover:text-white transition-all duration-200"
                    onClick={(e) => { e.stopPropagation(); navigateToZone(zone.name); }}
                  >
                    Ver plazas
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile CTA */}
          <div className="mt-5 flex justify-center md:hidden">
            <button
              onClick={() => navigate('/map')}
              className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-foreground border border-border hover:bg-muted transition-all"
            >
              Ver mapa completo <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ── 3. ¿POR QUÉ PARKY? ── */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-xl mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
              Aparcar no debería ser
              <br />
              <span className="text-muted-foreground font-medium">una aventura.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            {/* Benefits 2×2 */}
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {BENEFITS.map((b) => (
                <div key={b.title} className="p-6 bg-white rounded-2xl border border-border hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 bg-primary text-primary-foreground">
                    {b.icon}
                  </div>
                  <h3 className="font-bold text-sm text-foreground mb-2">{b.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{b.desc}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold text-foreground tracking-tight">{b.stat}</span>
                    <span className="text-xs text-muted-foreground">{b.statLabel}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Comparison table */}
            <div className="lg:col-span-2">
              <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-lg">
                <div className="grid grid-cols-3 px-5 py-4 bg-primary text-primary-foreground">
                  <div className="text-xs font-semibold">Características</div>
                  <div className="text-center text-xs font-bold">Parky ✓</div>
                  <div className="text-center text-xs font-medium opacity-60">Tradicional</div>
                </div>

                {COMPARISON.map((row, i) => (
                  <div
                    key={row.feature}
                    className="grid grid-cols-3 px-5 py-3.5 items-center hover:bg-muted/50 transition-colors border-b border-border last:border-none"
                  >
                    <span className="text-xs font-medium text-foreground pr-3 leading-snug">{row.feature}</span>
                    <div className="flex justify-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${row.parky ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                        {row.parky ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : <X className="w-3.5 h-3.5" strokeWidth={3} />}
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${row.traditional ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                        {row.traditional ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : <X className="w-3.5 h-3.5" strokeWidth={3} />}
                      </div>
                    </div>
                  </div>
                ))}

                <div className="px-5 py-5 bg-muted/50">
                  <button
                    onClick={handleSearch}
                    className="w-full py-3 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98] transition-all"
                  >
                    Prueba Parky gratis →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. OPINIONES ── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
                Lo que dicen nuestros usuarios
              </h2>
            </div>
            <div className="hidden md:flex flex-col items-end gap-1">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
              </div>
              <span className="text-sm font-semibold text-foreground">4.75 de 5 — más de 500 reseñas</span>
            </div>
          </div>

          <div
            className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {REVIEWS.map((review) => (
              <div
                key={review.id}
                className="p-5 flex-shrink-0 w-72 md:w-80 bg-white border border-border rounded-2xl hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 snap-start"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold bg-primary text-primary-foreground">
                      {review.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-foreground">{review.name}</span>
                        <BadgeCheck className="w-3.5 h-3.5 text-blue-500" />
                      </div>
                      <span className="text-xs text-muted-foreground">{review.city} · {review.reservations} reservas</span>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{review.time}</span>
                </div>

                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-transparent text-border'}`} />
                  ))}
                </div>

                <p className="text-sm text-foreground leading-relaxed">"{review.text}"</p>

                <div className="mt-4">
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground font-medium">
                    <BadgeCheck className="w-3 h-3" />
                    Usuario verificado
                  </span>
                </div>
              </div>
            ))}

            <div
              className="flex-shrink-0 w-72 md:w-80 flex flex-col items-center justify-center p-8 text-center rounded-2xl bg-muted snap-start border-[1.5px] border-dashed border-border"
            >
              <div className="text-3xl mb-3">⭐</div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Más de <strong className="text-foreground">500 reseñas</strong> de usuarios reales en toda Tenerife
              </p>
              <button
                onClick={handleSearch}
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-all"
              >
                Reserva ahora
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. GANA DINERO ── */}
      <section
        className="relative overflow-hidden py-16 md:py-24 bg-gradient-to-br from-[#1B4FD8] via-[#1a3fb5] via-60% to-[#152f8c]"
      >
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.3)_0%,transparent_50%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.15)_0%,transparent_40%)]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left: content */}
            <div>
              <h2
                className="text-white font-extrabold mb-4 text-[clamp(1.9rem,4vw,2.9rem)] leading-[1.12] tracking-[-0.02em]"
              >
                ¿Tienes una plaza de<br />aparcamiento sin usar?
              </h2>

              <p className="mb-8 text-lg leading-relaxed max-w-md text-white/75">
                Únete a miles de propietarios que ya generan ingresos extra alquilando su plaza cuando no la usan.
              </p>

              {/* 3 step cards */}
              <div className="grid grid-cols-3 gap-3 mb-8">
                {EARN_STEPS.map((s) => (
                  <div
                    key={s.step}
                    className="p-4 rounded-xl bg-white/10 border border-white/20"
                  >
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3 text-white bg-white/20">
                      {s.icon}
                    </div>
                    <div className="text-xs mb-1 font-medium text-white/50">{s.step}</div>
                    <div className="text-sm font-bold text-white mb-1 leading-tight">{s.title}</div>
                    <div className="text-xs leading-snug text-white/55">{s.desc}</div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate('/owner-profile')}
                className="flex items-center gap-2 px-7 py-4 rounded-xl font-bold text-sm transition-all duration-200 active:scale-[0.98] hover:shadow-xl bg-accent text-white"
              >
                Empieza a ganar dinero <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Right: earnings calculator card */}
            <div className="relative">
              {/* ¡Popular! badge */}
              <div className="absolute -top-4 right-6 z-10 px-7 py-2.5 rounded-full text-sm font-bold shadow-lg bg-accent text-[#1a1a1a]">
                ¡Popular!
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-2xl">
                <h3 className="font-bold text-foreground text-lg mb-1">Calcula tus ganancias</h3>
                <p className="text-sm text-muted-foreground mb-5">Estimación basada en una plaza en zona céntrica</p>

                <div className="space-y-2">
                  {EARN_ROWS.map((row, i) => (
                    <div
                      key={row.hours}
                      className="flex items-center justify-between py-3 border-b border-border last:border-b-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#1B4FD8]/10">
                          <Calendar className="w-4 h-4 text-[#1B4FD8]" />
                        </div>
                        <div>
                          <div className="font-bold text-sm text-foreground">{row.hours}</div>
                          <div className="text-xs text-muted-foreground">{row.label}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-extrabold text-base text-[#1B4FD8]">{row.amount}</div>
                        <div className="text-xs text-muted-foreground">aproximado</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 mt-0.5 shrink-0 text-[#1B4FD8]" />
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">+400 propietarios</strong> en Tenerife ya están generando ingresos con Parky
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. FOOTER ── */}
      <footer className="bg-footer-background">
        <div className="border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-white font-bold text-lg mb-1">¿Listo para aparcar sin estrés?</h3>
              <p className="text-white/55 text-[0.9rem]">
                Más de 500 conductores en Tenerife ya lo hacen con Parky.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSearch}
                className="px-5 py-2.5 text-sm font-bold rounded-lg bg-white text-primary hover:opacity-90 transition-all"
              >
                Buscar plaza ahora
              </button>
              <button
                onClick={() => navigate('/owner-profile')}
                className="px-5 py-2.5 text-sm font-semibold rounded-lg hover:bg-white/10 transition-all bg-transparent text-white/80 border-[1.5px] border-white/20"
              >
                Publicar plaza
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/10 border border-white/15">
                  <Car className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl text-white font-bold">Parky</span>
              </div>
              <p className="text-sm mb-6 text-white/45 leading-[1.65] max-w-[220px]">
                El marketplace de parking que conecta conductores con propietarios en Tenerife. Simple, rápido y seguro.
              </p>
              <div className="flex gap-3 mb-6">
                {[
                  { icon: <Twitter className="w-3.5 h-3.5" />, label: 'Twitter' },
                  { icon: <Instagram className="w-3.5 h-3.5" />, label: 'Instagram' },
                  { icon: <Linkedin className="w-3.5 h-3.5" />, label: 'LinkedIn' },
                ].map((social) => (
                  <button key={social.label} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/15 transition-all bg-white/10 text-white/70 border border-white/10"
                    aria-label={social.label}>
                    {social.icon}
                  </button>
                ))}
              </div>
              <div className="flex flex-col gap-2">
                {[
                  { icon: <Mail className="w-3.5 h-3.5" />, text: 'hola@parky.es' },
                  { icon: <Phone className="w-3.5 h-3.5" />, text: '+34 922 000 000' },
                ].map((c) => (
                  <div key={c.text} className="flex items-center gap-2">
                    <span className="text-white/35">{c.icon}</span>
                    <span className="text-xs text-white/45">{c.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {Object.entries(FOOTER_LINKS).map(([category, links]) => (
              <div key={category} className="col-span-1">
                <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-white/90">
                  {category}
                </h4>
                <ul className="flex flex-col gap-2.5">
                  {links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm transition-colors hover:text-white text-white/40">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs text-white/30">
              © 2026 Parky · TFG Hugo González Pérez · Universidad de La Laguna. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-4">
              {[{ label: 'App Store' }, { label: 'Google Play' }].map((app) => (
                <button key={app.label} className="flex items-center gap-1.5 text-xs hover:opacity-70 transition-all text-white/35">
                  {app.label}
                </button>
              ))}
              <div className="flex items-center gap-1.5 text-xs text-white/25">
                <MapPin className="w-3 h-3" />
                Tenerife, España
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
