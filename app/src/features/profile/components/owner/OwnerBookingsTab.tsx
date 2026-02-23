import { Calendar, Clock, Euro, Mail, MessageSquare, Trash2, MapPin, Car } from 'lucide-react';
import { Card, Button, Avatar, AvatarImage, AvatarFallback, Badge } from '../../../../ui';
import { cn } from '../../../../shared/lib/cn';
import { TabSkeletonLoader } from '../shared/ProfileSkeletonLoaders';

interface OwnerBookingsTabProps {
  bookings: any[];
  isLoading: boolean;
  onCancel?: (bookingId: string) => void;
}

const BookingCard = ({ booking, onCancel }: { booking: any, onCancel?: (id: string) => void }) => {
  // Database status mapping - Strictly following user requirement
  // confirmed -> "Confirmada" (Blue)
  // active -> "Activa ahora" (Green)
  // completed -> "Completada" (Gray)
  // cancelled -> "Cancelada" (Red)

  const statusLabels: Record<string, string> = {
    confirmed: 'Confirmada',
    active: 'Activa ahora',
    completed: 'Completada',
    cancelled: 'Cancelada'
  };

  const statusColors: Record<string, string> = {
    confirmed: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    active: "bg-green-500/10 text-green-600 border-green-500/20",
    completed: "bg-muted text-muted-foreground border-border",
    cancelled: "bg-red-500/10 text-red-600 border-red-500/20"
  };

  const status = booking.status || 'confirmed';
  const label = statusLabels[status] || status;
  const colorClass = statusColors[status] || "bg-muted text-muted-foreground border-border";

  const isActiveOrConfirmed = status === 'active' || status === 'confirmed';

  // Time labels for display
  const startTime = new Date(booking.start_time);
  const endTime = new Date(booking.end_time);

  return (
    <Card className={cn(
      "overflow-hidden transition-all hover:shadow-md border-border/50 bg-card",
      status === 'active' && "ring-2 ring-primary/20 bg-primary/[0.02]"
    )}>
      {/* 4-Column Layout on Desktop, Optimized Stacking on Mobile */}
      <div className="flex flex-col md:grid md:grid-cols-4 items-stretch md:items-center p-4 gap-4 md:gap-6">

        {/* Row 1/Col 1: Identity & Status (Mobile Header) */}
        <div className="flex items-center justify-between md:justify-start gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar className="h-9 w-9 md:h-10 md:w-10 border border-primary/10 shrink-0">
              <AvatarImage src={booking.renter?.avatar_url} alt={booking.renter?.name} />
              <AvatarFallback className="bg-secondary text-xs">
                {booking.renter?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-sm leading-tight truncate">
                {booking.renter?.name || 'Usuario Parky'}
              </span>
              <span className="text-[10px] md:text-[11px] text-muted-foreground font-medium flex items-center gap-1 mt-0.5 truncate uppercase tracking-tighter sm:tracking-normal">
                <Mail className="h-3 w-3 shrink-0" />
                {booking.renter?.email || 'email no disponible'}
              </span>
            </div>
          </div>

          {/* Status Badge - Fixed for mobile visibility */}
          <div className={cn(
            "md:hidden px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border shrink-0",
            colorClass
          )}>
            {label}
          </div>
        </div>

        {/* Row 2/Col 2: Parking & Vehicle */}
        <div className="grid grid-cols-2 md:block gap-3 md:space-y-2">
          <div className="flex items-center gap-2 bg-muted/40 px-2.5 py-1.5 rounded-lg border border-border/50 col-span-2 md:col-span-1">
            <MapPin className="h-5 w-5 md:h-6 md:w-6 text-primary shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-[13px] md:text-[14px] leading-none truncate">{booking.spot?.garage?.name}</span>
              <span className="text-[11px] md:text-[12px] text-primary/80 font-mono mt-0.5">Plaza {booking.spot?.spot_number}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 px-1 md:px-3.5 mt-1 md:mt-0">
            <Car className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground shrink-0" />
            <span className="text-[10px] md:text-[11px] font-mono font-bold text-background bg-foreground px-2 md:px-3 py-0.5 rounded border border-border/50">
              {booking.vehicle_plate || 'S/N'}
            </span>
          </div>
        </div>

        {/* Row 3/Col 3: Date & Time */}
        <div className="flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-1.5 py-3 md:py-0 border-y md:border-y-0 md:pl-8 border-border/30">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary/70 shrink-0" />
            <span className="font-bold md:font-semibold text-foreground text-[13px] md:text-[14px] whitespace-nowrap">
              {startTime.toLocaleDateString('es-ES', {
                day: 'numeric', month: 'short'
              })}
              <span className="hidden md:inline"> {startTime.getFullYear()}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary/70 shrink-0" />
            <span className="font-bold text-foreground text-[11px] md:text-[12px] bg-muted/60 md:bg-muted/30 px-2 py-0.5 rounded whitespace-nowrap">
              {startTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
              <span className="mx-1 text-muted-foreground">-</span>
              {endTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        {/* Col 4: Price, (Status on Desktop) & Actions */}
        <div className="flex flex-col gap-3 md:pl-4 md:border-l md:border-border/30 pt-1 md:pt-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Euro className="h-3.5 w-3.5 text-primary" />
              <span className="text-base md:text-lg font-black text-foreground">
                {Number(booking.total_price).toFixed(2)}€
              </span>
            </div>

            <div className={cn(
              "hidden md:block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider h-fit border",
              colorClass
            )}>
              {label}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 h-9 md:h-8 text-[11px] font-bold gap-1.5 hover:bg-muted"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Contactar
            </Button>
            {isActiveOrConfirmed && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onCancel?.(booking.id)}
                className="flex-1 h-9 md:h-8 text-[11px] text-destructive hover:bg-destructive/5 hover:text-destructive border-border/50 font-bold gap-1.5"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Cancelar
              </Button>
            )}
          </div>
        </div>

      </div>
    </Card>
  );
};

export function OwnerBookingsTab({ bookings, isLoading, onCancel }: OwnerBookingsTabProps) {
  if (isLoading) {
    return <TabSkeletonLoader />;
  }

  // Grouping logic strictly by status:
  // confirmed, active -> Current/Upcoming
  // completed, cancelled -> Past/History

  const currentBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'active')
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

  const pastBookings = bookings.filter(b => b.status === 'completed' || b.status === 'cancelled')
    .sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime());

  // Handle statuses that might not be in the mapping (unexpected ones go to history)
  const otherBookings = bookings.filter(b => !['confirmed', 'active', 'completed', 'cancelled'].includes(b.status))
    .sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime());

  const allPastBookings = [...pastBookings, ...otherBookings];

  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-card rounded-2xl border border-border border-dashed">
        <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Calendar className="h-8 w-8 text-primary opacity-40" />
        </div>
        <h3 className="text-xl font-bold mb-2">No hay reservas registradas</h3>
        <p className="text-muted-foreground max-w-sm">
          Aún no has recibido ninguna reserva en tus plazas. Asegúrate de que tus garajes estén activos y tengan fotos atractivas.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Current/Upcoming Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <h2 className="text-lg font-bold flex items-center gap-2">
            Reservas Actuales y Próximas
            <Badge variant="default" className="rounded-full px-2 py-0 text-[15px]">
              {currentBookings.length}
            </Badge>
          </h2>
        </div>

        {currentBookings.length > 0 ? (
          <div className="grid gap-3">
            {currentBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} onCancel={onCancel} />
            ))}
          </div>
        ) : (
          <div className="py-8 px-4 text-center bg-muted/5 rounded-xl border border-border border-dashed">
            <p className="text-sm text-muted-foreground">No tienes reservas activas ni próximas.</p>
          </div>
        )}
      </section>

      {/* Past Section */}
      {allPastBookings.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              Historial de Reservas
              <Badge variant="outline" className="rounded-full px-2 py-0 text-[12px] opacity-80">
                {allPastBookings.length}
              </Badge>
            </h2>
          </div>

          <div className="grid gap-3 opacity-80 hover:opacity-100 transition-opacity">
            {allPastBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
