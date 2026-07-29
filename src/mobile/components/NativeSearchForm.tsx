/**
 * NativeSearchForm — Android-optimised search form.
 *
 * Key pattern: `<input type="date/time">` are positioned absolute + opacity-0
 * over a styled text display. On Android WebView they trigger the native system
 * date/time picker dialogs. This is invisible to the user but gives 100% native feel.
 *
 * Only used in NativeHomePage (never in the web version).
 */

import { useState } from 'react';
import { MapPin, Calendar, Clock, Search, X } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { impact } from '@/mobile/haptics';

export interface NativeSearchData {
  location: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
}

interface NativeSearchFormProps {
  onSearch: (data: NativeSearchData) => void;
  className?: string;
}

const MONTHS_ES = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];

function fmtDate(iso: string): string {
  if (!iso) return '';
  const [, m, d] = iso.split('-');
  return `${parseInt(d)} ${MONTHS_ES[parseInt(m) - 1]}`;
}

function todayIso(): string {
  return new Date().toISOString().split('T')[0];
}

export function NativeSearchForm({ onSearch, className }: NativeSearchFormProps) {
  const [location,  setLocation]  = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate,   setEndDate]   = useState('');
  const [endTime,   setEndTime]   = useState('');

  const today      = todayIso();
  const isDisabled = !location.trim();

  const handleSearch = () => {
    if (isDisabled) return;
    impact('Medium');
    onSearch({ location, startDate, startTime, endDate, endTime });
  };

  /* ─── MD3 list-item row ─────────────────────────────────────── */
  return (
    <div className={cn(
      'bg-card rounded-2xl overflow-hidden shadow-2xl border border-border/40',
      className
    )}>

      {/* 1 ── Ubicación ── full-width text input */}
      <label className="flex items-center px-4 min-h-[56px] border-b border-border gap-3 active:bg-muted/40 transition-colors">
        <MapPin className="w-[18px] h-[18px] text-primary shrink-0" />
        <input
          type="text"
          placeholder="¿Dónde vas a aparcar?"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="flex-1 bg-transparent text-[15px] font-medium text-foreground placeholder:text-muted-foreground/80 outline-none py-4"
          inputMode="search"
          enterKeyHint="search"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
        />
        {location && (
          <button
            onPointerDown={() => setLocation('')}
            className="p-1 -mr-1 rounded-full text-muted-foreground active:bg-muted"
            aria-label="Borrar ubicación"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </label>

      {/* 2 ── Entrada ── native date + time overlay inputs */}
      <div className="flex items-center px-4 min-h-[60px] border-b border-border gap-3">
        <Calendar className="w-[18px] h-[18px] text-primary shrink-0" />
        <div className="flex-1 py-2">
          <span className="block text-[10px] font-bold text-muted-foreground tracking-wider mb-1">
            ENTRADA
          </span>
          <div className="flex items-center gap-3">
            {/* Date — invisible input over display text */}
            <div className="relative flex-1">
              <span className={cn(
                'text-[14px] font-semibold pointer-events-none',
                startDate ? 'text-foreground' : 'text-muted-foreground'
              )}>
                {startDate ? fmtDate(startDate) : 'Fecha'}
              </span>
              <input
                type="date"
                value={startDate}
                min={today}
                onChange={(e) => {
                  const v = e.target.value;
                  setStartDate(v);
                  if (!endDate || endDate < v) setEndDate(v);
                }}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              />
            </div>

            <div className="w-px h-5 bg-border" />

            {/* Time */}
            <div className="relative w-[64px]">
              <span className={cn(
                'text-[14px] font-semibold pointer-events-none',
                startTime ? 'text-foreground' : 'text-muted-foreground'
              )}>
                {startTime || 'Hora'}
              </span>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3 ── Salida ── same pattern */}
      <div className="flex items-center px-4 min-h-[60px] border-b border-border gap-3">
        <Clock className="w-[18px] h-[18px] text-primary shrink-0" />
        <div className="flex-1 py-2">
          <span className="block text-[10px] font-bold text-muted-foreground tracking-wider mb-1">
            SALIDA
          </span>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <span className={cn(
                'text-[14px] font-semibold pointer-events-none',
                endDate ? 'text-foreground' : 'text-muted-foreground'
              )}>
                {endDate ? fmtDate(endDate) : 'Fecha'}
              </span>
              <input
                type="date"
                value={endDate}
                min={startDate || today}
                onChange={(e) => setEndDate(e.target.value)}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              />
            </div>

            <div className="w-px h-5 bg-border" />

            <div className="relative w-[64px]">
              <span className={cn(
                'text-[14px] font-semibold pointer-events-none',
                endTime ? 'text-foreground' : 'text-muted-foreground'
              )}>
                {endTime || 'Hora'}
              </span>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4 ── CTA button */}
      <div className="p-3">
        <button
          onClick={handleSearch}
          disabled={isDisabled}
          className={cn(
            'w-full h-[52px] font-bold text-[15px] rounded-xl',
            'flex items-center justify-center gap-2',
            'transition-all duration-150 active:scale-[0.97] select-none',
            isDisabled
              ? 'bg-muted/80 text-muted-foreground cursor-not-allowed'
              : 'bg-accent text-white shadow-lg shadow-accent/25 active:shadow-accent/10'
          )}
        >
          <Search className="w-[18px] h-[18px]" />
          {isDisabled ? 'Introduce una ubicación' : 'Buscar aparcamiento'}
        </button>
      </div>
    </div>
  );
}
