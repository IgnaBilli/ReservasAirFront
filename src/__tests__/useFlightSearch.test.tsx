jest.mock('@/services/api', () => ({
  __esModule: true,
  flightsService: {
    getFlights: jest.fn(async () => ({ flights: [] })),
    getSeatsByFlightId: jest.fn(async () => ({
      seats: []
    }))
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
import { renderHook } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFlightSearch } from "../pages/FlightSearch/useFlightSearch";
import { ReactNode } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

function TestWrapper({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
}

describe("useFlightSearch", () => {
  it("should initialize with empty flights array", () => {
    const { result } = renderHook(() => useFlightSearch(), {
      wrapper: TestWrapper,
    });
    expect(result.current.flights).toEqual([]);
  });
});