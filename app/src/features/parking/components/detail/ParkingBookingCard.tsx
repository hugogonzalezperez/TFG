import { useState, useMemo } from 'react';
import { Clock, Shield, AlertTriangle, Star } from 'lucide-react';
import {
  Card,
  Button,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  DatePicker,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '../../../../ui';
import { useNavigate } from 'react-router-dom';
import { Parking } from '../../types/parking.types';
import { useSpotBookings } from '../../../booking/hooks/useSpotBookings';
import { useIsMobile } from '../../../../shared/hooks/use-mobile';
import { cn } from '../../../../shared/lib/cn';

interface ParkingBookingCardProps {
  parking: Parking;
}

const getLocalISOString = (d: Date) => {
  const pad = (num: number) => num.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export function ParkingBookingCard({ parking }: ParkingBookingCardProps) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { data: bookings = [] } = useSpotBookings(parking.id);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Initialize with current local time rounded up to nearest 15 mins
  const [entryDate, setEntryDate] = useState(() => {
    const d = new Date();
    d.setMinutes(Math.ceil(d.getMinutes() / 15) * 15);
    d.setSeconds(0);
    d.setMilliseconds(0);
    return getLocalISOString(d);
  });

  const [exitDate, setExitDate] = useState(() => {
    const d = new Date();
    d.setMinutes(Math.ceil(d.getMinutes() / 15) * 15);
    d.setSeconds(0);
    d.setMilliseconds(0);
    d.setHours(d.getHours() + 4);
    return getLocalISOString(d);
  });

  const timeOptions = useMemo(() => {
    const options = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 15) {
        const hh = h.toString().padStart(2, '0');
        const mm = m.toString().padStart(2, '0');
        options.push(`${hh}:${mm}`);
      }
    }
    return options;
  }, []);

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

    // Check overlaps
    const BUFFER_MS = 30 * 60 * 1000;
    const safeStart = new Date(start.getTime() - BUFFER_MS);
    const safeEnd = new Date(end.getTime() + BUFFER_MS);

    const hasOverlap = bookings.some(b => {
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
                      setEntryDate(`${yyyy}-${mm}-${dd}T${entryTime}`);
                      setErrorMsg(null);
                    }
                  }}
                  minDate={new Date()}
                />
              </div>
              <div className="flex-[1] min-w-0">
                <Select
                  value={entryTime}
                  onValueChange={(val) => {
                    setEntryDate(`${entryDay}T${val}`);
                    setErrorMsg(null);
                  }}
                >
                  <SelectTrigger className="w-full h-10 md:h-12">
                    <SelectValue placeholder="Hora" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map(time => (
                      <SelectItem key={`entry-${time}`} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                <Select
                  value={exitTime}
                  onValueChange={(val) => {
                    setExitDate(`${exitDay}T${val}`);
                    setErrorMsg(null);
                  }}
                >
                  <SelectTrigger className="w-full h-10 md:h-12">
                    <SelectValue placeholder="Hora" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map(time => (
                      <SelectItem key={`exit-${time}`} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Button
        onClick={handleBooking}
        className="w-full h-11 md:h-12 bg-accent hover:bg-accent/90 text-white mb-4 shadow-lg shadow-accent/20"
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
        <div className="border-t border-border pt-3 flex justify-between text-base">
          <span className="font-semibold">Total estimado</span>
          <span className="font-bold text-primary">
            {((parking.base_price_per_hour * validDuration) + 1.5).toFixed(2)}€
          </span>
        </div>
      </div>

      {!isMobile && (
        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Shield className="h-5 w-5 text-secondary" />
            <span>Protección de reserva incluida</span>
          </div>
        </div>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <>
        {/* Sticky Mobile CTA */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-card/80 backdrop-blur-lg border-t border-border flex items-center justify-between z-40 gap-4 transition-transform shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.05)]">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-primary">{parking.base_price_per_hour}€</span>
              <span className="text-xs text-muted-foreground">/ h</span>
            </div>
          </div>
          <Button
            className="flex-1 h-11 bg-accent hover:bg-accent/90 text-white rounded-xl font-bold shadow-lg shadow-accent/20"
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
