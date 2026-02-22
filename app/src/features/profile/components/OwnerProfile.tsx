import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, LayoutDashboard, Building2, Calendar as CalendarIcon, Star, User, LogOut } from 'lucide-react';
import { Button } from '../../../ui/button';
import { useAuth } from '../../auth';
import { AnimatedLoader } from '../../../shared/components/loaders';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { bookingService } from '../../booking/services/booking.service';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../ui/tabs';
import { supabase } from '../../../shared/lib/supabase';

// Sub-components
import { OwnerDashboardTab } from './owner/OwnerDashboardTab';
import { ManagedGarages } from './owner/ManagedGarages';
import { AddSpotForm } from './owner/AddSpotForm';
import { OwnerBookingsTab } from './owner/OwnerBookingsTab';
import { OwnerReviewsTab } from './owner/OwnerReviewsTab';
import { TenantActivitySidebar } from './owner/TenantActivitySidebar';

// Hooks
import { useOwnerStats, useOwnerGarages, useOwnerBookings, useOwnerReviews } from '../hooks/useProfileData';

export function OwnerProfile() {
  const navigate = useNavigate();
  const { authUser, loading: authLoading, logout } = useAuth();
  const [showAddSpot, setShowAddSpot] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // React Query hooks
  const { data: stats } = useOwnerStats(authUser?.user?.id);
  const { data: garages = [], isLoading: garagesLoading } = useOwnerGarages(authUser?.user?.id);
  const { data: bookings = [], isLoading: bookingsLoading } = useOwnerBookings(authUser?.user?.id);
  const { data: reviews = [], isLoading: reviewsLoading } = useOwnerReviews(authUser?.user?.id);

  const queryClient = useQueryClient();

  // Force 'garages' tab if user has 0 garages
  useEffect(() => {
    if (!garagesLoading && garages.length === 0 && activeTab !== 'garages') {
      setActiveTab('garages');
    }
  }, [garagesLoading, garages.length, activeTab]);

  // Realtime subscription for bookings
  useEffect(() => {
    if (!authUser?.user?.id) return;

    const channel = supabase
      .channel('owner-bookings-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings'
        },
        () => {
          // Invalidate both bookings and stats as they are related
          queryClient.invalidateQueries({ queryKey: ['owner-bookings'] });
          queryClient.invalidateQueries({ queryKey: ['owner-stats'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [authUser?.user?.id, queryClient]);

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('¿Seguro que quieres eliminar esta reserva permanentemente?')) return;

    try {
      await bookingService.deleteBooking(bookingId);
      toast.success('Reserva eliminada');
      queryClient.invalidateQueries({ queryKey: ['owner-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['owner-stats'] });
    } catch (err: any) {
      toast.error('Error al eliminar: ' + err.message);
    }
  };

  if (authLoading || !authUser) {
    return <AnimatedLoader message="Cargando panel..." />;
  }

  const ownerStats = {
    totalEarnings: stats?.totalEarnings || 0,
    monthlyEarnings: stats?.monthlyEarnings || 0,
    totalBookings: stats?.totalBookings || 0,
    averageRating: stats?.averageRating || 0,
    activeSpots: stats?.activeSpots || 0,
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Panel de Propietario</h1>
            <p className="text-sm text-muted-foreground">Gestiona tus garajes y plazas</p>
          </div>
          {activeTab === 'garages' ? (
            <Button
              onClick={() => setShowAddSpot(true)}
              className="gap-2 bg-accent hover:bg-accent/90 text-white shadow-sm"
            >
              <Plus className="h-5 w-5" />
              <span className="hidden sm:inline">Nuevo garaje</span>
            </Button>
          ) : (
            <div className="hidden md:flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/profile')}
                className="flex items-center space-x-2"
              >
                {authUser?.user?.avatar_url ? (
                  <img
                    src={authUser.user.avatar_url}
                    alt={authUser.user.name}
                    className="h-8 w-8 rounded-full object-cover border-2 border-primary"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                )}
                <span>{authUser?.user?.name?.split(' ')[0] || 'Mi cuenta'}</span>
              </Button>
              <Button
                variant="exit"
                onClick={logout}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-5 w-5" />
                <span>Salir</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <div className="flex justify-center">
            <TabsList className="bg-card border border-border p-1.5 gap-2 h-auto shadow-md rounded-2xl">
              {(garages.length > 0 || garagesLoading) && (
                <TabsTrigger
                  value="dashboard"
                  className="gap-2 px-6 py-2.5 rounded-xl transition-all data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground hover:bg-muted/50 text-base font-semibold"
                >
                  <LayoutDashboard className="h-5 w-5" />
                  Dashboard
                </TabsTrigger>
              )}
              <TabsTrigger
                value="garages"
                className="gap-2 px-6 py-2.5 rounded-xl transition-all data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground hover:bg-muted/50 text-base font-semibold"
              >
                <Building2 className="h-5 w-5" />
                Mis Garajes
              </TabsTrigger>
              {(garages.length > 0 || garagesLoading) && (
                <>
                  <TabsTrigger
                    value="bookings"
                    className="gap-2 px-6 py-2.5 rounded-xl transition-all data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground hover:bg-muted/50 text-base font-semibold"
                  >
                    <CalendarIcon className="h-5 w-5" />
                    Reservas
                  </TabsTrigger>
                  <TabsTrigger
                    value="reviews"
                    className="gap-2 px-6 py-2.5 rounded-xl transition-all data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground hover:bg-muted/50 text-base font-semibold"
                  >
                    <Star className="h-5 w-5" />
                    Valoraciones
                  </TabsTrigger>
                </>
              )}
            </TabsList>
          </div>

          <TabsContent value="dashboard" className="m-0 focus-visible:outline-none">
            <OwnerDashboardTab
              stats={ownerStats}
              garages={garages}
              bookings={bookings}
            />
          </TabsContent>

          <TabsContent value="garages" className="m-0 focus-visible:outline-none">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                {showAddSpot && (
                  <AddSpotForm
                    userId={authUser.user.id}
                    onCancel={() => setShowAddSpot(false)}
                  />
                )}
                <ManagedGarages
                  garages={garages}
                  isLoading={garagesLoading}
                  onAddGarage={() => setShowAddSpot(true)}
                />
              </div>
              <div className="lg:col-span-1">
                <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
                  <h3 className="font-bold mb-4">Resumen de Actividad</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Aquí puedes ver un vistazo rápido de tus plazas y su estado actual.
                  </p>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>Plazas Registradas</span>
                      <span className="font-bold">{ownerStats.activeSpots}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Garajes Activos</span>
                      <span className="font-bold">{garages.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="m-0 focus-visible:outline-none">
            <OwnerBookingsTab
              bookings={bookings}
              isLoading={bookingsLoading}
              onCancel={handleCancelBooking}
            />
          </TabsContent>

          <TabsContent value="reviews" className="m-0 focus-visible:outline-none">
            <OwnerReviewsTab
              reviews={reviews}
              isLoading={reviewsLoading}
              totalGarages={garages.length}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
