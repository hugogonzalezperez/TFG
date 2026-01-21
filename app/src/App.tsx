import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { FilterProvider } from './features/parking';
import { AuthProvider, useAuth } from './features/auth';
import { AnimatedLoader } from './shared/components/loaders';

function AppContent() {
  const { authUser, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark');
    }

    if (!loading) {
      if (authUser) {
        if (['/login', '/signup'].includes(location.pathname)) {
          navigate('/');
        }
      } else {
        // Rutas públicas permitidas
        const publicRoutes = ['/login', '/signup', '/auth/callback'];
        if (!publicRoutes.includes(location.pathname)) {
          navigate('/login');
        }
      }
    }
  }, [authUser, loading, location.pathname, navigate]);

  if (loading) {
    return <AnimatedLoader message="Iniciando aplicación..." />;
  }

  return <Outlet />;
}

export default function App() {
  return (
    <AuthProvider>
      <FilterProvider>
        <AppContent />
      </FilterProvider>
    </AuthProvider>
  );
}