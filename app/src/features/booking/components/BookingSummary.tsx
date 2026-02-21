import { Calendar, Clock, Shield, Check, Lock, Zap } from 'lucide-react';
import { Card, Badge } from '../../../ui';
import { BookingEstimation } from '../types/booking.types';

interface BookingSummaryProps {
  parking: {
    name: string;
    location?: string;
    base_price_per_hour: number;
  };
  estimation: BookingEstimation | null;
  bookingDates: {
    start: Date;
    end: Date;
  };
}

export function BookingSummary({ parking, estimation, bookingDates }: BookingSummaryProps) {
  return (
    <Card className="p-6 sticky top-4">
      <h3 className="font-semibold mb-4">Resumen de reserva</h3>

      <div className="border border-border rounded-lg p-4 mb-4">
        <div className="flex gap-3 mb-3">
          <div className="w-20 h-20 bg-muted rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1619335680796-54f13b88c6ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJraW5nJTIwZ2FyYWdlJTIwbW9kZXJufGVufDF8fHx8MTc2NzY0NTU0M3ww&ixlib=rb-4.1.0&q=80&w=400"
              alt={parking.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold mb-1 truncate">{parking.name}</h4>
            <p className="text-sm text-muted-foreground truncate">{parking.location}</p>
          </div>
        </div>
        <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/20">
          Verificado
        </Badge>
      </div>

      <div className="space-y-3 text-sm border-b border-border pb-4 mb-4">
        <div className="flex items-start gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
          <div className="flex-1">
            <p className="font-medium">Fecha</p>
            <p className="text-muted-foreground">
              {bookingDates.start.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
          <div className="flex-1">
            <p className="font-medium">Horario</p>
            <p className="text-muted-foreground">
              {bookingDates.start.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} - {bookingDates.end.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} ({estimation?.hours}h)
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3 text-sm mb-4">
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            {parking.base_price_per_hour}€ x {estimation?.hours || 0} horas
          </span>
          <span>{(parking.base_price_per_hour * (estimation?.hours || 0)).toFixed(2)}€</span>
        </div>

        {estimation && estimation.multiplier_applied > 1 && (
          <div className="flex justify-between text-secondary">
            <span className="flex items-center gap-1 font-medium">
              <Zap className="h-3 w-3" />
              Tarifa dinámica ({((estimation.multiplier_applied - 1) * 100).toFixed(0)}%)
            </span>
            <span>{(estimation.total_price - (parking.base_price_per_hour * (estimation.hours || 0)) - 1.5).toFixed(2)}€</span>
          </div>
        )}

        <div className="flex justify-between">
          <span className="text-muted-foreground">Tarifa de servicio</span>
          <span>1.50€</span>
        </div>
      </div>

      <div className="border-t border-border pt-4 flex justify-between items-center">
        <span className="font-semibold text-lg">Total</span>
        <span className="text-2xl font-bold text-primary">
          {estimation?.total_price.toFixed(2)}€
        </span>
      </div>

      <div className="mt-6 pt-6 border-t border-border space-y-3">
        <div className="flex items-start gap-2 text-sm text-muted-foreground px-2">
          <Shield className="h-4 w-4 mt-0.5 text-secondary flex-shrink-0" />
          <span>Cancelación gratis hasta 24h antes</span>
        </div>
        <div className="flex items-start gap-2 text-sm text-muted-foreground px-2">
          <Check className="h-4 w-4 mt-0.5 text-secondary flex-shrink-0" />
          <span>Confirmación instantánea</span>
        </div>
        <div className="flex items-start gap-2 text-sm text-muted-foreground px-2">
          <Lock className="h-4 w-4 mt-0.5 text-secondary flex-shrink-0" />
          <span>Pago seguro SSL</span>
        </div>
      </div>
    </Card>
  );
}
