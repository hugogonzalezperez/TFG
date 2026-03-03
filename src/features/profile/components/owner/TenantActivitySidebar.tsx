import { Calendar, Clock, Euro, CheckCircle } from 'lucide-react';
import { Card, Button } from '../../../../ui';

interface TenantActivitySidebarProps {
  bookings: any[];
  isLoading: boolean;
  onCancel?: (bookingId: string) => void;
}

export function TenantActivitySidebar({ bookings, isLoading, onCancel }: TenantActivitySidebarProps) {
  if (isLoading) return <Card className="p-6 h-64 animate-pulse bg-muted/50" />;

  const upcomingBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'active' || b.status === 'pending').slice(0, 5);

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <h3 className="font-semibold mb-4 text-foreground">Próximas reservas</h3>
        <div className="space-y-4">
          {upcomingBookings.map((booking) => (
            <div key={booking.id} className="pb-4 border-b border-border last:border-0 last:pb-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 text-foreground">
                  <p className="font-medium text-sm mb-1">{booking.spot.garage.name} - {booking.spot.spot_number}</p>
                  <div className="flex flex-col gap-0.5 mb-2">
                    <p className="text-xs text-muted-foreground font-semibold">{booking.renter?.name || 'Cliente'}</p>
                    {booking.vehicle_plate && (
                      <p className="text-[10px] text-primary/80 font-mono bg-primary/5 px-1.5 py-0.5 rounded w-fit">
                        {booking.vehicle_plate} — {booking.vehicle_description}
                      </p>
                    )}
                  </div>
                </div>
                {booking.status === 'active' ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Button
                    size="sm"
                    className="h-7 text-xs text-destructive hover:bg-destructive/10 border-destructive/20"
                    variant="outline"
                    onClick={() => onCancel?.(booking.id)}
                  >
                    Cancelar
                  </Button>
                )}
              </div>
              <div className="text-[12px] space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(booking.start_time).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{new Date(booking.start_time).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} - {new Date(booking.end_time).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="flex items-center gap-2 text-primary font-semibold">
                  <Euro className="h-3 w-3" />
                  <span>{Number(booking.total_price).toFixed(2)}€</span>
                </div>
              </div>
            </div>
          ))}
          {upcomingBookings.length === 0 && (
            <p className="text-sm text-muted-foreground italic text-center py-4">
              Sin reservas próximas
            </p>
          )}
        </div>
        <Button variant="outline" className="w-full mt-4">Ver todas</Button>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Consejos útiles</h3>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-secondary mt-0.5" />
            <span>Sube fotos de calidad de tu plaza</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-secondary mt-0.5" />
            <span>Responde rápido a las consultas</span>
          </li>
        </ul>
      </Card>
    </div>
  );
}
