import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button, ConfirmationDialog } from '../../../ui';
import { useAuth } from '../../auth';
import { AnimatedLoader } from '../../../shared/components/loaders';

// Sub-components
import { ProfileSidebar } from './user/ProfileSidebar';
import { BookingHistory } from './user/BookingHistory';
import { ProfileAccountSettings } from './user/ProfileAccountSettings';
import { FavoritesList } from './user/FavoritesList';
import { ReviewModal } from './user/ReviewModal';

// Hooks
import { useUserStats, useUserBookings } from '../hooks/useProfileData';
import { bookingService } from '../../booking';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

export function UserProfile() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { authUser, updateProfile, logout, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('bookings');
  const [reviewBooking, setReviewBooking] = useState<any>(null);
  const [confirmCancel, setConfirmCancel] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // React Query hooks for real data
  const { data: stats } = useUserStats(authUser?.user?.id);
  const { data: bookings = [], isLoading: bookingsLoading } = useUserBookings(authUser?.user?.id);

  if (authLoading || !authUser) {
    return <AnimatedLoader message="Cargando perfil..." />;
  }

  const handleReviewSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['user-stats'] });
    queryClient.invalidateQueries({ queryKey: ['user-bookings'] });
    // Also invalidate garage specific queries if they exist
    queryClient.invalidateQueries({ queryKey: ['garage-reviews'] });
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await bookingService.deleteBooking(bookingId);
      toast.success('Reserva eliminada correctamente');
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['user-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['user-stats'] });
    } catch (err: any) {
      toast.error('Error al eliminar la reserva: ' + err.message);
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    try {
      await bookingService.deleteBooking(bookingId);
      toast.success('Reserva eliminada correctamente');
      queryClient.invalidateQueries({ queryKey: ['user-bookings'] });
    } catch (err: any) {
      toast.error('Error al eliminar la reserva: ' + err.message);
    }
  };

  const userData = {
    id: authUser.user.id,
    name: authUser.user.name || 'Usuario',
    email: authUser.user.email || '',
    phone: authUser.user.phone || '',
    avatar: authUser.user.avatar_url || '',
    memberSince: authUser.user.created_at
      ? new Date(authUser.user.created_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'long' })
      : 'Recientemente',
    rating: stats?.averageRating || 0.0,
    totalBookings: stats?.totalBookings || 0,
  };

  const handleUpdateProfile = async (data: any) => {
    await updateProfile(data);
  };

  const handleAvatarUpdate = (url: string) => {
    updateProfile({ avatar_url: url }).catch(console.error);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            < ProfileSidebar
              user={userData}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              logout={logout}
              updateAvatar={handleAvatarUpdate}
            />
          </div>

          {/* Content Area */}
          <div className="lg:col-span-2">
            {activeTab === 'bookings' && (
              <BookingHistory
                bookings={bookings}
                isLoading={bookingsLoading}
                onCancel={async (id) => setConfirmCancel(id)}
                onDelete={async (id) => setConfirmDelete(id)}
                onReview={setReviewBooking}
              />
            )}

            {activeTab === 'favorites' && (
              <FavoritesList />
            )}

            {activeTab === 'settings' && (
              <ProfileAccountSettings
                initialData={userData}
                onSave={handleUpdateProfile}
              />
            )}

            {!['bookings', 'favorites', 'settings'].includes(activeTab) && (
              <div className="p-12 text-center text-muted-foreground bg-card rounded-lg border border-border">
                Próximamente: Historial de {activeTab}
              </div>
            )}
          </div>
        </div>
      </div>

      {reviewBooking && (
        <ReviewModal
          booking={reviewBooking}
          onClose={() => setReviewBooking(null)}
          onSuccess={handleReviewSuccess}
        />
      )}

      {confirmCancel && (
        <ConfirmationDialog
          isOpen={!!confirmCancel}
          onClose={() => setConfirmCancel(null)}
          onConfirm={() => handleCancelBooking(confirmCancel)}
          title="Cancelar Reserva"
          description="¿Estás seguro de que quieres eliminar esta reserva permanentemente?"
          confirmText="Eliminar"
          variant="destructive"
        />
      )}

      {confirmDelete && (
        <ConfirmationDialog
          isOpen={!!confirmDelete}
          onClose={() => setConfirmDelete(null)}
          onConfirm={() => handleDeleteBooking(confirmDelete)}
          title="Eliminar del Historial"
          description="¿Estás seguro de que quieres eliminar esta reserva del historial?"
          confirmText="Eliminar"
          variant="destructive"
        />
      )}
    </div>
  );
}