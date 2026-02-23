import { LucideIcon } from 'lucide-react';
import { Button } from './button';
import { Card } from './card';
import { cn } from '../shared/lib/cn';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className
}: EmptyStateProps) {
  return (
    <Card className={cn(
      "flex flex-col items-center justify-center p-12 text-center border-dashed border-2 bg-muted/10",
      className
    )}>
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-[300px] mb-8">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className="bg-primary hover:bg-primary/90 font-bold px-8 h-11"
        >
          {actionLabel}
        </Button>
      )}
    </Card>
  );
}
