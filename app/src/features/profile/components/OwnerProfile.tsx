import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from '../../../ui/button';
import { useAuth } from '../../auth';
import { AnimatedLoader } from '../../../shared/components/loaders';

// Sub-components
import { OwnerStatsRow } from './owner/OwnerStatsRow';
import { ManagedGarages } from './owner/ManagedGarages';
import { AddSpotForm } from './owner/AddSpotForm';
import { TenantActivitySidebar } from './owner/TenantActivitySidebar';

// Hooks
import { useOwnerStats, useOwnerGarages, useOwnerBookings } from '../hooks/useProfileData';

export function OwnerProfile() {
  const navigate = useNavigate();
  const { authUser, loading: authLoading } = useAuth();
  const [showAddSpot, setShowAddSpot] = useState(false);

  // React Query hooks
  const { data: stats, isLoading: statsLoading } = useOwnerStats(authUser?.user?.id);
  const { data: garages = [], isLoading: garagesLoading } = useOwnerGarages(authUser?.user?.id);
  const { data: bookings = [], isLoading: bookingsLoading } = useOwnerBookings(authUser?.user?.id);

  if (authLoading || !authUser) {
    return <AnimatedLoader message="Cargando panel..." />;
  }

  const ownerStats = {
    totalEarnings: stats?.totalEarnings || 0,
    monthlyEarnings: stats?.monthlyEarnings || 0,
    totalBookings: stats?.totalBookings || 0,
    averageRating: stats?.averageRating || 4.8,
    activeSpots: stats?.activeSpots || 0,
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Panel de Propietario</h1>
            <p className="text-sm text-muted-foreground">Gestiona tus garajes y plazas</p>
          </div>
          <Button
            onClick={() => setShowAddSpot(true)}
            className="gap-2 bg-accent hover:bg-accent/90 text-white"
          >
            <Plus className="h-5 w-5" />
            <span className="hidden sm:inline">Nuevo garaje</span>
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Row */}
        <div className="mb-8">
          <OwnerStatsRow stats={ownerStats} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2">
            {showAddSpot && (
              <AddSpotForm
                userId={authUser.user.id}
                onCancel={() => setShowAddSpot(false)}
              />
            )}

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Mis garajes</h2>
            </div>

            <ManagedGarages garages={garages} isLoading={garagesLoading} />
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-1">
            <TenantActivitySidebar bookings={bookings} isLoading={bookingsLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}
