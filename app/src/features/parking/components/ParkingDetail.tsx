import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Heart, Share2, Car } from 'lucide-react';
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
import { useIsFavorite, useToggleFavorite } from '../../profile/hooks/useFavorites';
import { useAuth } from '../../auth';
import { toast } from 'sonner';

export function ParkingDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Real data fetching with React Query
  const { data: parking, isLoading, error: queryError } = useParkingSpot(id);
  const { data: realReviews = [], isLoading: reviewsLoading } = useGarageReviews(parking?.garage_id);

  const { authUser } = useAuth();
  const { data: isFavorite, isLoading: isFavLoading } = useIsFavorite(authUser?.user?.id, parking?.id);
  const toggleFavoriteMutation = useToggleFavorite();

  const handleToggleFavorite = () => {
    if (!authUser) {
      toast.error('Debes iniciar sesión para añadir a favoritos');
      return;
    }
    if (parking) {
      toggleFavoriteMutation.mutate({
        userId: authUser.user.id,
        spotId: parking.id,
        isCurrentlyFavorite: !!isFavorite
      });
      toast.success(isFavorite ? 'Eliminado de favoritos' : 'Añadido a favoritos');
    }
  };

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
      <div className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 relative">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => navigate('/map')} className="z-10">
              <ArrowLeft className="h-5 w-5" />
            </Button>

            {/* Logo Centrado */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              aria-hidden="true"
            >
              <div
                className="flex items-center gap-2 cursor-pointer pointer-events-auto group"
                onClick={() => navigate('/')}
              >
                <div className="bg-primary p-1.5 rounded-lg group-hover:scale-105 transition-transform">
                  <Car className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tight text-foreground">Parky</span>
              </div>
            </div>

            <div className="flex gap-2 z-10">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleToggleFavorite}
                disabled={isFavLoading || toggleFavoriteMutation.isPending}
              >
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

      <div className="max-w-7xl mx-auto px-4 py-8 pb-32 md:pb-8">
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

          {/* Columna Lateral (Reserva) - En móvil se maneja via Drawer y un CTA flotante */}
          <div className="hidden lg:block lg:col-span-1">
            <ParkingBookingCard parking={parking} />
          </div>

          {/* En móvil, el ParkingBookingCard renderizará el CTA flotante y el Drawer */}
          <div className="lg:hidden">
            <ParkingBookingCard parking={parking} />
          </div>
        </div>
      </div>
    </div>
  );
}
