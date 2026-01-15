import { Card } from '../ui';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  valueColor?: string;
  suffix?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  iconColor = 'text-primary',
  valueColor = 'text-foreground',
  suffix = '',
}: StatCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground">{label}</span>
        <Icon className={`h-5 w-5 ${iconColor}`} />
      </div>
      <p className={`text-3xl font-bold ${valueColor}`}>
        {value}
        {suffix}
      </p>
    </Card>
  );
}
