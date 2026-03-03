import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from '../../App';

const HomePage = lazy(() => import('../../pages/home/HomePage'));
const LoginPage = lazy(() => import('../../pages/auth/LoginPage'));
const SignUpPage = lazy(() => import('../../pages/auth/SignUpPage'));
const MapViewPage = lazy(() => import('../../pages/parking/MapViewPage').then(m => ({ default: m.MapViewPage })));
const ParkingDetailPage = lazy(() => import('../../pages/parking/ParkingDetailPage').then(m => ({ default: m.ParkingDetailPage })));
const BookingPage = lazy(() => import('../../pages/booking/BookingPage').then(m => ({ default: m.BookingPage })));
const UserProfilePage = lazy(() => import('../../pages/profile/UserProfilePage').then(m => ({ default: m.UserProfilePage })));
const OwnerProfilePage = lazy(() => import('../../pages/profile/OwnerProfilePage').then(m => ({ default: m.OwnerProfilePage })));
const AuthCallbackPage = lazy(() => import('../../pages/auth/AuthCallbackPage').then(m => ({ default: m.AuthCallbackPage })));
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
