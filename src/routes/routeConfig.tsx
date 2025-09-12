import { type RouteObject } from 'react-router-dom';
import FlightSearchPage from '@/pages/FlightSearchPage';
import SeatsSelectionPage from '@/pages/SeatsSelectionPage';
import ConfirmationPage from '@/pages/ConfirmationPage';
import MyReservationsPage from '@/pages/MyReservationsPage';

export const routeConfig: RouteObject[] = [
  {
    path: '/',
    element: <FlightSearchPage />,
  },
  {
    path: '/seleccionar-asiento',
    element: <SeatsSelectionPage />,
  },
  {
    path: '/confirmar-seleccion',
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