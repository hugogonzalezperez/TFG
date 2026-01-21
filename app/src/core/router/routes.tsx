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

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      // Rutas públicas
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignUpPage /> },
      { path: 'auth/callback', element: <AuthCallbackPage /> },

      // Rutas protegidas (aunque por ahora son accesibles, el AuthContext o la página redirigirá)
      { index: true, element: <HomePage /> },
      { path: 'map', element: <MapViewPage /> },
      { path: 'parking/:id', element: <ParkingDetailPage /> },
      { path: 'book/:id', element: <BookingPage /> },
      { path: 'profile', element: <UserProfilePage /> },
      { path: 'owner-profile', element: <OwnerProfilePage /> },
    ],
  },
]);
