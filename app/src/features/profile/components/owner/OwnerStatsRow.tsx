import { DollarSign, TrendingUp, Calendar, Star, MapPin } from 'lucide-react';
import { Card } from '../../../../ui';

interface OwnerStatsRowProps {
  stats: {
    totalEarnings: number;
    monthlyEarnings: number;
    totalBookings: number;
    averageRating: number;
    activeSpots: number;
  };
}

export function OwnerStatsRow({ stats }: OwnerStatsRowProps) {
  const cards = [
    { label: 'Ingresos totales', value: `${stats.totalEarnings.toFixed(2)}€`, icon: DollarSign, color: 'text-primary' },
    { label: 'Este mes', value: `${stats.monthlyEarnings.toFixed(2)}€`, icon: TrendingUp, color: 'text-secondary' },
    { label: 'Reservas', value: stats.totalBookings, icon: Calendar, color: 'text-foreground' },
    { label: 'Valoración', value: stats.averageRating, icon: Star, color: 'text-accent' },
    { label: 'Plazas activas', value: stats.activeSpots, icon: MapPin, color: 'text-primary' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <Card key={i} className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">{card.label}</span>
              <Icon className={`h-5 w-5 ${card.color}`} />
            </div>
            <p className={`text-3xl font-bold ${card.color === 'text-foreground' ? '' : card.color}`}>
              {card.value}
            </p>
          </Card>
        );
      })}
    </div>
  );
}
