import { useState } from 'react';
import { Star } from 'lucide-react';
import { Button, Card, Avatar } from '../../../../ui';
import { toast } from 'sonner';
import { parkingService } from '../../../parking/services/parking.service';

interface ReviewModalProps {
  booking: any;
  onClose: () => void;
  onSuccess: () => void;
}

export function ReviewModal({ booking, onClose, onSuccess }: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  // Resolve garage_id from multiple possible data shapes
  const garageId = booking.garage_id
    || booking.spot?.garage?.id
    || booking.spot?.garage_id;

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Por favor, selecciona una puntuación');
      return;
    }

    if (!garageId) {
      toast.error('No se pudo identificar el garaje de esta reserva');
      return;
    }

    setLoading(true);
    try {
      await parkingService.submitReview({
        garage_id: garageId,
        user_id: booking.renter_id,
        booking_id: booking.id,
        rating,
        comment
      });
      toast.success('¡Gracias por tu valoración!');
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error('Error al enviar la valoración: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <Card className="w-full max-w-md px-8 pt-16 pb-10">
        {/* Parking info header */}
        <div className="flex flex-col items-center mb-4">
          <Avatar className="h-32 w-32 mb-3 border-2 border-primary/20 shadow-md">
            <img
              src={booking.image || 'https://images.unsplash.com/photo-1619335680796-54f13b88c6ba?q=80&w=400'}
              alt={booking.parkingName}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </Avatar>
          <h3 className="text-2xl font-bold text-center pt-6">{booking.parkingName}</h3>
          <p className="text-sm text-muted-foreground">{booking.location || ''}</p>
        </div>

        <p className="text-muted-foreground text-sm text-center">
          ¿Qué te ha parecido tu experiencia?
        </p>

        <div
          className="flex justify-center gap-3"
          onMouseLeave={() => setHoverRating(0)}
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              className="focus:outline-none transition-transform hover:scale-125 active:scale-95"
            >
              <Star
                className={`h-10 w-10 transition-colors ${star <= displayRating
                  ? 'fill-accent text-accent'
                  : 'text-muted-foreground/30'
                  }`}
              />
            </button>
          ))}
        </div>

        {rating > 0 && (
          <p className="text-center text-sm text-muted-foreground">
            {rating === 1 && 'Muy mal'}
            {rating === 2 && 'Mal'}
            {rating === 3 && 'Normal'}
            {rating === 4 && 'Bien'}
            {rating === 5 && 'Excelente'}
          </p>
        )}
        {rating === 0 && <div className="mb-6" />}

        <div className="space-y-4">
          <label className="text-sm font-medium">Comentario (opcional)</label>
          <textarea
            className="w-full min-h-[100px] p-3 rounded-lg border border-input bg-card focus:ring-2 focus:ring-primary/20 outline-none resize-none"
            placeholder="Escribe aquí tu experiencia..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        <div className="flex gap-3">
          <Button variant="exit" className="flex-1" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            className="flex-1 bg-primary hover:bg-primary/90"
            onClick={handleSubmit}
            disabled={loading || rating === 0}
          >
            {loading ? 'Enviando...' : 'Enviar valoración'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
