import { DollarSign, TrendingUp, Calendar, Star, MapPin } from 'lucide-react';
import { Card } from '../../../../ui';
import { cn } from '../../../../shared/lib/cn';

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
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        const isLast = i === cards.length - 1;
        return (
          <Card key={i} className={cn(
            "p-3 sm:p-6 transition-all hover:shadow-md",
            isLast && "col-span-2 lg:col-span-1"
          )}>
            <div className="flex items-center justify-between mb-1 sm:mb-2">
              <span className="text-[10px] sm:text-sm text-muted-foreground font-medium uppercase tracking-wider">{card.label}</span>
              <Icon className={cn("h-4 w-4 sm:h-5 sm:w-5", card.color)} />
            </div>
            <p className={cn(
              "text-lg sm:text-3xl font-bold truncate",
              card.color === 'text-foreground' ? '' : card.color
            )}>
              {card.value}
            </p>
          </Card>
        );
      })}
    </div>
  );
}
