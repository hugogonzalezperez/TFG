import { useState, useEffect, useMemo } from 'react';
import { Input, Card, Button, DatePicker, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../ui';
import {
  Car, MapPin, Calendar, Clock, Search,
  Star, Shield, Check, X, BadgeCheck, ArrowRight,
  TrendingUp, Users, Euro, CreditCard, ThumbsUp,
  Twitter, Instagram, Linkedin, Mail, Phone, Zap
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
    rating: 4.8,
    hot: true,
    image: 'https://images.unsplash.com/photo-1703693837521-e76ee7b8dc74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  },
  {
    id: 2,
    name: 'La Laguna',
    subtitle: 'Ciudad universitaria',
    spots: 89,
    rating: 4.7,
    hot: false,
    image: 'https://images.unsplash.com/photo-1616428394230-ba242d33e3ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  },
  {
    id: 3,
    name: 'Puerto de la Cruz',
    subtitle: 'Costa norte',
    spots: 67,
    rating: 4.9,
    hot: true,
    image: 'https://images.unsplash.com/photo-1771407573830-a21d9b6a1e5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  },
  {
    id: 4,
    name: 'Los Cristianos',
    subtitle: 'Costa sur',
    spots: 124,
    rating: 4.6,
    hot: false,
    image: 'https://images.unsplash.com/photo-1766293777298-992506f9fb84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  },
  {
    id: 5,
    name: 'Costa Adeje',
    subtitle: 'Zona turística',
    spots: 98,
    rating: 4.8,
    hot: true,
    image: 'https://images.unsplash.com/photo-1776323753894-53ffa5d198f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  },
  {
    id: 6,
    name: 'Aeropuerto Sur',
    subtitle: 'TFS · Larga estancia',
    spots: 47,
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
    icon: <ThumbsUp className="w-5 h-5" />,
    title: 'Garantía de satisfacción',
    desc: 'Si algo no está bien, te devolvemos el dinero. Sin preguntas.',
    stat: '4.9★',
    statLabel: 'satisfacción usuarios',
  },
];

const COMPARISON = [
  { feature: 'Reserva anticipada desde el móvil', parky: true, traditional: false },
  { feature: 'Precio fijo garantizado', parky: true, traditional: false },
  { feature: 'Cancelación gratuita', parky: true, traditional: false },
  { feature: 'Acceso inteligente 24/7', parky: true, traditional: false },
  { feature: 'Reembolso automático', parky: true, traditional: false },
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

const PERKS = [
  { icon: <Euro className="w-4 h-4" />, title: 'Hasta 200€/mes', desc: 'De media, propietarios en Tenerife ganan 200€ mensuales con una sola plaza.' },
  { icon: <Clock className="w-4 h-4" />, title: 'Tú decides cuándo', desc: 'Bloquea los días que necesites y alquila el resto. Control total.' },
  { icon: <Shield className="w-4 h-4" />, title: 'Siempre protegido', desc: 'Acceso inteligente verificado. Tu propiedad, siempre segura.' },
  { icon: <TrendingUp className="w-4 h-4" />, title: 'Alta demanda garantizada', desc: 'Miles de conductores buscan plazas en tu zona cada día.' },
];

const STEPS = [
  {
    step: '01',
    icon: <Search className="h-6 w-6" />,
    title: 'Busca tu zona',
    desc: 'Introduce tu destino y las fechas. Disponibilidad en tiempo real.',
  },
  {
    step: '02',
    icon: <Calendar className="h-6 w-6" />,
    title: 'Reserva en segundos',
    desc: 'Elige el garaje que más te guste y confirma al instante.',
  },
  {
    step: '03',
    icon: <Car className="h-6 w-6" />,
    title: 'Aparca y listo',
    desc: 'Acceso inteligente 24/7. Sin llaves, sin esperas.',
  },
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

  return (
    <div className="min-h-screen bg-white">

      {/* ── 1. HERO ── */}
      <section className="relative min-h-screen flex flex-col overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1758443230465-b6aef0da08b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1440"
            alt="Vista aérea de ciudad"
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, rgba(3,2,19,0.88) 0%, rgba(3,2,19,0.68) 50%, rgba(3,2,19,0.80) 100%)' }}
          />
        </div>

        {/* Animated blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-20 blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.3), transparent 70%)' }}
          />
          <div
            className="absolute top-1/3 -right-32 w-80 h-80 rounded-full opacity-15 blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.2), transparent 70%)' }}
          />
        </div>

        {/* Content */}
        <div className={`relative z-10 flex-1 flex flex-col items-center justify-center w-full max-w-7xl mx-auto px-4 sm:px-6 ${isNative() ? 'py-4 pt-10' : 'pt-24 pb-16'}`}>
          {/* Social proof badge */}
          <div
            className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full"
            style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}
          >
            <span className="flex">
              {[1,2,3,4,5].map(i => <span key={i} className="text-yellow-400 text-xs">★</span>)}
            </span>
            <span className="text-xs text-white/90" style={{ fontWeight: 500 }}>
              4.9 · Más de <strong className="text-white">500 conductores</strong> confían en Parky
            </span>
          </div>

          {/* Headline */}
          <h1
            className="text-center text-white mb-4"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.75rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', maxWidth: '760px' }}
          >
            Encuentra{' '}
            <span style={{ color: 'hsl(var(--accent))' }}>aparcamiento</span>
            <br />
            en cualquier lugar de Tenerife.
          </h1>

          <p
            className="text-center mb-10"
            style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'rgba(255,255,255,0.75)', maxWidth: '520px', lineHeight: 1.6 }}
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

          {/* Trust stats */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 md:gap-10">
            {[
              { icon: <MapPin className="w-4 h-4" />, value: '6+', label: 'zonas en Tenerife' },
              { icon: <Users className="w-4 h-4" />, value: '500+', label: 'usuarios activos' },
              { icon: <Star className="w-4 h-4" />, value: '4.9★', label: 'valoración media' },
              { icon: <TrendingUp className="w-4 h-4" />, value: '60%', label: 'ahorro vs. público' },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)' }}
                >
                  {stat.icon}
                </div>
                <div>
                  <div className="text-white text-sm" style={{ fontWeight: 700, lineHeight: 1.2 }}>{stat.value}</div>
                  <div className="text-xs" style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.2 }}>{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Wave transition */}
        <div className="relative z-10">
          <svg viewBox="0 0 1440 60" className="w-full block" style={{ marginBottom: '-2px' }} preserveAspectRatio="none">
            <path d="M0,60 C360,0 1080,0 1440,60 L1440,60 L0,60 Z" fill="#ffffff" />
          </svg>
        </div>
      </section>

      {/* ── 2. ZONAS POPULARES ── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3 bg-muted text-muted-foreground">
                <span className="text-xs font-semibold tracking-wider uppercase">Zonas populares</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
                Las zonas más buscadas
                <br />
                <span className="text-muted-foreground font-medium text-2xl md:text-3xl">en toda la isla</span>
              </h2>
            </div>
            <button
              onClick={() => navigate('/map')}
              className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-foreground hover:gap-2.5 transition-all duration-200"
            >
              Ver mapa completo <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Horizontal scroll */}
          <div
            className="flex gap-4 overflow-x-auto pb-4"
            style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none' }}
          >
            {ZONES.map((zone) => (
              <div
                key={zone.id}
                className="flex-shrink-0 w-56 md:w-64 cursor-pointer transition-all duration-250 overflow-hidden"
                style={{
                  scrollSnapAlign: 'start',
                  borderRadius: '1rem',
                  border: '1.5px solid hsl(var(--border))',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  background: '#ffffff',
                }}
                onClick={() => navigateToZone(zone.name)}
              >
                {/* Image */}
                <div className="relative h-36 overflow-hidden">
                  <img
                    src={zone.image}
                    alt={zone.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.55) 100%)' }}
                  />
                  {/* Hot badge */}
                  {zone.hot && (
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500 text-white">
                      <Zap className="w-2.5 h-2.5 fill-white" />
                      <span className="text-[10px] font-bold">Alta demanda</span>
                    </div>
                  )}
                  {/* Rating */}
                  <div
                    className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
                  >
                    <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-[10px] font-semibold text-white">{zone.rating}</span>
                  </div>
                  {/* City on image */}
                  <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 text-white/90">
                    <MapPin className="w-3 h-3" />
                    <span className="text-xs font-medium">{zone.subtitle}</span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-3.5">
                  <h3 className="font-bold text-sm text-foreground mb-1">{zone.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground">Ver plazas</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                      {zone.spots} libres
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile CTA */}
          <div className="mt-6 flex justify-center md:hidden">
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
          {/* Header */}
          <div className="max-w-xl mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 bg-primary text-primary-foreground">
              <span className="text-xs font-bold tracking-widest uppercase">¿Por qué Parky?</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
              Aparcar no debería ser
              <br />
              <span className="text-muted-foreground font-medium">una aventura.</span>
            </h2>
          </div>

          {/* Asymmetric layout */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            {/* Benefits 2×2 */}
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {BENEFITS.map((b) => (
                <div
                  key={b.title}
                  className="p-6 bg-white rounded-2xl border border-border hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
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
                {/* Header */}
                <div className="grid grid-cols-3 px-5 py-4 bg-primary text-primary-foreground">
                  <div className="text-xs font-semibold">Características</div>
                  <div className="text-center text-xs font-bold">Parky ✓</div>
                  <div className="text-center text-xs font-medium opacity-60">Parking tradicional</div>
                </div>

                {/* Rows */}
                {COMPARISON.map((row, i) => (
                  <div
                    key={row.feature}
                    className="grid grid-cols-3 px-5 py-3.5 items-center hover:bg-muted/50 transition-colors"
                    style={{ borderBottom: i < COMPARISON.length - 1 ? '1px solid hsl(var(--border))' : 'none' }}
                  >
                    <span className="text-xs font-medium text-foreground pr-3 leading-snug">{row.feature}</span>
                    <div className="flex justify-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${row.parky ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                        {row.parky
                          ? <Check className="w-3.5 h-3.5" strokeWidth={3} />
                          : <X className="w-3.5 h-3.5" strokeWidth={3} />}
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${row.traditional ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                        {row.traditional
                          ? <Check className="w-3.5 h-3.5" strokeWidth={3} />
                          : <X className="w-3.5 h-3.5" strokeWidth={3} />}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Footer CTA */}
                <div className="px-5 py-5 bg-muted/50">
                  <button
                    onClick={handleSearch}
                    className="w-full py-3 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98] transition-all"
                  >
                    Prueba Parky gratis →
                  </button>
                  <p className="text-center text-xs mt-2 text-muted-foreground">
                    Sin tarjeta de crédito · Cancela cuando quieras
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. OPINIONES ── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Stats row */}
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-px mb-14 overflow-hidden rounded-2xl border border-border bg-border"
          >
            {[
              { icon: <Users className="w-5 h-5" />, value: '500+', label: 'Usuarios activos' },
              { icon: <Star className="w-5 h-5" />, value: '4.9/5', label: 'Valoración media' },
              { icon: <TrendingUp className="w-5 h-5" />, value: '6', label: 'Zonas en Tenerife' },
              { icon: <BadgeCheck className="w-5 h-5" />, value: '1.000+', label: 'Reservas completadas' },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center justify-center py-8 px-4 text-center bg-white">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-muted text-foreground">
                  {stat.icon}
                </div>
                <div className="text-2xl font-extrabold text-foreground tracking-tight leading-none">{stat.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Reviews header */}
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3 bg-muted text-muted-foreground">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-semibold tracking-widest uppercase">Opiniones reales</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
                Lo que dicen nuestros usuarios
              </h2>
            </div>
            <div className="hidden md:flex flex-col items-end gap-1">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
              </div>
              <span className="text-sm font-semibold text-foreground">4.9 de 5 — más de 500 reseñas</span>
            </div>
          </div>

          {/* Reviews horizontal scroll */}
          <div
            className="flex gap-4 overflow-x-auto pb-4"
            style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none' }}
          >
            {REVIEWS.map((review) => (
              <div
                key={review.id}
                className="p-5 flex-shrink-0 w-72 md:w-80 bg-white border border-border rounded-2xl hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                style={{ scrollSnapAlign: 'start' }}
              >
                {/* Header */}
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

                {/* Stars */}
                <div className="flex gap-0.5 mb-3">
                  {[1,2,3,4,5].map(i => (
                    <Star
                      key={i}
                      className="w-3.5 h-3.5"
                      style={{ fill: i <= review.rating ? '#facc15' : 'transparent', color: i <= review.rating ? '#facc15' : 'hsl(var(--border))' }}
                    />
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

            {/* CTA card */}
            <div
              className="flex-shrink-0 w-72 md:w-80 flex flex-col items-center justify-center p-8 text-center rounded-2xl bg-muted"
              style={{ scrollSnapAlign: 'start', border: '1.5px dashed hsl(var(--border))' }}
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

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 py-6 border-t border-border">
            {[
              { icon: '🔒', label: 'Pagos seguros SSL' },
              { icon: '✅', label: 'Plazas verificadas' },
              { icon: '📱', label: 'App iOS y Android' },
              { icon: '🛡️', label: 'Garantía de reembolso' },
              { icon: '🏆', label: 'Hecho en Tenerife' },
            ].map((badge) => (
              <div key={badge.label} className="flex items-center gap-2 text-muted-foreground">
                <span className="text-base">{badge.icon}</span>
                <span className="text-xs font-medium">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. CÓMO FUNCIONA ── */}
      <section className="py-16 md:py-20 bg-muted/40 border-y border-border/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 bg-muted text-muted-foreground">
              <span className="text-xs font-semibold tracking-widest uppercase">Proceso simple</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight mb-2">
              ¿Cómo funciona?
            </h2>
            <p className="text-muted-foreground">Reserva en menos de 2 minutos</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-7 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20" />
            {STEPS.map((item) => (
              <div key={item.step} className="flex flex-col items-center text-center relative">
                <div className="relative mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary relative z-10 ring-4 ring-background">
                    {item.icon}
                  </div>
                  <span className="absolute -top-3 -right-3 text-2xl font-black text-primary/15 leading-none select-none">{item.step}</span>
                </div>
                <h3 className="font-bold text-foreground text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-[220px]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. GANA DINERO ── */}
      <section className="relative overflow-hidden py-16 md:py-24 bg-primary">
        <div
          className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 40%)' }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Content */}
            <div>
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
                style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.9)', border: '1px solid rgba(255,255,255,0.2)' }}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span className="text-xs font-bold tracking-widest uppercase">Propietarios</span>
              </div>

              <h2
                className="text-white mb-4"
                style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.03em' }}
              >
                Tu plaza vacía
                <br />
                <span style={{ color: 'rgba(255,255,255,0.55)' }}>es dinero perdido.</span>
              </h2>

              <p className="mb-8" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.05rem', lineHeight: 1.65, maxWidth: '440px' }}>
                Mientras tú no la usas, alguien la necesita. Publica tu plaza en 5 minutos y empieza a cobrar esta semana.
              </p>

              {/* Perks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                {PERKS.map((perk) => (
                  <div key={perk.title} className="flex items-start gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.9)', border: '1px solid rgba(255,255,255,0.15)' }}
                    >
                      {perk.icon}
                    </div>
                    <div>
                      <div className="text-sm text-white font-bold mb-0.5">{perk.title}</div>
                      <div className="text-xs" style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>{perk.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate('/owner-profile')}
                  className="flex items-center justify-center gap-2 px-6 py-4 text-sm font-bold rounded-lg bg-white text-primary hover:opacity-90 hover:shadow-xl transition-all duration-200 active:scale-[0.98]"
                >
                  Publicar mi plaza <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate('/owner-profile')}
                  className="flex items-center justify-center gap-2 px-6 py-4 text-sm font-semibold rounded-lg hover:bg-white/10 transition-all duration-200"
                  style={{ background: 'transparent', color: 'rgba(255,255,255,0.85)', border: '1.5px solid rgba(255,255,255,0.25)' }}
                >
                  Calcular mis ingresos
                </button>
              </div>

              <p className="mt-5 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Más de{' '}
                <strong style={{ color: 'rgba(255,255,255,0.75)' }}>400 propietarios</strong>{' '}
                ya están ganando dinero con Parky en Tenerife
              </p>
            </div>

            {/* Image + floating cards */}
            <div className="relative">
              {/* Earnings card */}
              <div
                className="absolute -top-4 -left-4 md:-left-8 z-10 px-4 py-3 flex items-center gap-3 rounded-2xl"
                style={{ background: '#ffffff', boxShadow: '0 12px 40px rgba(0,0,0,0.25)' }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-green-100">
                  <Euro className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Este mes ganaste</div>
                  <div className="font-extrabold text-lg text-green-600">+198,50€</div>
                </div>
              </div>

              {/* Reservations badge */}
              <div
                className="absolute -bottom-4 -right-4 md:-right-8 z-10 px-4 py-3 flex items-center gap-2 rounded-2xl"
                style={{ background: '#ffffff', boxShadow: '0 12px 40px rgba(0,0,0,0.25)' }}
              >
                <div className="flex -space-x-2">
                  {['#121db6', '#4a4a6a', '#717182'].map((color, i) => (
                    <div
                      key={i}
                      className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-xs text-white font-bold"
                      style={{ background: color }}
                    >
                      {['C', 'M', 'J'][i]}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="font-bold text-sm text-foreground">3 reservas hoy</div>
                  <div className="text-xs text-muted-foreground">Próxima: 18:00h</div>
                </div>
              </div>

              {/* Main image */}
              <div className="overflow-hidden rounded-3xl border border-white/10">
                <img
                  src="https://images.unsplash.com/photo-1768244016536-6ccee6dc07d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
                  alt="Propietario ganando dinero con Parky"
                  className="w-full h-80 md:h-96 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. FOOTER ── */}
      <footer className="bg-primary">
        {/* Pre-footer CTA */}
        <div className="border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-white font-bold text-lg mb-1">¿Listo para aparcar sin estrés?</h3>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.9rem' }}>
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
                className="px-5 py-2.5 text-sm font-semibold rounded-lg hover:bg-white/10 transition-all"
                style={{ background: 'transparent', color: 'rgba(255,255,255,0.8)', border: '1.5px solid rgba(255,255,255,0.2)' }}
              >
                Publicar plaza
              </button>
            </div>
          </div>
        </div>

        {/* Main footer */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
            {/* Brand */}
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.15)' }}
                >
                  <Car className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl text-white font-bold">Parky</span>
              </div>
              <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.45)', lineHeight: 1.65, maxWidth: '220px' }}>
                El marketplace de parking que conecta conductores con propietarios en Tenerife. Simple, rápido y seguro.
              </p>

              {/* Social */}
              <div className="flex gap-3 mb-6">
                {[
                  { icon: <Twitter className="w-3.5 h-3.5" />, label: 'Twitter' },
                  { icon: <Instagram className="w-3.5 h-3.5" />, label: 'Instagram' },
                  { icon: <Linkedin className="w-3.5 h-3.5" />, label: 'LinkedIn' },
                ].map((social) => (
                  <button
                    key={social.label}
                    className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/15 transition-all"
                    style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)' }}
                    aria-label={social.label}
                  >
                    {social.icon}
                  </button>
                ))}
              </div>

              {/* Contact */}
              <div className="flex flex-col gap-2">
                {[
                  { icon: <Mail className="w-3.5 h-3.5" />, text: 'hola@parky.es' },
                  { icon: <Phone className="w-3.5 h-3.5" />, text: '+34 922 000 000' },
                ].map((contact) => (
                  <div key={contact.text} className="flex items-center gap-2">
                    <span style={{ color: 'rgba(255,255,255,0.35)' }}>{contact.icon}</span>
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>{contact.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {Object.entries(FOOTER_LINKS).map(([category, links]) => (
              <div key={category} className="col-span-1">
                <h4
                  className="mb-4 text-xs font-bold uppercase tracking-widest"
                  style={{ color: 'rgba(255,255,255,0.9)' }}
                >
                  {category}
                </h4>
                <ul className="flex flex-col gap-2.5">
                  {links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm transition-colors hover:text-white"
                        style={{ color: 'rgba(255,255,255,0.4)' }}
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div
            className="mt-12 pt-6 border-t flex flex-col md:flex-row items-center justify-between gap-3"
            style={{ borderColor: 'rgba(255,255,255,0.08)' }}
          >
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
              © 2026 Parky · TFG Hugo González Pérez · Universidad de La Laguna. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-4">
              {[
                { icon: '🍎', label: 'App Store' },
                { icon: '🤖', label: 'Google Play' },
              ].map((app) => (
                <button
                  key={app.label}
                  className="flex items-center gap-1.5 text-xs hover:opacity-70 transition-all"
                  style={{ color: 'rgba(255,255,255,0.35)' }}
                >
                  <span>{app.icon}</span>
                  {app.label}
                </button>
              ))}
              <div className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
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
