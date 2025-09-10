import { type RouteObject } from 'react-router-dom';
import SeatSelect from '@/pages/SeatSelect';

export const routeConfig: RouteObject[] = [
  // Public routes
  {
    path: '/selectseat',
    element: <SeatSelect />,
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
