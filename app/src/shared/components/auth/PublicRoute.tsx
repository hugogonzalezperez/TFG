import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../features/auth';
import { AnimatedLoader } from '../loaders';

interface PublicRouteProps {
  children: React.ReactNode;
}

/**
 * Componente para rutas que SOLO deben ser accesibles si NO estás autenticado (Login, Signup).
 * Si el usuario ya tiene sesión, lo redirige automáticamente a la home.
 */
export function PublicRoute({ children }: PublicRouteProps) {
  const { authUser, initialized } = useAuth();

  if (!initialized) {
    return <AnimatedLoader message="Cargando..." />;
  }

  if (authUser) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
