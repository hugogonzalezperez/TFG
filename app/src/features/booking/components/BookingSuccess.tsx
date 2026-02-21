import { useNavigate } from 'react-router-dom';
import { Card, Button } from '../../../ui';
import { Check, MapPin, Calendar, CreditCard, AlertCircle } from 'lucide-react';

interface BookingSuccessProps {
  parking: {
    name: string;
    location?: string;
    city?: string;
  };
  bookingDates: {
    start: Date;
    end: Date;
  };
  totalPrice: number;
}

export function BookingSuccess({ parking, bookingDates, totalPrice }: BookingSuccessProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/10 to-primary/10 flex items-center justify-center p-4">
      <Card className="max-w-xl w-full p-8 text-center shadow-xl">
        <div className="bg-secondary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="h-10 w-10 text-secondary" />
        </div>
        <h1 className="text-3xl font-bold mb-4">¡Reserva confirmada!</h1>
        <p className="text-muted-foreground mb-8">
          Tu reserva ha sido procesada con éxito. Hemos enviado los detalles a tu correo.
        </p>

        <Card className="p-6 bg-muted/50 mb-6 text-left border-none">
          <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">
            Detalles de la reserva
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold">{parking.name}</p>
                <p className="text-sm text-muted-foreground">
                  {parking.location}, {parking.city}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold">
                  {bookingDates.start.toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
                <p className="text-sm text-muted-foreground">
                  {bookingDates.start.toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}{' '}
                  -{' '}
                  {bookingDates.end.toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 pt-2 border-t border-border/50">
              <div className="bg-primary/10 p-2 rounded-lg">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total pagado</p>
                <p className="text-2xl font-bold text-primary">{totalPrice.toFixed(2)}€</p>
              </div>
            </div>
          </div>
        </Card>

        <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 mb-8 flex items-start gap-3 text-left">
          <AlertCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-bold text-accent mb-1">Código de acceso</p>
            <p className="text-muted-foreground">
              Recibirás el código de acceso 1 hora antes de que comience tu reserva.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" onClick={() => navigate('/profile')} className="flex-1 h-12">
            Mis reservas
          </Button>
          <Button onClick={() => navigate('/')} className="flex-1 h-12 bg-primary hover:bg-primary/90">
            Volver al inicio
          </Button>
        </div>
      </Card>
    </div>
  );
}
