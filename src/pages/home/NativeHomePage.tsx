/**
 * NativeHomePage — App nativa Android (Capacitor).
 * Solo contiene: Hero/Búsqueda + Zonas populares.
 * El resto de secciones (beneficios, reseñas, gana dinero, footer)
 * son contenido de marketing web-only y no tienen sentido en una app nativa.
 *
 * Safe areas:
 *  - Top:    overlaysWebView=true → hero rellena detrás del status bar
 *            env(safe-area-inset-top) devuelve la altura real del status bar
 *  - Bottom: env(safe-area-inset-bottom) en el nav + spacer final
 */

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Clock, Search, Star, Zap, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '@/ui';
import { useFilters } from '@/features/parking';
import { useAuth } from '@/features/auth';
import { HomeSkeleton } from '@/shared/components/loaders';
import { setHeroStatusBar, setDarkStatusBar } from '@/mobile/status-bar';
import { impact } from '@/mobile/haptics';
import { cn } from '@/shared/lib/cn';

/* ─── Zonas (mismo dataset que HomePage.tsx) ─── */
const ZONES = [
  { id: 1, name: 'Santa Cruz',      subtitle: 'Centro urbano',        spots: 156, price: '2.50€/h', rating: 4.8, hot: true,
    image: 'https://imgs.search.brave.com/d5GGdqb82i_8xmaHhZvJtrueJBmox8Y7L4hHGlTd_d0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/ZGVzdGlub3NpbnRl/bGlnZW50ZXMuZXMv/d3AtY29udGVudC91/cGxvYWRzLzIwMjIv/MDUvU2FudGEtQ3J1/ei1kZS1UZW5lcmlm/ZS5qcGc' },
  { id: 2, name: 'La Laguna',       subtitle: 'Ciudad universitaria', spots: 89,  price: '2.00€/h', rating: 4.7, hot: false,
    image: 'https://espanaviajar.com/wp-content/uploads/2022/01/SAN-CRISTOBALA-DE-LA-LAGUNA-Pueblos-mas-bonitos-de-Tenerife.jpg' },
  { id: 3, name: 'Puerto de la Cruz', subtitle: 'Costa norte',        spots: 67,  price: '2.20€/h', rating: 4.9, hot: true,
    image: 'https://www.barcelo.com/guia-turismo/wp-content/uploads/puerto-de-la-cruz-3.jpg' },
  { id: 4, name: 'Los Cristianos',  subtitle: 'Costa sur',            spots: 124, price: '3.00€/h', rating: 4.6, hot: false,
    image: 'https://www.home4escape.com/wp-content/uploads/2024/07/image-1.png' },
  { id: 5, name: 'Costa Adeje',     subtitle: 'Zona turística',       spots: 98,  price: '3.50€/h', rating: 4.8, hot: true,
    image: 'https://www.jet2holidays.com/destinations/canary-islands/tenerife/media_16ac09285401ef9effafdcb98950ba161179e711b.jpg?width=1200&format=pjpg&optimize=medium' },
  { id: 6, name: 'Aeropuerto Sur',  subtitle: 'TFS · Larga estancia', spots: 47,  price: '1.80€/h', rating: 4.9, hot: true,
    image: 'https://s1.abcstatics.com/media/espana/2020/05/16/Aeropuerto-Tenerife-Sur-Fotografia-AENA_EDIIMA20151124_0473_42-k1m--1248x698@abc.jpg' },
] as const;

/* ─── Helpers fecha ─── */
const MONTHS = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
function fmtDate(iso: string) {
  if (!iso) return '';
  const [, m, d] = iso.split('-');
  return `${parseInt(d)} ${MONTHS[parseInt(m) - 1]}`;
}
const todayIso = () => new Date().toISOString().split('T')[0];

/* ════════════════════════════════════════════════════════════ */

export default function NativeHomePage() {
  const navigate = useNavigate();
  const { setDateTimeFilters, resetFilters } = useFilters();
  const { loading } = useAuth();
  const zonesRef = useRef<HTMLDivElement>(null);

  /* search state */
  const [location,  setLocation]  = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate,   setEndDate]   = useState('');
  const [endTime,   setEndTime]   = useState('');

  const today      = todayIso();
  const isDisabled = !location.trim();

  useEffect(() => {
    resetFilters();
    setHeroStatusBar(); // white icons, hero extends behind status bar
    return () => { setDarkStatusBar(); };
  }, [resetFilters]);

  if (loading) return <HomeSkeleton />;

  /* ─── handlers ─── */
  const handleSearch = () => {
    if (isDisabled) return;
    impact('Medium');
    if (startDate && startTime && endDate && endTime) {
      setDateTimeFilters({ startDate, startTime, endDate, endTime });
    } else {
      setDateTimeFilters({ startDate: '', startTime: '', endDate: '', endTime: '' });
    }
    navigate('/map', { state: { location, startDate, startTime, endDate, endTime } });
  };

  const handleZone = (name: string) => {
    setDateTimeFilters({ startDate: '', startTime: '', endDate: '', endTime: '' });
    navigate('/map', { state: { location: name } });
  };

  const scrollZones = (dir: 'left' | 'right') =>
    zonesRef.current?.scrollBy({ left: dir === 'left' ? -260 : 260, behavior: 'smooth' });

  /* ════════════════════════════════════════════════════════════ */
  return (
    <div className="bg-background min-h-screen">

      {/* ══ 1. HERO ══════════════════════════════════════════════
          overlaysWebView=true → hero va de borde a borde (detrás del status bar).
          pt: env(safe-area-inset-top) = altura real del status bar  +
              4rem (header h-16 transparente)  +  1rem (breathing room).
      ══════════════════════════════════════════════════════════ */}
      <section className="relative flex flex-col overflow-hidden min-h-[100svh]">

        {/* Fondo */}
        <div className="absolute inset-0">
          <img
            src="/hero_section.png"
            alt="Costa de Tenerife"
            className="w-full h-full object-cover object-center"
            loading="eager"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-[#0A0C23]/[0.70]" />
        </div>

        {/* Contenido centrado verticalmente */}
        <div
          className="relative z-10 flex-1 flex flex-col items-center justify-center w-full px-4 pb-8"
          style={{ paddingTop: 'calc(env(safe-area-inset-top) + 5rem)' }}
        >
          {/* Headline */}
          <h1 className="text-center text-white font-black leading-[1.05] tracking-[-0.04em] text-[2rem] mb-3 max-w-[340px]">
            Encuentra{' '}
            <span className="text-accent">aparcamiento</span>
            <br />
            en cualquier lugar de{' '}
            <span className="text-blue-400">Tenerife</span>
            .
          </h1>

          <p className="text-center text-white/80 text-[1rem] leading-[1.6] mb-6 max-w-[320px]">
            Reserva plazas privadas hasta un{' '}
            <strong className="text-white">60% más baratas</strong>{' '}
            que los parkings públicos.
          </p>

          {/* ── Search Card ─────────────────────────────────────
              Mismo look que la versión web adaptado a 1 columna mobile.
              DatePicker/TimePicker reemplazados por <input type="date/time">
              invisibles sobre texto estilizado → disparan pickers nativos Android.
          ── */}
          <Card className="w-full shadow-2xl rounded-2xl border-0 bg-card/97 backdrop-blur-xl overflow-hidden">
            <div className="p-5 space-y-4">

              {/* Ubicación */}
              <div>
                <label className="text-[13px] font-semibold flex items-center text-muted-foreground mb-2">
                  <MapPin className="h-3.5 w-3.5 mr-1.5 text-primary" />
                  Ubicación
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="¿Dónde vas a aparcar?"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full h-[58px] px-4 bg-muted/50 border border-border rounded-xl text-[16px] font-medium text-foreground placeholder:text-muted-foreground/70 outline-none focus:border-primary transition-colors"
                    inputMode="search"
                    enterKeyHint="search"
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck={false}
                  />
                  {location && (
                    <button
                      onPointerDown={() => setLocation('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-muted-foreground active:bg-muted"
                      aria-label="Borrar"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Entrada */}
              <div>
                <label className="text-[13px] font-semibold flex items-center text-muted-foreground mb-2">
                  <Calendar className="h-3.5 w-3.5 mr-1.5 text-primary" />
                  Entrada
                </label>
                <div className="flex gap-2">
                  {/* Date — invisible <input type="date"> sobre display text */}
                  <div className="flex-[5] relative h-[58px] bg-muted/50 border border-border rounded-xl flex items-center px-3 gap-2 overflow-hidden">
                    <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className={cn('text-[15px] font-medium pointer-events-none select-none', startDate ? 'text-foreground' : 'text-muted-foreground')}>
                      {startDate ? fmtDate(startDate) : 'Fecha entrada'}
                    </span>
                    <input type="date" value={startDate} min={today}
                      onChange={(e) => { const v = e.target.value; setStartDate(v); if (!endDate || endDate < v) setEndDate(v); }}
                      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" />
                  </div>
                  {/* Time */}
                  <div className="flex-[3] relative h-[58px] bg-muted/50 border border-border rounded-xl flex items-center px-3 gap-1.5 overflow-hidden">
                    <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className={cn('text-[15px] font-medium pointer-events-none select-none', startTime ? 'text-foreground' : 'text-muted-foreground')}>
                      {startTime || 'Hora'}
                    </span>
                    <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)}
                      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" />
                  </div>
                </div>
              </div>

              {/* Salida */}
              <div>
                <label className="text-[13px] font-semibold flex items-center text-muted-foreground mb-2">
                  <Clock className="h-3.5 w-3.5 mr-1.5 text-primary" />
                  Salida
                </label>
                <div className="flex gap-2">
                  <div className="flex-[5] relative h-[58px] bg-muted/50 border border-border rounded-xl flex items-center px-3 gap-2 overflow-hidden">
                    <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className={cn('text-[15px] font-medium pointer-events-none select-none', endDate ? 'text-foreground' : 'text-muted-foreground')}>
                      {endDate ? fmtDate(endDate) : 'Fecha salida'}
                    </span>
                    <input type="date" value={endDate} min={startDate || today}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" />
                  </div>
                  <div className="flex-[3] relative h-[58px] bg-muted/50 border border-border rounded-xl flex items-center px-3 gap-1.5 overflow-hidden">
                    <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className={cn('text-[15px] font-medium pointer-events-none select-none', endTime ? 'text-foreground' : 'text-muted-foreground')}>
                      {endTime || 'Hora'}
                    </span>
                    <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)}
                      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" />
                  </div>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={handleSearch}
                disabled={isDisabled}
                className={cn(
                  'w-full h-[58px] font-bold text-[17px] rounded-xl flex items-center justify-center gap-3',
                  'transition-all duration-150 active:scale-[0.98] select-none',
                  isDisabled
                    ? 'bg-accent/50 text-white/70 cursor-not-allowed'
                    : 'bg-accent text-white shadow-lg shadow-accent/25'
                )}
              >
                <Search className="h-5 w-5" />
                {isDisabled ? 'Introduce una ubicación' : 'Buscar aparcamiento'}
              </button>

            </div>
          </Card>
        </div>

        {/* Wave de transición */}
        <div className="relative z-10">
          <svg viewBox="0 0 1440 60" className="w-full block -mb-[2px] text-background" preserveAspectRatio="none">
            <path d="M0,60 C360,0 1080,0 1440,60 L1440,60 L0,60 Z" fill="currentColor" />
          </svg>
        </div>
      </section>

      {/* ══ 2. ZONAS POPULARES ════════════════════════════════════ */}
      <section className="py-6 bg-background">
        <div className="px-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-extrabold text-foreground tracking-tight">
                Zonas populares en{' '}
                <span className="text-primary">Tenerife</span>
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">Descubre las zonas con más plazas</p>
            </div>
            <div className="flex items-center gap-1.5">
              <button onClick={() => scrollZones('left')}
                className="w-8 h-8 rounded-full border border-border flex items-center justify-center active:bg-muted min-w-[32px]">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={() => scrollZones('right')}
                className="w-8 h-8 rounded-full border border-border flex items-center justify-center active:bg-muted min-w-[32px]">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Carousel — mismo card que web, ajustado a 220px para mobile */}
          <div
            ref={zonesRef}
            className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-4 px-4"
          >
            {ZONES.map((zone) => (
              <div
                key={zone.id}
                onClick={() => handleZone(zone.name)}
                className="flex-shrink-0 w-[220px] bg-card rounded-2xl overflow-hidden border border-border transition-all duration-200 active:shadow-xl active:-translate-y-0.5 cursor-pointer group snap-start"
              >
                {/* Imagen */}
                <div className="relative h-36 overflow-hidden">
                  <img src={zone.image} alt={zone.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-active:scale-105"
                    loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent from-40% to-black/65" />

                  {zone.hot && (
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400 text-amber-900">
                      <Zap className="w-2.5 h-2.5 fill-amber-900" />
                      <span className="text-[11px] font-bold">Alta demanda</span>
                    </div>
                  )}
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-black/55 backdrop-blur-sm">
                    <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-[12px] font-semibold text-white">{zone.rating}</span>
                  </div>
                  <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 text-white">
                    <MapPin className="w-3 h-3" />
                    <span className="font-bold text-xs">{zone.name}</span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-3.5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-[12px] text-muted-foreground">Plazas disponibles</p>
                      <p className="text-2xl font-extrabold text-foreground leading-none mt-0.5">{zone.spots}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[12px] text-muted-foreground">Desde</p>
                      <p className="text-lg font-extrabold text-primary leading-none mt-0.5">{zone.price}</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleZone(zone.name); }}
                    className="w-full py-2.5 text-[13px] font-semibold rounded-xl border border-primary text-primary active:bg-primary active:text-white transition-all duration-150 min-h-[44px]"
                  >
                    Ver plazas
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Ver mapa CTA */}
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => navigate('/map')}
              className="flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold text-foreground border border-border active:bg-muted transition-all min-h-[44px]"
            >
              Ver mapa completo <span className="text-base">→</span>
            </button>
          </div>
        </div>
      </section>

      {/* ══ Spacer final — respeta bottom nav + gesture bar ══════ */}
      <div style={{ height: 'calc(env(safe-area-inset-bottom) + 8px)' }} />

    </div>
  );
}
