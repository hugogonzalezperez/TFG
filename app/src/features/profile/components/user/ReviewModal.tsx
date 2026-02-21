import { useState } from 'react';
import { Star } from 'lucide-react';
import { Button, Card } from '../../../../ui';
import { toast } from 'sonner';
import { parkingService } from '../../../parking/services/parking.service';

interface ReviewModalProps {
  booking: any;
  onClose: () => void;
  onSuccess: () => void;
}

export function ReviewModal({ booking, onClose, onSuccess }: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!rating) {
      toast.error('Por favor, selecciona una puntuación');
      return;
    }

    setLoading(true);
    try {
      await parkingService.submitReview({
        garage_id: booking.spot.garage.id,
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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <Card className="w-full max-w-md p-6 shadow-2xl">
        <h3 className="text-xl font-bold mb-4">Valorar tu estancia</h3>
        <p className="text-muted-foreground text-sm mb-6">
          ¿Qué te ha parecido aparcar en {booking.parkingName}?
        </p>

        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className="focus:outline-none transition-transform hover:scale-110"
            >
              <Star
                className={`h-10 w-10 ${star <= rating ? 'fill-accent text-accent' : 'text-muted'
                  }`}
              />
            </button>
          ))}
        </div>

        <div className="space-y-4 mb-6">
          <label className="text-sm font-medium">Comentario (opcional)</label>
          <textarea
            className="w-full min-h-[100px] p-3 rounded-lg border border-input bg-card focus:ring-2 focus:ring-primary/20 outline-none resize-none"
            placeholder="Escribe aquí tu experiencia..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        <div className="flex gap-3">
          <Button variant="ghost" className="flex-1" onClick={onClose}>
            Cancelar
          </Button>
          <Button className="flex-1 bg-primary hover:bg-primary/90" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar valoración'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
