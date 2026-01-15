import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FilterProvider } from '../src/context/FilterContext';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { AnimatedLoader } from '../src/components/loaders/animatedLoader';

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
  }, []);

  useEffect(() => {
    if (!loading) {
      if (authUser) {
        // Si el usuario está autenticado y en la página de login, lo redirigimos a home
        if (location.pathname === '/login' || location.pathname === '/signup') {
          navigate('/');
        }
      } else {
        // Si el usuario no está autenticado y no está en una ruta pública, lo mandamos a login
        const publicRoutes = ['/login', '/signup', '/auth/callback'];
        if (!publicRoutes.includes(location.pathname)) {
          navigate('/login');
        }
      }
    }
  }, [authUser, loading, navigate, location.pathname]);

  if (loading) {
    return <AnimatedLoader message="Preparando tu experiencia..." />;
  }

  return <Outlet />; // <-- Aquí se renderizará el componente de la ruta actual
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