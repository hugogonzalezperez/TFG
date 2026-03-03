import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../features/auth';
import { AnimatedLoader } from '../loaders';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireOwner?: boolean;
}

/**
 * Componente para proteger rutas que requieren autenticación.
 * Maneja estados de carga y redirecciones de forma determinista.
 */
export function ProtectedRoute({ children, requireOwner = false }: ProtectedRouteProps) {
  const { authUser, initialized, isOwner } = useAuth();
  const location = useLocation();

  // Mientras no se haya inicializado la sesión (comprobando cookies/token), 
  // mostramos un loader para evitar flashes de contenido.
  if (!initialized) {
    return <AnimatedLoader message="Verificando sesión..." />;
  }

  // Si no hay usuario autenticado, redirigimos a login
  // Guardamos la ubicación actual para volver después del login
  if (!authUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si requiere ser dueño y no lo es, redirigimos a la home o perfil básico
  if (requireOwner && !isOwner) {
    return <Navigate to="/profile" replace />;
  }

  return <>{children}</>;
}
