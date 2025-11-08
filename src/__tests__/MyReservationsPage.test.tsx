
jest.mock('@/services/api', () => ({
  __esModule: true,
  flightsService: {
    getFlights: jest.fn(async () => ({ flights: [] }))
  },
  reservationsService: {
    getUserReservations: jest.fn(async () => ({ reservations: [] })),
    createReservation: jest.fn(async () => ({})),
    cancelReservation: jest.fn(async () => ({}))
  },
  authService: {
    login: jest.fn(),
    logout: jest.fn(),
    isAuthenticated: jest.fn(() => true),
    getUser: jest.fn(() => ({ id: 1 })),
    saveUser: jest.fn()
  }
}));
import { render, screen } from "@testing-library/react";
import MyReservationsPage from "../pages/MyReservations/MyReservationsPage";
import '@testing-library/jest-dom';
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

describe("MyReservationsPage", () => {
  test("muestra el título de la página", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MyReservationsPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByText(/mis reservas/i)).toBeInTheDocument();
  });
});

