import { MessageCircle, Star } from 'lucide-react';
import { Card, Avatar, Button } from '../../../../ui';
import { useIsMobile } from '../../../../shared/hooks/use-mobile';
import { toast } from 'sonner';

interface ParkingOwnerCardProps {
  owner: {
    id: string;
    name: string;
    avatar?: string;
    rating?: number;
    reviewCount?: number;
  };
}

function reviewLabel(count: number | undefined): string {
  if (count === 1) return '1 valoración';
  return `${count ?? 0} valoraciones`;
}

export function ParkingOwnerCard({ owner }: ParkingOwnerCardProps) {
  const isMobile = useIsMobile();
  const handleContact = () =>
    toast.info('La mensajería estará disponible próximamente');

  if (!isMobile) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <img src={owner.avatar} alt={owner.name} loading="lazy" />
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">{owner.name}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-accent text-accent" />
                  <span>{owner.rating ? owner.rating : 'N/A'}</span>
                </div>
                <span>•</span>
                <span>{reviewLabel(owner.reviewCount)}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Tiempo de respuesta: 1h aprox
              </p>
            </div>
          </div>
          <Button variant="default" className="gap-2 text-background bg-primary hover:bg-primary/60" onClick={handleContact}>
            <MessageCircle className="h-4 w-4" />
            Contactar
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-5 bg-muted/20 border-border/50 shadow-sm overflow-hidden relative">
      <div className="flex items-center gap-5">
        <div className="relative">
          <Avatar className="h-16 w-16 border-2 border-background shadow-md border-primary">
            <img src={owner.avatar} alt={owner.name} className="object-cover" loading="lazy" />
          </Avatar>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-bold text-lg truncate text-foreground">{owner.name}</h3>
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs shrink-0" onClick={handleContact}>
              <MessageCircle className="h-3.5 w-3.5" />
              Contactar
            </Button>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-primary/10 text-primary rounded-full font-bold">
              <Star className="h-3.5 w-3.5" />
              <span>{owner.rating ? owner.rating : 'N/A'}</span>
            </div>
            <span className="text-muted-foreground font-medium">
              {reviewLabel(owner.reviewCount)}
            </span>
          </div>

          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground bg-background/50 p-2 rounded-lg w-fit">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span>Tiempo de respuesta: ~1h</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
