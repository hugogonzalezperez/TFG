import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ErrorPage } from '../../pages/errors/ErrorPage';
import App from '../../App';
import { isNative } from '@/mobile';

// Load platform-specific home: NativeHomePage on Android, HomePage on web.
// True code-splitting — the unused bundle is never downloaded.
const HomePage = isNative()
  ? lazy(() => import('../../pages/home/NativeHomePage'))
  : lazy(() => import('../../pages/home/HomePage'));
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
    errorElement: <ErrorPage />,
    children: [
      // Rutas con Layout Principal (Header compartido)
      {
        element: <MainLayout />,
        children: [
          { index: true, element: <HomePage /> },
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
      { path: 'register', element: <Navigate to="/signup" replace /> },
      { path: 'login', element: <PublicRoute><LoginPage /></PublicRoute> },
      { path: 'signup', element: <PublicRoute><SignUpPage /></PublicRoute> },
      { path: 'auth/callback', element: <AuthCallbackPage /> },

      // Rutas con headers específicos (Por ahora se mantienen fuera del MainLayout)
      { path: 'map', element: <MapViewPage /> },
      { path: 'parking/:id', element: <ParkingDetailPage /> },
      { path: 'book/:id', element: <ProtectedRoute><BookingPage /></ProtectedRoute> },
    ],
  },
]);
