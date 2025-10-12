import { type RouteObject } from 'react-router-dom';
import FlightSearchPage from '@/pages/FlightSearch/FlightSearchPage';
import SeatsSelectionPage from '@/pages/SeatsSelection/SeatsSelectionPage';
import ConfirmationPage from '@/pages/Confirmation/ConfirmationPage';
import MyReservationsPage from '@/pages/MyReservations/MyReservationsPage';
import LoginPage from '@/pages/Login/LoginPage';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export const routeConfig: RouteObject[] = [
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <FlightSearchPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/seleccionar-asientos/:id',
    element: (
      <ProtectedRoute>
        <SeatsSelectionPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/confirmar-seleccion/:id',
    element: (
      <ProtectedRoute>
        <ConfirmationPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/mis-reservas',
    element: (
      <ProtectedRoute>
        <MyReservationsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: (
      <ProtectedRoute>
        <FlightSearchPage />
      </ProtectedRoute>
    )
  }
];