import { Crown, CalendarCheck, Clock } from 'lucide-react';
import { Card, Avatar } from '../../../../ui';
import { useSpotBookingsRich, RichBooking } from '../../../booking/hooks/useSpotBookings';

interface ParkingOwnerPanelProps {
  spotId: string;
  spotName: string;
}

const STATUS_STYLES: Record<string, { label: string; pill: string; dot: string }> = {
  confirmed: { label: 'Confirmada', pill: 'bg-blue-50 text-blue-700 border-blue-200',   dot: 'bg-blue-500' },
  active:    { label: 'Activa',     pill: 'bg-green-50 text-green-700 border-green-200', dot: 'bg-green-500' },
  pending:   { label: 'Pendiente',  pill: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
};

function formatRange(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  const day = s.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  const sh  = s.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  const eh  = e.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  return { day, range: `${sh} – ${eh}` };
}

function BookingRow({ b }: { b: RichBooking }) {
  const st = STATUS_STYLES[b.status] ?? { label: b.status, pill: 'bg-muted text-muted-foreground border-border', dot: 'bg-muted-foreground' };
  const { day, range } = formatRange(b.start_time, b.end_time);
  const name = b.renter?.name || 'Usuario Parky';
  const avatar = b.renter?.avatar_url;

  return (
    <div className="flex items-start gap-3 p-3 rounded-xl border border-border/60 bg-card hover:bg-muted/20 transition-colors group">
      {/* Avatar */}
      <Avatar className="h-9 w-9 shrink-0 border border-border shadow-sm">
        {avatar
          ? <img src={avatar} alt={name} className="object-cover" loading="lazy" />
          : <span className="flex h-full w-full items-center justify-center bg-primary/10 text-primary font-bold text-sm">
              {name.charAt(0).toUpperCase()}
            </span>
        }
      </Avatar>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <p className="font-semibold text-sm text-foreground truncate">{name}</p>
          <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border ${st.pill}`}>
            {st.label}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-medium">{day}</span>
          <span className="opacity-40">·</span>
          <span>{range}</span>
        </div>
        <div className="flex items-center gap-3 mt-1.5 text-xs">
          <span className="font-semibold text-primary">{b.total_price.toFixed(2)}€</span>
          <span className="text-muted-foreground">{b.total_hours}h</span>
        </div>
      </div>
    </div>
  );
}

export function ParkingOwnerPanel({ spotId, spotName }: ParkingOwnerPanelProps) {
  const { data: bookings = [], isLoading } = useSpotBookingsRich(spotId);

  const MAX = 5;
  const upcoming = bookings.slice(0, MAX);

  return (
    <Card className="p-6 sticky top-24 shadow-xl border-border/50 space-y-5">
      {/* Owner badge */}
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="p-2.5 rounded-xl bg-primary/10">
          <Crown className="h-5 w-5 text-primary" />
        </div>
        <div className="min-w-0">
          <p className="font-bold text-base leading-tight">Tu plaza</p>
          <p className="text-sm text-muted-foreground truncate">{spotName}</p>
        </div>
      </div>

      {/* Section header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarCheck className="h-4 w-4 text-primary" />
          <span className="font-semibold text-sm">Próximas reservas</span>
        </div>
        {/* {!isLoading && upcoming.length > 0 && (
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full font-medium">
            {upcoming.length} de máx. {MAX}
          </span>
        )} */}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map(i => <div key={i} className="h-20 rounded-xl bg-muted animate-pulse" />)}
        </div>
      ) : upcoming.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center gap-3">
          <div className="p-3 rounded-full bg-muted">
            <Clock className="h-6 w-6 text-muted-foreground opacity-60" />
          </div>
          <p className="text-sm text-muted-foreground">Sin reservas próximas</p>
        </div>
      ) : (
        <div className="space-y-2">
          {upcoming.map(b => <BookingRow key={b.id} b={b} />)}
        </div>
      )}
    </Card>
  );
}
