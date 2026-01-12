import { useState } from 'react';
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { Home } from './pages/Home';
import { MapView } from './components/features/MapView';
import { ParkingDetail } from './components/features/ParkingDetail';
import { BookingProcess } from './components/features/BookingProcess';
import { UserProfile } from './components/features/UserProfile';
import { OwnerProfile } from './components/features/OwnerProfile';
import { FilterProvider } from './context/FilterContext';

type Page = 'login' | 'signup' | 'home' | 'map' | 'detail' | 'booking' | 'profile' | 'owner-profile';

interface NavigationData {
  [key: string]: any;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [navigationData, setNavigationData] = useState<NavigationData>({});

  const handleNavigation = (page: string, data?: any) => {
    setCurrentPage(page as Page);
    if (data) {
      setNavigationData(data);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <Login onNavigate={handleNavigation} />;

      case 'signup':
        return <SignUp onNavigate={handleNavigation} />;

      case 'home':
        return <Home onNavigate={handleNavigation} />;

      case 'map':
        return <MapView onNavigate={handleNavigation} searchData={navigationData} />;

      case 'detail':
        return <ParkingDetail onNavigate={handleNavigation} parkingData={navigationData} />;

      case 'booking':
        return <BookingProcess onNavigate={handleNavigation} parkingData={navigationData} />;

      case 'profile':
        return <UserProfile onNavigate={handleNavigation} />;

      case 'owner-profile':
        return <OwnerProfile onNavigate={handleNavigation} />;

      default:
        return <Home onNavigate={handleNavigation} />;
    }
  };

  return (
    <FilterProvider>
      <div className="min-h-screen">
        {renderPage()}
      </div>
    </FilterProvider>
  );
}
