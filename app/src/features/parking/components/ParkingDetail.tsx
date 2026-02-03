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

export function ParkingDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Real data fetching with React Query
  const { data: parking, isLoading, error: queryError } = useParkingSpot(id);

  const [isFavorite, setIsFavorite] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mocked reviews for now (as the schema only has a reviews table but we might need a separate query)
  const mockReviews = [
    {
      id: 1,
      author: 'Carlos Ruiz',
      rating: 5,
      date: 'Hace 2 semanas',
      comment: 'Excelente ubicación, muy cerca del centro. La plaza es amplia y el garaje está muy bien mantenido.',
    },
    {
      id: 2,
      author: 'Laura Martín',
      rating: 5,
      date: 'Hace 1 mes',
      comment: 'Perfecta para aparcar cuando visitas Santa Cruz. María fue muy amable y el proceso super fácil.',
    }
  ];

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
              rating={parking.rating || 4.8}
              reviews={parking.reviews || 12}
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

            <ParkingReviews
              rating={parking.rating || 4.8}
              reviewsCount={parking.reviews || 12}
              reviews={mockReviews}
            />
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
