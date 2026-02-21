import { createBrowserRouter } from 'react-router-dom';
import App from '../../App';
import {
  HomePage,
  LoginPage,
  SignUpPage,
  MapViewPage,
  ParkingDetailPage,
  BookingPage,
  UserProfilePage,
  OwnerProfilePage,
  AuthCallbackPage
} from '../../pages';
// Import AuthCallbackPage will be added to pages/index.ts shortly

import { ProtectedRoute } from '../../shared/components/auth/ProtectedRoute';
import { PublicRoute } from '../../shared/components/auth/PublicRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      // Rutas públicas-solo (Login, Signup)
      { path: 'login', element: <PublicRoute><LoginPage /></PublicRoute> },
      { path: 'signup', element: <PublicRoute><SignUpPage /></PublicRoute> },
      { path: 'auth/callback', element: <AuthCallbackPage /> },

      // Rutas protegidas (Usuario básico)
      { index: true, element: <ProtectedRoute><HomePage /></ProtectedRoute> },
      { path: 'map', element: <ProtectedRoute><MapViewPage /></ProtectedRoute> },
      { path: 'parking/:id', element: <ProtectedRoute><ParkingDetailPage /></ProtectedRoute> },
      { path: 'book/:id', element: <ProtectedRoute><BookingPage /></ProtectedRoute> },
      { path: 'profile', element: <ProtectedRoute><UserProfilePage /></ProtectedRoute> },

      // Rutas protegidas (Solo Owners - Ahora accesible para todos los registrados que quieran serlo)
      {
        path: 'owner-profile',
        element: (
          <ProtectedRoute>
            <OwnerProfilePage />
          </ProtectedRoute>
        )
      },
    ],
  },
]);
