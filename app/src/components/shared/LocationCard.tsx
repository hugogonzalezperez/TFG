import { Card } from '../ui';
import { MapPin } from 'lucide-react';

interface LocationCardProps {
  name: string;
  spots: number;
  onClick: () => void;
}

export function LocationCard({ name, spots, onClick }: LocationCardProps) {
  return (
    <Card
      className="p-6 hover:shadow-lg transition-all cursor-pointer hover:border-primary group"
      onClick={onClick}
    >
      <MapPin className="h-8 w-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
      <h3 className="font-semibold mb-1">{name}</h3>
      <p className="text-sm text-muted-foreground">{spots} plazas</p>
    </Card>
  );
}
