import { useState, useCallback } from 'react';
import { Clock, Shield, AlertTriangle, Star, CalendarX } from 'lucide-react';
import { AvailabilitySchedule } from '../../types/parking.types';
import { validateSchedule } from '../../utils/schedule.utils';
import {
  Card,
  Button,
  DatePicker,
  TimePicker,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '../../../../ui';
import { useNavigate } from 'react-router-dom';
import { Parking } from '../../types/parking.types';
import { useSpotBookings } from '../../../booking/hooks/useSpotBookings';
import { useIsMobile } from '../../../../shared/hooks/use-mobile';
import { getMinTimeForDate, laterTime, addOneMinute } from '@/shared/lib/time-utils';
import { cn } from '@/shared/lib/cn';

interface SearchDates {
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
}

interface ParkingBookingCardProps {
  parking: Parking;
  searchDates?: SearchDates;
}

const getLocalISOString = (d: Date) => {
  const pad = (num: number) => num.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

function isDayBlocked(dayStr: string, schedule: AvailabilitySchedule | null | undefined): boolean {
  if (!schedule) return false;
  const dow = new Date(dayStr).getDay().toString() as keyof AvailabilitySchedule;
  return !schedule[dow]?.enabled;
}

function isTimeDisabled(
  time: string,
  dayStr: string,
  schedule: AvailabilitySchedule | null | undefined,
  role: 'entry' | 'exit',
): boolean {
  if (!schedule) return false;
  const dow = new Date(dayStr).getDay().toString() as keyof AvailabilitySchedule;
  const day = schedule[dow];
  if (!day?.enabled) return true;
  if (role === 'entry') return time < day.open || time >= day.close;
  return time <= day.open || time > day.close;
}

function getScheduleHours(dayStr: string, schedule: AvailabilitySchedule | null | undefined): string | null {
  if (!schedule) return null;
  const dow = new Date(dayStr).getDay().toString() as keyof AvailabilitySchedule;
  const day = schedule[dow];
  if (!day?.enabled) return null;
  return `${day.open} – ${day.close}`;
}

export function ParkingBookingCard({ parking, searchDates }: ParkingBookingCardProps) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { data: bookings = [] } = useSpotBookings(parking.id);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const schedule = parking.availability_schedule ?? null;

  const [entryDate, setEntryDate] = useState(() => {
    if (searchDates?.startDate && searchDates?.startTime) {
      return `${searchDates.startDate}T${searchDates.startTime}`;
    }
    const d = new Date();
    d.setMinutes(Math.ceil(d.getMinutes() / 15) * 15);
    d.setSeconds(0);
    d.setMilliseconds(0);
    return getLocalISOString(d);
  });

  const [exitDate, setExitDate] = useState(() => {
    if (searchDates?.endDate && searchDates?.endTime) {
      return `${searchDates.endDate}T${searchDates.endTime}`;
    }
    const d = new Date();
    d.setMinutes(Math.ceil(d.getMinutes() / 15) * 15);
    d.setSeconds(0);
    d.setMilliseconds(0);
    d.setHours(d.getHours() + 4);
    return getLocalISOString(d);
  });

  // schedule-only predicates — past restriction handled by TimePicker minTime prop
  const isEntryTimeDisabled = useCallback(
    (time: string) => isTimeDisabled(time, entryDate.split('T')[0], schedule, 'entry'),
    [entryDate, schedule],
  );

  const isExitTimeDisabled = useCallback(
    (time: string) => isTimeDisabled(time, exitDate.split('T')[0], schedule, 'exit'),
    [exitDate, schedule],
  );

  const entryDayBlocked = isDayBlocked(entryDate.split('T')[0], schedule);
  const exitDayBlocked  = isDayBlocked(exitDate.split('T')[0],  schedule);

  const handleBooking = () => {
    setErrorMsg(null);
    const start = new Date(entryDate);
    const end = new Date(exitDate);
    const now = new Date();

    if (start > end) {
      setErrorMsg('La fecha de salida debe ser posterior a la fecha de entrada.');
      return;
    }

    if (start < now) {
      setErrorMsg('La fecha de entrada no puede ser en el pasado.');
      return;
    }

    const durationMs = end.getTime() - start.getTime();
    if (durationMs < 2 * 60 * 60 * 1000) {
      setErrorMsg('La duración mínima de la reserva es de 2 horas.');
      return;
    }

    // Check schedule restrictions
    const scheduleError = validateSchedule(start, end, schedule);
    if (scheduleError) {
      setErrorMsg(scheduleError);
      return;
    }

    // Check overlaps
    const BUFFER_MS = 15 * 60 * 1000;
    const safeStart = new Date(start.getTime() - BUFFER_MS);
    const safeEnd = new Date(end.getTime() + BUFFER_MS);

    const hasOverlap = bookings.some((b: any) => {
      const bStart = new Date(b.start_time);
      const bEnd = new Date(b.end_time);
      return bStart < safeEnd && bEnd > safeStart;
    });

    if (hasOverlap) {
      setErrorMsg('La plaza ya está reservada para el horario seleccionado.');
      return;
    }

    navigate(`/book/${parking.id}`, {
      state: {
        ...parking,
        initialStartDate: start,
        initialEndDate: end
      }
    });
  };

  const durationHours = Math.max(2, (new Date(exitDate).getTime() - new Date(entryDate).getTime()) / (1000 * 60 * 60));
  const validDuration = isNaN(durationHours) ? 4 : durationHours;

  const [entryDay, entryTime] = entryDate.split('T');
  const [exitDay, exitTime] = exitDate.split('T');

  // Human-readable explanation of why the current selection is blocked
  const selectionWarning = (() => {
    if (entryDayBlocked) return 'El parking no abre el día de entrada seleccionado.';
    if (exitDayBlocked)  return 'El parking no abre el día de salida seleccionado.';
    if (isEntryTimeDisabled(entryTime)) {
      const hrs = getScheduleHours(entryDay, schedule);
      return hrs
        ? `Hora de entrada fuera del horario del parking (${hrs}).`
        : 'Hora de entrada fuera del horario del parking.';
    }
    if (isExitTimeDisabled(exitTime)) {
      const hrs = getScheduleHours(exitDay, schedule);
      return hrs
        ? `Hora de salida fuera del horario del parking (${hrs}).`
        : 'Hora de salida fuera del horario del parking.';
    }
    const WARN_BUFFER = 15 * 60 * 1000;
    const ws = new Date(entryDate).getTime() - WARN_BUFFER;
    const we = new Date(exitDate).getTime()  + WARN_BUFFER;
    const hasConflict = bookings.some((b: any) => {
      const bStart = new Date(b.start_time).getTime();
      const bEnd   = new Date(b.end_time).getTime();
      return ws < bEnd && we > bStart;
    });
    if (hasConflict) return 'La plaza ya tiene una reserva en ese intervalo (margen de 15 min entre reservas).';
    return null;
  })();

  // Disable button when any blocking condition is already detectable without submitting
  const _start = new Date(entryDate);
  const _end = new Date(exitDate);
  const _now = new Date();
  const _durationMs = _end.getTime() - _start.getTime();
  const _BUFFER = 15 * 60 * 1000;
  const _safeStart = new Date(_start.getTime() - _BUFFER);
  const _safeEnd = new Date(_end.getTime() + _BUFFER);
  const isBookingDisabled =
    _start >= _end ||
    _start < _now ||
    _durationMs < 2 * 60 * 60 * 1000 ||
    entryDayBlocked ||
    exitDayBlocked ||
    bookings.some((b: any) =>
      new Date(b.start_time) < _safeEnd && new Date(b.end_time) > _safeStart,
    );

  const BookingForm = (
    <div className="flex flex-col h-full">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-primary">{parking.base_price_per_hour}€</span>
          <span className="text-muted-foreground">/hora</span>
        </div>

        {!isMobile && (
          <button
            onClick={() => document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer group"
          >
            <Star className="h-5 w-5 fill-accent text-accent group-hover:scale-110 transition-transform" />
            <span className="font-semibold text-foreground">{parking.rating || 'N/A'}</span>
            <span className="text-sm text-muted-foreground underline-offset-4 group-hover:underline">
              ({parking.reviews || 0})
            </span>
          </button>
        )}
      </div>

      {errorMsg && (
        <div role="alert" className="mb-4 p-3 rounded-lg flex items-center gap-2 text-sm bg-red-100 text-red-700">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {selectionWarning && !errorMsg && (
        <div role="alert" className="mb-4 p-3 rounded-lg flex items-center gap-2 text-sm bg-amber-50 text-amber-700 border border-amber-200">
          <CalendarX className="h-5 w-5 shrink-0" />
          <span>{selectionWarning}</span>
        </div>
      )}

      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="text-sm font-medium mb-1.5 flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Entrada
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-[2] min-w-0">
                <DatePicker
                  date={new Date(entryDay)}
                  onChange={(date) => {
                    if (date) {
                      const yyyy = date.getFullYear();
                      const mm = String(date.getMonth() + 1).padStart(2, '0');
                      const dd = String(date.getDate()).padStart(2, '0');
                      const newDay = `${yyyy}-${mm}-${dd}`;
                      setEntryDate(`${newDay}T${entryTime}`);
                      // Sync exit date to the same day (keep exit time)
                      if (newDay > exitDay) {
                        setExitDate(`${newDay}T${exitTime}`);
                      }
                      setErrorMsg(null);
                    }
                  }}
                  minDate={new Date()}
                />
              </div>
              <div className="flex-[1] min-w-0">
                <TimePicker
                  value={entryTime}
                  onChange={(val) => {
                    setEntryDate(`${entryDay}T${val}`);
                    // Same day: if exit is now at or before new entry, advance exit to entry+2h
                    if (entryDay === exitDay && exitTime <= val) {
                      const [h, m] = val.split(':').map(Number);
                      const advanced = h * 60 + m + 120;
                      const nh = Math.min(Math.floor(advanced / 60), 23);
                      const nm = advanced >= 24 * 60 ? 59 : advanced % 60;
                      setExitDate(`${exitDay}T${String(nh).padStart(2, '0')}:${String(nm).padStart(2, '0')}`);
                    }
                    setErrorMsg(null);
                  }}
                  minTime={getMinTimeForDate(entryDay)}
                  disabledTimes={isEntryTimeDisabled}
                  className="w-full h-10 md:h-12"
                />
              </div>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Salida
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-[2] min-w-0">
                <DatePicker
                  date={new Date(exitDay)}
                  onChange={(date) => {
                    if (date) {
                      const yyyy = date.getFullYear();
                      const mm = String(date.getMonth() + 1).padStart(2, '0');
                      const dd = String(date.getDate()).padStart(2, '0');
                      setExitDate(`${yyyy}-${mm}-${dd}T${exitTime}`);
                      setErrorMsg(null);
                    }
                  }}
                  minDate={new Date(entryDay)}
                />
              </div>
              <div className="flex-[1] min-w-0">
                <TimePicker
                  value={exitTime}
                  onChange={(val) => { setExitDate(`${exitDay}T${val}`); setErrorMsg(null); }}
                  minTime={laterTime(
                    getMinTimeForDate(exitDay),
                    entryDay === exitDay ? addOneMinute(entryTime) : undefined,
                  )}
                  disabledTimes={isExitTimeDisabled}
                  className="w-full h-10 md:h-12"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Button
        onClick={handleBooking}
        disabled={isBookingDisabled}
        className={cn(
          'w-full h-11 md:h-12 mb-4 shadow-lg transition-all',
          isBookingDisabled
            ? 'bg-muted border border-foreground/20 text-foreground cursor-not-allowed'
            : 'bg-accent hover:bg-accent/90 text-white shadow-accent/20',
        )}
      >
        Reservar ahora
      </Button>

      <div className="border-t border-border pt-4 space-y-2.5 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Mínimo 2 horas de reserva</span>
          <span className="font-medium text-xs bg-muted px-2 py-0.5 rounded">Obligatorio</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Estimación base ({validDuration.toFixed(1)}h)</span>
          <span className="font-semibold">{(parking.base_price_per_hour * validDuration).toFixed(2)}€</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Tarifa de servicio</span>
          <span className="font-semibold">1.50€</span>
        </div>
        <div className="border-t border-border pt-4 flex items-center justify-between">
          <span className="text-lg font-bold">Total</span>
          <span className="text-2xl font-extrabold text-primary">
            {((parking.base_price_per_hour * validDuration) + 1.5).toFixed(2)}€
          </span>
        </div>
      </div>

      {!isMobile && (
        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground/70">
          <Shield className="h-3.5 w-3.5 text-secondary shrink-0" />
          <span>Protección de reserva incluida</span>
        </div>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <>
        {/* Sticky Mobile CTA */}
        <div
          className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border flex items-center justify-between z-40 gap-4 transition-transform shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.08)]"
          style={{ padding: '1rem', paddingBottom: 'calc(env(safe-area-inset-bottom) + 1rem)' }}
        >
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-primary">{parking.base_price_per_hour}€</span>
              <span className="text-sm text-muted-foreground">/ h</span>
            </div>
          </div>
          <Button
            className="flex-1 h-14 text-[16px] bg-accent hover:bg-accent/90 text-white rounded-xl font-bold shadow-lg shadow-accent/20"
            onClick={() => setIsDrawerOpen(true)}
          >
            Reservar
          </Button>
        </div>

        {/* Mobile Booking Drawer */}
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerContent>
            <DrawerHeader className="border-b border-border mb-4">
              <DrawerTitle>Detalles de la reserva</DrawerTitle>
            </DrawerHeader>
            <div className="px-6 pb-10 overflow-y-auto max-h-[70vh]">
              {BookingForm}
            </div>
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  return (
    <Card className="p-6 sticky top-24 shadow-xl border-border/50">
      {BookingForm}
    </Card>
  );
}
