import { useState, useEffect } from 'react';
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { Home } from './pages/Home';
import { MapView } from './components/features/MapView';
import { ParkingDetail } from './components/features/ParkingDetail';
import { BookingProcess } from './components/features/BookingProcess';
import { UserProfile } from './components/features/UserProfile';
import { OwnerProfile } from './components/features/OwnerProfile';
import { FilterProvider } from './context/FilterContext';
import { AuthProvider, useAuth } from './context/AuthContext';

function AppContent() {
  const { authUser, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<any>('signup');
  const [navigationData, setNavigationData] = useState<any>({});

  // EFECTO MÁGICO: Si detecta sesión, te manda a Home automáticamente
  useEffect(() => {
    if (!loading) {
      if (authUser) {
        setCurrentPage('home');
      } else if (currentPage !== 'login') {
        setCurrentPage('signup');
      }
    }
  }, [authUser, loading]);

  const handleNavigation = (page: string) => setCurrentPage(page);

  // Mientras carga la sesión, mostramos un spinner limpio
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // El enrutador sencillo
  switch (currentPage) {
    case 'login': return <Login onNavigate={handleNavigation} />;
    case 'signup': return <SignUp onNavigate={handleNavigation} />;
    case 'home': return <Home onNavigate={handleNavigation} />;
    case 'map': return <MapView onNavigate={handleNavigation} searchData={navigationData} />;
    case 'detail': return <ParkingDetail onNavigate={handleNavigation} parkingData={navigationData} />;
    case 'booking': return <BookingProcess onNavigate={handleNavigation} parkingData={navigationData} />;
    case 'profile': return <UserProfile onNavigate={handleNavigation} />;
    case 'owner-profile': return <OwnerProfile onNavigate={handleNavigation} />;
    default: return <Home onNavigate={handleNavigation} />;
  }
}

// El componente principal envuelve todo
export default function App() {
  return (
    <AuthProvider>
      <FilterProvider>
        <AppContent />
      </FilterProvider>
    </AuthProvider>
  );
}