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
import { MainLayout } from '../../shared/components/layout/MainLayout';

import { ProtectedRoute } from '../../shared/components/auth/ProtectedRoute';
import { PublicRoute } from '../../shared/components/auth/PublicRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      // Rutas con Layout Principal (Header compartido)
      {
        element: <MainLayout />,
        children: [
          { index: true, element: <ProtectedRoute><HomePage /></ProtectedRoute> },
          { path: 'profile', element: <ProtectedRoute><UserProfilePage /></ProtectedRoute> },
          {
            path: 'owner-profile',
            element: (
              <ProtectedRoute>
                <OwnerProfilePage />
              </ProtectedRoute>
            )
          },
        ]
      },

      // Rutas públicas-solo (Login, Signup sin el header principal)
      { path: 'login', element: <PublicRoute><LoginPage /></PublicRoute> },
      { path: 'signup', element: <PublicRoute><SignUpPage /></PublicRoute> },
      { path: 'auth/callback', element: <AuthCallbackPage /> },

      // Rutas con headers específicos (Por ahora se mantienen fuera del MainLayout)
      { path: 'map', element: <ProtectedRoute><MapViewPage /></ProtectedRoute> },
      { path: 'parking/:id', element: <ProtectedRoute><ParkingDetailPage /></ProtectedRoute> },
      { path: 'book/:id', element: <ProtectedRoute><BookingPage /></ProtectedRoute> },
    ],
  },
]);
