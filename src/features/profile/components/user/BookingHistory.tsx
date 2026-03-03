import { useState } from 'react';
import { Clock, Star, History, Trash2, Building2, Lock, Eye } from 'lucide-react';
import { Card, Badge, Button } from '../../../../ui';
import { useNavigate } from 'react-router-dom';
import { LocationLink } from '../../../../shared/components/LocationLink';
import { cn } from '../../../../shared/lib/cn';
import { SmartAccessModal } from '../../../booking/components/SmartAccessModal';
import { BookingCardSkeleton, PastBookingCardSkeleton, EmptyState } from '../../../../ui';

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
  const [smartAccessBooking, setSmartAccessBooking] = useState<any>(null);
  const activeBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'active' || b.status === 'pending');
  const pastBookings = bookings.filter(b => b.status === 'completed' || b.status === 'cancelled');

  if (isLoading) return (
    <div className="space-y-12 py-5">
      <div className="space-y-4">
        <div className="h-8 w-64 bg-muted animate-pulse rounded-lg" />
        <BookingCardSkeleton />
      </div>
      <div className="space-y-4">
        <div className="h-8 w-64 bg-muted animate-pulse rounded-lg" />
        <PastBookingCardSkeleton />
        <PastBookingCardSkeleton />
      </div>
    </div>
  );

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
                <div className="col-span-2 text-right pr-5">Acciones</div>
              </div>
              {activeBookings.map((booking) => {
                const startDate = new Date(booking.start_time);
                const endDate = new Date(booking.end_time);
                return (
                  <div key={booking.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 px-5 py-3 items-center hover:bg-muted/5 transition-colors">
                    <div className="col-span-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center text-primary flex-shrink-0 cursor-pointer overflow-hidden group hover:opacity-80 transition-opacity"
                        onClick={() => navigate(`/parking/${booking.parking_spot_id}`)}>
                        {booking.image ? (
                          <img src={booking.image} alt={booking.parkingName} className="w-full h-full object-cover" loading="lazy" />
                        ) : (
                          <Building2 className="h-5 w-5" />
                        )}
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
                    <div className="col-span-3 text-left md:text-center mt-2 md:mt-0 flex flex-row md:flex-col items-center md:items-center justify-between md:justify-center">
                      <div className="md:w-full">
                        <p className="text-sm font-semibold text-foreground">
                          {startDate.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })} — {endDate.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          {startDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} - {endDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>

                      {/* Amount (Moved next to dates on mobile) */}
                      <div className="md:hidden text-right">
                        <p className="text-base font-bold text-foreground">
                          {Number(booking.total_price).toFixed(2)}<span className="text-xs">€</span>
                        </p>
                      </div>
                    </div>

                    {/* Amount (Desktop) */}
                    <div className="col-span-1 text-center hidden md:block">
                      <p className="text-base font-bold text-foreground">
                        {Number(booking.total_price).toFixed(2)}<span className="text-xs">€</span>
                      </p>
                    </div>

                    {/* Status (Mobile Top Right, Desktop Col-2) */}
                    <div className="col-span-2 flex md:justify-center absolute top-3 right-5 md:relative md:top-0 md:right-0">
                      <Badge className={cn("text-[10px] px-2 py-0.5 h-auto leading-none uppercase font-bold", getStatusColor(booking.status))} variant="outline">
                        {getStatusLabel(booking.status)}
                      </Badge>
                    </div>

                    {/* Actions */}
                    <div className="col-span-2 flex md:justify-end gap-2 mt-2 md:mt-0 w-full md:w-auto">
                      {booking.status === 'active' && (
                        <Button
                          variant="default"
                          size="sm"
                          className="flex-1 md:flex-none h-9 md:h-8 text-xs px-2.5 bg-blue-600 hover:bg-blue-700"
                          onClick={() => setSmartAccessBooking(booking)}
                        >
                          <Lock className="h-4 w-4 mr-1 md:mr-0" />
                          <span className="md:hidden">Abrir garaje</span>
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 md:flex-none h-9 md:h-8 text-xs px-2.5"
                        onClick={() => navigate(`/parking/${booking.parking_spot_id}`)}
                      >
                        <Eye className="h-4 w-4 mr-1 md:mr-0" />
                        <span className="md:hidden">Ver detalles</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 md:h-8 md:w-8 shrink-0 text-destructive hover:bg-destructive/10"
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
          <EmptyState
            icon={Clock}
            title="No tienes reservas activas"
            description="Tus reservas confirmadas y próximas aparecerán aquí. ¡Busca una plaza para empezar!"
            actionLabel="Buscar parking"
            onAction={() => navigate('/map')}
            className="p-8"
          />
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="w-12 h-12 rounded bg-muted flex shrink-0 items-center justify-center text-muted-foreground">
                      <Clock className="h-6 w-6 opacity-20" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-sm truncate">{booking.parkingName}</h3>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[11px] text-muted-foreground">
                        <span className="shrink-0">{new Date(booking.start_time).toLocaleDateString('es-ES')}</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="font-bold shrink-0">{Number(booking.total_price).toFixed(2)}€</span>
                        <span className="hidden sm:inline">•</span>
                        <Badge variant="outline" className="h-4 text-[9px] uppercase shrink-0 mt-1 sm:mt-0">
                          {getStatusLabel(booking.status)}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 sm:shrink-0 sm:w-auto w-full">
                    {!booking.rated && booking.status === 'completed' && (
                      <Button variant="outline" size="sm" className="h-9 sm:h-8 text-xs gap-1 flex-1 sm:flex-none" onClick={() => onReview?.(booking)}>
                        <Star className="h-3 w-3" />
                        Valorar
                      </Button>
                    )}
                    <Button
                      variant="exit"
                      size="icon"
                      className="h-9 w-9 sm:h-8 sm:w-8 shrink-0 text-destructive hover:opacity-50"
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
            <EmptyState
              icon={History}
              title="Historial vacío"
              description="Aquí aparecerán tus reservas pasadas y completadas."
              className="p-6 border-none bg-transparent"
            />
          )}
        </div>
      </section>

      {smartAccessBooking && (
        <SmartAccessModal
          booking={smartAccessBooking}
          onClose={() => setSmartAccessBooking(null)}
        />
      )}
    </div>
  );
}
