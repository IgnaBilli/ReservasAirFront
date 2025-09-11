import { type RouteObject } from 'react-router-dom';
import SeatSelect from '@/pages/SeatSelect';
import Reservations from '@/pages/Reservations';

export const routeConfig: RouteObject[] = [
  // Public routes
  {
    path: '/selectseat',
    element: <SeatSelect />,
  },

  {
    path: '/reservations',
    element: <Reservations />,
  },

  // Private routes
  {
    path: '/',
    element: (
      <SeatSelect />
    ),
    children: [

    ],
  },

  // Catch all - moved to end and changed to SeatSelect
  { path: '*', element: <SeatSelect /> },
];
