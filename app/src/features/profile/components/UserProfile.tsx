import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../../ui/button';
import { useAuth } from '../../auth';
import { AnimatedLoader } from '../../../shared/components/loaders';

// Sub-components
import { ProfileSidebar } from './user/ProfileSidebar';
import { BookingHistory } from './user/BookingHistory';
import { ProfileAccountSettings } from './user/ProfileAccountSettings';
import { FavoritesList } from './user/FavoritesList';

// Hooks
import { useUserStats, useUserBookings } from '../hooks/useProfileData';

export function UserProfile() {
  const navigate = useNavigate();
  const { authUser, updateProfile, logout, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('bookings');

  // React Query hooks for real data
  const { data: stats, isLoading: statsLoading } = useUserStats(authUser?.user?.id);
  const { data: bookings = [], isLoading: bookingsLoading } = useUserBookings(authUser?.user?.id);

  if (authLoading || !authUser) {
    return <AnimatedLoader message="Cargando perfil..." />;
  }

  const userData = {
    id: authUser.user.id,
    name: authUser.user.name || 'Usuario',
    email: authUser.user.email || '',
    phone: authUser.user.phone || '',
    avatar: authUser.user.avatar_url || '',
    memberSince: authUser.user.created_at
      ? new Date(authUser.user.created_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'long' })
      : 'Recientemente',
    rating: stats?.averageRating || 5.0,
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
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Mi Perfil</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <ProfileSidebar
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
              <BookingHistory bookings={bookings} isLoading={bookingsLoading} />
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
    </div>
  );
}