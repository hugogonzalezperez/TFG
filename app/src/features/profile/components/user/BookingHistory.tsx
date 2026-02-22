import { useState, useMemo } from 'react';
import { Calendar, MapPin, Clock, Star, History, Trash2, Car, Building2 } from 'lucide-react';
import { Card, Badge, Button } from '../../../../ui';
import { useNavigate } from 'react-router-dom';
import { BookingTimeline, CalendarGarage } from '../../../../shared/components/calendar/BookingTimeline';
import { LocationLink } from '../../../../shared/components/LocationLink';
import { cn } from '../../../../shared/lib/cn';

interface BookingHistoryProps {
  bookings: any[];
  isLoading: boolean;
  onCancel?: (bookingId: string) => Promise<void>;
  onDelete?: (bookingId: string) => Promise<void>;
  onReview?: (booking: any) => void;
}

export function BookingHistory({ bookings, isLoading, onCancel, onDelete, onReview }: BookingHistoryProps) {
  const navigate = useNavigate();
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [viewDate, setViewDate] = useState(new Date());

  const activeBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'active' || b.status === 'pending');
  const pastBookings = bookings.filter(b => b.status === 'completed' || b.status === 'cancelled');

  const timelineData = useMemo(() => {
    // Group active bookings by garage for the timeline
    const garagesMap = new Map<string, CalendarGarage>();

    activeBookings.forEach(b => {
      const garageId = b.garage_id || 'unknown';
      const garageName = b.parkingName?.split(' - ')[0] || 'Garaje';

      if (!garagesMap.has(garageId)) {
        garagesMap.set(garageId, {
          id: garageId,
          name: garageName,
          spots: []
        });
      }

      const garage = garagesMap.get(garageId)!;
      const spotName = b.parkingName?.split(' - ')[1] || 'Plaza';

      // For user view, we'll just put all their bookings for that garage in "their" row
      let spot = garage.spots.find(s => s.name === spotName);
      if (!spot) {
        spot = { id: b.parking_spot_id, name: spotName, bookings: [] };
        garage.spots.push(spot);
      }

      spot.bookings.push({
        id: b.id,
        startTime: b.start_time,
        endTime: b.end_time,
        title: 'Tu reserva',
        status: b.status
      });
    });

    return Array.from(garagesMap.values());
  }, [activeBookings]);

  if (isLoading) return <div className="space-y-4">
    {[1, 2].map(i => <Card key={i} className="p-6 h-40 animate-pulse bg-muted/50" />)}
  </div>;

  const handleCancel = async (id: string) => {
    setCancellingId(id);
    try {
      if (onCancel) await onCancel(id);
    } finally {
      setCancellingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      if (onDelete) await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'confirmed': return 'Confirmada';
      case 'active': return 'Activa';
      case 'completed': return 'Completada';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/10 text-yellow-600 border-yellow-200';
      case 'confirmed': return 'bg-green-500/10 text-green-600 border-green-200';
      case 'active': return 'bg-blue-500/10 text-blue-600 border-blue-200';
      default: return 'bg-secondary text-white';
    }
  };

  return (
    <div className="space-y-12 py-5">
      {/* Detailed Active Bookings */}
      <section className="mb-4">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
          Detalle de reservas activas
          <Badge variant="outline" className="rounded-full px-2.5 py-0.5">{activeBookings.length}</Badge>
        </h2>

        <div className="h-2"></div>

        {activeBookings.length > 0 ? (
          <Card className="overflow-hidden border-border/50">
            <div className="divide-y divide-border">
              {/* Header row */}
              <div className="hidden md:grid grid-cols-12 gap-2 px-5 py-4 bg-muted/20 text-[11px] font-bold text-muted-foreground uppercase tracking-wider items-center">
                <div className="col-span-4">Ubicación y Plaza</div>
                <div className="col-span-3 text-center">Fechas y Horas</div>
                <div className="col-span-1 text-center">Importe</div>
                <div className="col-span-2 text-center">Estado</div>
                <div className="col-span-2 text-right pr-5">Acción</div>
              </div>
              {activeBookings.map((booking) => {
                const startDate = new Date(booking.start_time);
                const endDate = new Date(booking.end_time);
                return (
                  <div key={booking.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 px-5 py-3 items-center hover:bg-muted/5 transition-colors">
                    {/* Garage & Spot Info */}
                    <div className="col-span-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center text-primary flex-shrink-0 cursor-pointer hover:bg-primary/10 transition-colors"
                        onClick={() => navigate(`/parking/${booking.parking_spot_id}`)}>
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4
                          className="font-bold text-sm truncate cursor-pointer hover:text-primary transition-colors"
                          title={booking.parkingName}
                          onClick={() => navigate(`/parking/${booking.parking_spot_id}`)}
                        >
                          {booking.parkingName?.split(' - ')[0] || booking.parkingName}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="text-[10px] text-muted-foreground font-mono bg-muted/50 px-1.5 py-0.5 rounded shrink-0">
                            {booking.spotNumber || 'N/A'}
                          </p>
                          <LocationLink
                            address={booking.location?.split(',')[0] || ''}
                            className="text-[10px] [&>svg]:h-3 [&>svg]:w-3"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="col-span-3 text-center">
                      <p className="text-sm font-semibold text-foreground">
                        {startDate.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })} — {endDate.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {startDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} - {endDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    {/* Amount */}
                    <div className="col-span-1 text-center">
                      <p className="text-base font-bold text-foreground">
                        {Number(booking.total_price).toFixed(2)}<span className="text-xs">€</span>
                      </p>
                    </div>

                    {/* Status */}
                    <div className="col-span-2 flex justify-center">
                      <Badge className={cn("text-[10px] px-2 py-0.5 h-auto leading-none uppercase font-bold", getStatusColor(booking.status))} variant="outline">
                        {getStatusLabel(booking.status)}
                      </Badge>
                    </div>

                    {/* Actions */}
                    <div className="col-span-2 flex justify-end gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs px-2.5"
                        onClick={() => navigate(`/parking/${booking.parking_spot_id}`)}
                      >
                        Ver
                      </Button>
                      <Button
                        variant="exit"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:opacity-50"
                        onClick={() => handleCancel(booking.id)}
                        disabled={cancellingId === booking.id || booking.status === 'active'}
                      >
                        {cancellingId === booking.id ? '...' : <Trash2 className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        ) : (
          <div className="py-12 text-center text-muted-foreground">
            <p>No hay reservas activas en este momento.</p>
          </div>
        )}
      </section>

      {/* History */}
      <section className="mt-8">
        <div className="flex items-center gap-2 mb-4">
          <History className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-bold">Historial de reservas</h2>
        </div>

        <div className="space-y-3">
          {pastBookings.length > 0 ? (
            pastBookings.map((booking) => (
              <Card key={booking.id} className="p-4 border border-border/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded bg-muted flex items-center justify-center text-muted-foreground">
                      <Clock className="h-6 w-6 opacity-20" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{booking.parkingName}</h3>
                      <div className="flex items-center gap-3 mt-1 text-[11px] text-muted-foreground">
                        <span>{new Date(booking.start_time).toLocaleDateString('es-ES')}</span>
                        <span>•</span>
                        <span className="font-bold">{Number(booking.total_price).toFixed(2)}€</span>
                        <span>•</span>
                        <Badge variant="outline" className="h-4 text-[9px] uppercase">
                          {getStatusLabel(booking.status)}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {!booking.rated && booking.status === 'completed' && (
                      <Button variant="outline" size="sm" className="h-8 text-xs gap-1" onClick={() => onReview?.(booking)}>
                        <Star className="h-3 w-3" />
                        Valorar
                      </Button>
                    )}
                    <Button
                      variant="exit"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:opacity-50"
                      onClick={() => handleDelete(booking.id)}
                      disabled={deletingId === booking.id}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <p className="text-center py-8 text-muted-foreground text-sm italic">
              No tienes reservas pasadas.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
