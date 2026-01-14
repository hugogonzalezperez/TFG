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
import { AnimatedLoader } from './components/loaders/animatedLoader';

function AppContent() {
  const { authUser, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<any>('login');
  const [navigationData, setNavigationData] = useState<any>({});

  // EFECTO MÁGICO: Si detecta sesión, te manda a Home automáticamente
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark');
    }

    if (!loading) {
      if (authUser) {
        setCurrentPage('home');
      } else if (currentPage !== 'login') {
        setCurrentPage('login');
      }
    }
  }, [authUser, loading]);

  // CAMBIO: Solo mostrar loader de pantalla completa al inicio de la app,
  // pero no cuando ya estamos en Login o SignUp intentando entrar.
  if (loading && currentPage !== 'login' && currentPage !== 'signup') {
    return <AnimatedLoader message="Preparando tu experiencia..." />;
  }

  const handleNavigation = (page: string) => setCurrentPage(page);

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