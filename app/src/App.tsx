import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { FilterProvider } from './features/parking';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './features/auth';
import { AnimatedLoader } from './shared/components/loaders';

function AppContent() {
  const { authUser, loading, initialized } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark');
    }

    if (initialized) {
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
  }, [authUser, initialized, location.pathname, navigate]);

  if (!initialized) {
    return <AnimatedLoader message="Iniciando aplicación..." />;
  }

  return <Outlet />;
}

export default function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 1,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <FilterProvider>
          <AppContent />
        </FilterProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}