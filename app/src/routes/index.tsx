import { createBrowserRouter } from 'react-router-dom';
import App from '../../app/App';
import { Home } from '../pages/HomePage';
import { Login } from '../pages/LoginPage';
import { SignUp } from '../pages/SignUpPage';
import { ParkingsPage } from '../pages/ParkingsPage';
import { ParkingDetailPage } from '../pages/ParkingDetailPage';
import { BookingPage } from '../pages/BookingPage';
import { ProfilePage } from '../pages/ProfilePage';
import { OwnerProfilePage } from '../pages/OwnerProfilePage';
import { AuthCallbackPage } from '../pages/AuthCallbackPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      // Rutas públicas
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <SignUp /> },
      { path: 'auth/callback', element: <AuthCallbackPage /> },

      // Rutas protegidas (requieren login)
      // En un futuro, envolveremos estas en un <ProtectedRoute />
      { index: true, element: <Home /> },
      { path: 'map', element: <ParkingsPage /> },
      {
        path: 'parking/:parkingId',
        element: <ParkingDetailPage />,
      },
      { path: 'book/:parkingId', element: <BookingPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'owner-profile', element: <OwnerProfilePage /> },

      // TODO: Añadir una página 404 Not Found
      // { path: '*', element: <NotFoundPage /> }
    ],
  },
]);
