import { useState } from 'react';
import { Calendar, MapPin, Clock, Star } from 'lucide-react';
import { Card, Badge, Button } from '../../../../ui';
import { useNavigate } from 'react-router-dom';

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

  const activeBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'active' || b.status === 'pending');
  const pastBookings = bookings.filter(b => b.status === 'completed' || b.status === 'cancelled');

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
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Reservas activas</h2>
        {activeBookings.length > 0 ? (
          <div className="space-y-4">
            {activeBookings.map((booking) => (
              <Card key={booking.id} className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <img
                    src={booking.image || 'https://images.unsplash.com/photo-1619335680796-54f13b88c6ba?q=80&w=400'}
                    alt={booking.parkingName}
                    className="w-full sm:w-32 h-32 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{booking.parkingName}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {booking.location}
                        </p>
                      </div>
                      <Badge className={getStatusColor(booking.status)}>
                        {getStatusLabel(booking.status)}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(booking.start_time).toLocaleDateString('es-ES', { dateStyle: 'long' })}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>
                          {new Date(booking.start_time).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} - {new Date(booking.end_time).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">
                        {Number(booking.total_price).toFixed(2)}€
                      </span>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => navigate(`/parking/${booking.parking_spot_id}`)}>
                          Ver plaza
                        </Button>
                        <Button
                          className="bg-destructive/5 text-destructive border-destructive/20 hover:bg-destructive/10"
                          onClick={() => handleCancel(booking.id)}
                          disabled={cancellingId === booking.id || booking.status === 'active'}
                        >
                          {cancellingId === booking.id ? 'Cancelando...' : 'Cancelar'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No tienes reservas activas</p>
            <Button onClick={() => navigate('/map')} className="mt-4 bg-primary hover:bg-primary/90">
              Buscar aparcamiento
            </Button>
          </Card>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Historial de reservas</h2>
        <div className="space-y-4">
          {pastBookings.map((booking) => (
            <Card key={booking.id} className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold mb-1">{booking.parkingName}</h3>
                  <p className="text-sm text-muted-foreground">{booking.location}</p>
                </div>
                <Badge variant="outline" className={booking.status === 'completed' ? 'text-grey-600 bg-grey-50' : 'text-red-600 bg-red-50'}>
                  {getStatusLabel(booking.status)}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <span>{new Date(booking.start_time).toLocaleDateString('es-ES')}</span>
                <span>•</span>
                <span>{Number(booking.total_price).toFixed(2)}€</span>
              </div>
              {!booking.rated && booking.status === 'completed' && (
                <Button variant="outline" size="sm" className="gap-2" onClick={() => onReview?.(booking)}>
                  <Star className="h-4 w-4" />
                  Valorar reserva
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:bg-destructive/10 -ml-2 sm:ml-2 mt-2 sm:mt-0"
                onClick={() => handleDelete(booking.id)}
                disabled={deletingId === booking.id}
              >
                {deletingId === booking.id ? 'Borrando...' : 'Eliminar'}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
