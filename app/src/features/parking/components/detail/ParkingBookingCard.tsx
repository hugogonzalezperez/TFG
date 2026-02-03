import { Clock, Zap, Shield } from 'lucide-react';
import { Card, Button } from '../../../../ui';
import { useNavigate } from 'react-router-dom';
import { Parking } from '../../types/parking.types';

interface ParkingBookingCardProps {
  parking: Parking;
}

export function ParkingBookingCard({ parking }: ParkingBookingCardProps) {
  const navigate = useNavigate();

  return (
    <Card className="p-6 sticky top-24 shadow-xl">
      <div className="mb-6">
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-4xl font-bold text-primary">{parking.base_price_per_hour}€</span>
          <span className="text-muted-foreground">/hora</span>
        </div>
        <p className="text-sm text-muted-foreground text-secondary">
          <Zap className="h-3 w-3 inline mr-1" />
          Precio dinámico disponible
        </p>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="text-sm font-medium mb-2 flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            Entrada (Mínimo 2h)
          </label>
          <input
            type="datetime-local"
            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            Salida
          </label>
          <input
            type="datetime-local"
            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <Button
        onClick={() => navigate(`/book/${parking.id}`, { state: parking })}
        className="w-full h-12 bg-accent hover:bg-accent/90 text-white mb-4"
      >
        Reservar ahora
      </Button>

      <div className="border-t border-border pt-4 space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Estimación base (4h)</span>
          <span className="font-semibold">{(parking.base_price_per_hour * 4).toFixed(2)}€</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Tarifa de servicio</span>
          <span className="font-semibold">1.50€</span>
        </div>
        <div className="border-t border-border pt-3 flex justify-between text-base">
          <span className="font-semibold">Total estimado</span>
          <span className="font-bold text-primary">
            {((parking.base_price_per_hour * 4) + 1.5).toFixed(2)}€
          </span>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Shield className="h-5 w-5 text-secondary" />
          <span>Protección de reserva incluida</span>
        </div>
      </div>
    </Card>
  );
}
