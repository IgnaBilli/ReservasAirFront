import { type RouteObject } from 'react-router-dom';
import FlightSearchPage from '@/pages/FlightSearch/FlightSearchPage';
import SeatsSelectionPage from '@/pages/SeatsSelection/SeatsSelectionPage';
import ConfirmationPage from '@/pages/Confirmation/ConfirmationPage';
import MyReservationsPage from '@/pages/MyReservations/MyReservationsPage';

export const routeConfig: RouteObject[] = [
  {
    path: '/',
    element: <FlightSearchPage />,
  },
  {
    path: '/seleccionar-asientos/:id',
    element: <SeatsSelectionPage />,
  },
  {
    path: '/confirmar-seleccion/:id',
    element: <ConfirmationPage />,
  },
  {
    path: '/mis-reservas',
    element: <MyReservationsPage />,
  },
  {
    path: '*',
    element: <FlightSearchPage />
  }
];