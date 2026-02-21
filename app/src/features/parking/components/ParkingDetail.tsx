import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Heart, Share2 } from 'lucide-react';
import { Button } from '../../../ui/button';
import { AnimatedLoader } from '../../../shared/components/loaders';
import { ErrorMessage } from '../../../ui';

// Sub-components
import { ParkingGallery } from './detail/ParkingGallery';
import { ParkingHeader } from './detail/ParkingHeader';
import { ParkingOwnerCard } from './detail/ParkingOwnerCard';
import { ParkingFeatures } from './detail/ParkingFeatures';
import { ParkingReviews } from './detail/ParkingReviews';
import { ParkingBookingCard } from './detail/ParkingBookingCard';

// Hooks
import { useParkingSpot } from '../hooks/useParkingSpot';
import { useGarageReviews } from '../hooks/useGarageReviews';

export function ParkingDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Real data fetching with React Query
  const { data: parking, isLoading, error: queryError } = useParkingSpot(id);
  const { data: realReviews = [], isLoading: reviewsLoading } = useGarageReviews(parking?.garage_id);

  const [isFavorite, setIsFavorite] = useState(false);

  if (isLoading) return <AnimatedLoader message="Cargando detalles de la plaza..." />;
  if (queryError || !parking) return (
    <div className="p-8">
      <ErrorMessage
        message="No se pudo encontrar la plaza solicitada."
        onClose={() => navigate('/map')}
      />
      <Button onClick={() => navigate('/map')} className="mt-4">Volver al mapa</Button>
    </div>
  );

  const formattedReviews = realReviews.map((r: any) => ({
    id: r.id,
    author: r.user?.name || 'Usuario',
    rating: r.rating,
    date: new Date(r.created_at).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }),
    comment: r.comment || '',
  }));

  return (
    <div className="min-h-screen bg-background">
      {/* Header Sticky */}
      <div className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => navigate('/map')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => setIsFavorite(!isFavorite)}>
                <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button variant="ghost" size="icon">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ParkingGallery images={parking.images || [parking.image]} isVerified={parking.is_verified} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna Principal */}
          <div className="lg:col-span-2 space-y-8">
            <ParkingHeader
              name={parking.name}
              rating={parking.rating}
              reviews={parking.reviews}
              address={parking.address}
              city={parking.city}
              type={parking.type}
            />

            {parking.owner && <ParkingOwnerCard owner={parking.owner} />}

            <ParkingFeatures
              description={parking.description}
              amenities={parking.amenities}
              rules={parking.rules}
            />

            {!reviewsLoading && (
              <ParkingReviews
                rating={parking.rating}
                reviewsCount={parking.reviews}
                reviews={formattedReviews}
              />
            )}
          </div>

          {/* Columna Lateral (Reserva) */}
          <div className="lg:col-span-1">
            <ParkingBookingCard parking={parking} />
          </div>
        </div>
      </div>
    </div>
  );
}
