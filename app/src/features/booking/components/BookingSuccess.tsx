import { useNavigate } from 'react-router-dom';
import { Card, Button } from '../../../ui';
import { Check, MapPin, Calendar, CreditCard, AlertCircle } from 'lucide-react';

interface BookingSuccessProps {
  parking: {
    name: string;
    address?: string;
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
    <div className="min-h-screen bg-gradient-to-br from-secondary/10 to-primary/10 flex items-center justify-center p-0 sm:p-4">
      <Card className="max-w-xl w-full sm:rounded-2xl rounded-none min-h-screen sm:min-h-0 border-none sm:border-solid p-5 sm:p-8 text-center shadow-none sm:shadow-xl flex flex-col justify-center">
        <div className="bg-secondary/10 w-20 h-20 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <Check className="h-12 w-12 sm:h-8 sm:w-8 text-secondary" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">¡Reserva confirmada!</h1>
        <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 leading-tight">
          Tu reserva ha sido procesada con éxito. Hemos enviado los detalles a tu correo.
        </p>

        <Card className="p-4 sm:p-5 bg-muted/50 mb-4 text-left border-none">
          <h3 className="font-semibold mb-3 text-xs sm:text-sm uppercase tracking-wider text-muted-foreground">
            Detalles de la reserva
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold">{parking.name}</p>
                <p className="text-sm text-muted-foreground">
                  {parking.address}{parking.city ? `, ${parking.city}` : ''}
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

        <div className="bg-accent/10 border border-accent/20 rounded-xl p-3 sm:p-4 mb-6 flex items-start gap-3 text-left">
          <AlertCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-bold text-accent mb-0.5">Acceso al garaje</p>
            <p className="text-muted-foreground leading-tight">
              Podrás abrir la puerta desde "Mis reservas" usando el botón de abrir.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
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
