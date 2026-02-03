import { Star } from 'lucide-react';
import { Card, Avatar, Button } from '../../../../ui';

interface Review {
  id: number;
  author: string;
  rating: number;
  date: string;
  comment: string;
}

interface ParkingReviewsProps {
  rating?: number;
  reviewsCount?: number;
  reviews?: Review[];
}

export function ParkingReviews({ rating, reviewsCount, reviews = [] }: ParkingReviewsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">
          Valoraciones ({reviewsCount || 0})
        </h2>
        <div className="flex items-center gap-2">
          <Star className="h-6 w-6 fill-accent text-accent" />
          <span className="text-2xl font-bold">{rating || 'N/A'}</span>
        </div>
      </div>

      <div className="space-y-6">
        {reviews.map((review) => (
          <Card key={review.id} className="p-6">
            <div className="flex items-start gap-4">
              <Avatar className="h-12 w-12">
                <div className="bg-primary/10 w-full h-full flex items-center justify-center text-primary font-semibold">
                  {review.author.charAt(0)}
                </div>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{review.author}</h4>
                  <span className="text-sm text-muted-foreground">{review.date}</span>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < review.rating ? 'fill-accent text-accent' : 'text-muted-foreground'}`}
                    />
                  ))}
                </div>
                <p className="text-muted-foreground">{review.comment}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Button variant="outline" className="w-full mt-6">
        Ver todas las valoraciones
      </Button>
    </div>
  );
}
