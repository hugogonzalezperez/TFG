import { useState, useMemo } from 'react';
import { Calendar, MapPin, Clock, Star, History, Trash2 } from 'lucide-react';
import { Card, Badge, Button } from '../../../../ui';
import { useNavigate } from 'react-router-dom';
import { BookingTimeline, CalendarGarage } from '../../../../shared/components/calendar/BookingTimeline';

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
      case 'active': return 'bg-green-500/10 text-green-600 border-green-200';
      default: return 'bg-secondary text-white';
    }
  };

  return (
    <div className="space-y-10">
      {/* Calendar View */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Tus próximas reservas</h2>
        </div>

        {activeBookings.length > 0 ? (
          <BookingTimeline
            data={timelineData}
            viewDate={viewDate}
            onDateChange={setViewDate}
          />
        ) : (
          <Card className="p-8 text-center border-dashed">
            <p className="text-muted-foreground">No tienes reservas pendientes para hoy.</p>
          </Card>
        )}
      </section>

      {/* Detailed Active Bookings */}
      <section>
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          Detalle de reservas activas
          <Badge variant="secondary" className="rounded-full">{activeBookings.length}</Badge>
        </h2>
        {activeBookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeBookings.map((booking) => (
              <Card key={booking.id} className="p-5 border-2 border-border/40 hover:border-primary/30 transition-all group">
                <div className="flex gap-4">
                  <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={booking.image || 'https://images.unsplash.com/photo-1619335680796-54f13b88c6ba?q=80&w=400'}
                      alt={booking.parkingName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold truncate" title={booking.parkingName}>{booking.parkingName}</h3>
                      <Badge className={getStatusColor(booking.status)} variant="outline">
                        {getStatusLabel(booking.status)}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mb-3 truncate">
                      <MapPin className="h-3 w-3" />
                      {booking.location}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground bg-muted/50 p-2 rounded-md">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(booking.start_time).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(booking.start_time).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                        -
                        {new Date(booking.end_time).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                  <span className="font-bold text-lg text-primary">
                    {Number(booking.total_price).toFixed(2)}€
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => navigate(`/parking/${booking.parking_spot_id}`)}>
                      Ver plaza
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs text-destructive hover:bg-destructive/10"
                      onClick={() => handleCancel(booking.id)}
                      disabled={cancellingId === booking.id || booking.status === 'active'}
                    >
                      {cancellingId === booking.id ? '...' : 'Cancelar'}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-muted-foreground">
            <p>No hay reservas activas en este momento.</p>
          </div>
        )}
      </section>

      {/* History */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <History className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-bold">Historial de reservas</h2>
        </div>

        <div className="space-y-3">
          {pastBookings.length > 0 ? (
            pastBookings.map((booking) => (
              <Card key={booking.id} className="p-4 border border-border/60 hover:bg-muted/10 transition-colors">
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
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive opacity-40 hover:opacity-100"
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
