import { Card, Badge, Button } from '../ui';
import { MapPin, Calendar, Clock, Star } from 'lucide-react';

interface BookingCardProps {
  booking: {
    id: number;
    parkingName: string;
    location: string;
    date: string;
    startTime: string;
    endTime: string;
    price: number;
    status: 'confirmed' | 'completed' | 'pending' | 'cancelled';
    image?: string;
    rated?: boolean;
    rating?: number;
  };
  type?: 'active' | 'past';
  onViewDetails?: () => void;
  onCancel?: () => void;
  onRate?: () => void;
}

export function BookingCard({ booking, type = 'active', onViewDetails, onCancel, onRate }: BookingCardProps) {
  const statusConfig = {
    confirmed: { label: 'Confirmada', className: 'bg-secondary/10 text-secondary' },
    completed: { label: 'Completada', className: 'bg-muted text-muted-foreground' },
    pending: { label: 'Pendiente', className: 'bg-accent/10 text-accent' },
    cancelled: { label: 'Cancelada', className: 'bg-destructive/10 text-destructive' },
  };

  const status = statusConfig[booking.status];

  return (
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <div className="flex gap-4">
        {booking.image && (
          <img
            src={booking.image}
            alt={booking.parkingName}
            className="w-24 h-24 object-cover rounded-lg"
          />
        )}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold mb-1">{booking.parkingName}</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {booking.location}
              </p>
            </div>
            <Badge className={status.className}>{status.label}</Badge>
          </div>

          <div className="space-y-1 text-sm text-muted-foreground mb-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date(booking.date).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>
                {booking.startTime} - {booking.endTime}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-primary">{booking.price.toFixed(2)}€</span>
            <div className="flex gap-2">
              {type === 'active' && onViewDetails && (
                <Button variant="outline" size="sm" onClick={onViewDetails}>
                  Ver detalles
                </Button>
              )}
              {type === 'active' && onCancel && booking.status === 'confirmed' && (
                <Button variant="outline" size="sm" onClick={onCancel}>
                  Cancelar
                </Button>
              )}
              {type === 'past' && !booking.rated && onRate && (
                <Button variant="outline" size="sm" onClick={onRate}>
                  Valorar
                </Button>
              )}
            </div>
          </div>

          {type === 'past' && booking.rated && booking.rating && (
            <div className="flex items-center gap-2 text-sm mt-2">
              <span className="text-muted-foreground">Tu valoración:</span>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < booking.rating! ? 'fill-accent text-accent' : 'text-muted-foreground'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
