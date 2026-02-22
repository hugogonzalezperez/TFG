import { Star, MessageSquare, Building2, Calendar } from 'lucide-react';
import { Card, Avatar, AvatarImage, AvatarFallback, Badge } from '../../../../ui';
import { cn } from '../../../../shared/lib/cn';

interface OwnerReviewsTabProps {
  reviews: any[];
  isLoading: boolean;
  totalGarages: number;
}

export function OwnerReviewsTab({ reviews, isLoading, totalGarages }: OwnerReviewsTabProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 w-full bg-muted/50 animate-pulse rounded-2xl border border-border" />
        ))}
      </div>
    );
  }

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const valuedGaragesCount = new Set(reviews.map(r => r.garage_id)).size;

  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-card rounded-3xl border border-border border-dashed shadow-sm">
        <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mb-6">
          <Star className="h-10 w-10 text-muted-foreground opacity-30" />
        </div>
        <h3 className="text-xl font-bold mb-2">Sin valoraciones todavía</h3>
        <p className="text-muted-foreground max-w-sm">
          Cuando los usuarios completen sus reservas y valoren tu servicio, aparecerán aquí. ¡Mantén un buen servicio para obtener 5 estrellas!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Summary Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-8 flex flex-col items-center justify-center text-center bg-gradient-to-br from-card to-muted/30 border-primary/5 shadow-sm rounded-3xl">
          <div className="text-5xl font-black text-foreground mb-2">{averageRating}</div>
          <div className="flex gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  "h-5 w-5",
                  star <= Math.round(Number(averageRating))
                    ? "fill-accent text-accent"
                    : "text-muted-foreground/30"
                )}
              />
            ))}
          </div>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Puntuación Media</p>
        </Card>

        <Card className="p-8 flex flex-col justify-center bg-card border-border shadow-sm rounded-3xl gap-8">
          <div className="flex items-center justify-between group px-2">
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-foreground leading-none">{reviews.length}</span>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Reseñas Totales</p>
            </div>
            <div className="h-10 w-10 bg-muted/50 rounded-xl flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-muted-foreground/50" />
            </div>
          </div>

          <div className="flex items-center justify-between group px-2">
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-secondary leading-none">{reviews.filter(r => r.rating >= 4).length}</span>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Positivas</p>
            </div>
            <div className="h-10 w-10 bg-secondary/10 rounded-xl flex items-center justify-center">
              <Star className="h-5 w-5 text-secondary" />
            </div>
          </div>

          <div className="flex items-center justify-between group px-2">
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-primary leading-none">{valuedGaragesCount}/{totalGarages}</span>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Garajes valorados</p>
            </div>
            <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
          </div>
        </Card>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold flex items-center gap-2 px-2">
          Comentarios Recientes
          <Badge variant="outline" className="rounded-full text-[11px] h-5">
            Mostrando {reviews.length}
          </Badge>
        </h3>

        <div className="grid gap-4">
          {reviews.map((review) => (
            <Card key={review.id} className="p-6 transition-all hover:shadow-md border-border/50 group rounded-2xl">
              <div className="flex flex-col sm:flex-row gap-6">
                {/* User & Meta info */}
                <div className="flex sm:flex-col items-center sm:items-start gap-4 sm:w-48 shrink-0">
                  <Avatar className="h-14 w-14 ring-2 ring-background border border-border shadow-sm">
                    <AvatarImage src={review.user?.avatar_url} />
                    <AvatarFallback className="bg-primary/5 text-primary text-lg font-bold uppercase">
                      {review.user?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm leading-tight">{review.user?.name || 'Inquilino Parky'}</span>
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1 mt-1 font-medium">
                      <Calendar className="h-3 w-3" />
                      {new Date(review.created_at).toLocaleDateString('es-ES', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col gap-3 pt-1">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={cn(
                            "h-4 w-4",
                            star <= review.rating ? "fill-accent text-accent" : "text-muted-foreground/20"
                          )}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5 bg-muted/50 px-3 py-1 rounded-full border border-border/40 group-hover:bg-primary/5 group-hover:border-primary/20 transition-colors">
                      <Building2 className="h-3.5 w-3.5 text-primary opacity-60" />
                      <span className="text-[11px] font-bold text-foreground/80 lowercase truncate max-w-[120px]">
                        {review.garage?.name}
                      </span>
                    </div>
                  </div>

                  <div className="relative">
                    <MessageSquare className="h-8 w-8 text-primary/5 absolute -top-4 -left-2 rotate-12" />
                    <p className="text-sm leading-relaxed text-foreground/90 font-medium italic relative z-10">
                      "{review.comment}"
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
