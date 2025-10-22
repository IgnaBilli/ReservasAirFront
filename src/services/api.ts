// src/services/api.ts
import { FlightSeatAvailability, LoginRequest, LoginResponse } from '@/interfaces';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const AUTH_API_URL = 'https://grupo5-usuarios.vercel.app/api'

// Token management
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export const tokenManager = {
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },
  setToken: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
  },
  removeToken: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
  getUser: () => {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch (e) {
      console.error('Error parsing user data:', e);
      return null;
    }
  },
  setUser: (user: any): void => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

// Helper para manejar respuestas
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    // If unauthorized, remove token but do NOT redirect here.
    // Let the caller decide how to handle 401 to avoid full page reloads.
    if (response.status === 401) {
      tokenManager.removeToken();
    }
    // Try to get a useful message from the server
    let text: string | null = null;
    try {
      const t = await response.text();
      text = t && t.length ? t : null;
    } catch (e) {
      /* ignore */
    }
    throw new Error(text || `HTTP error! status: ${response.status}`);
  }

  // Some endpoints may return no content (204). Let callers handle that case.
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    // Return an empty object as unknown T if there's no JSON body
    // Caller can decide if that's acceptable.
    // @ts-ignore
    return {};
  }
  return response.json();
}

// Helper para crear headers con autenticación
function getAuthHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  const token = tokenManager.getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

// Auth Service
export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    console.log('authService.login()', { email: credentials.email });
    const response = await fetch(`${AUTH_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(credentials)
    });

    // If unauthorized, don't redirect; return a controlled error
    if (response.status === 401) {
      // Clear token if any
      tokenManager.removeToken();
      // Try to parse message
      let parsed: any = null;
      try {
        parsed = await response.json();
      } catch (e) {
        // not JSON
      }
      const message = parsed?.message || 'Credenciales inválidas';
      throw new Error(message);
    }

    if (!response.ok) {
      throw new Error(`Login error: ${response.status}`);
    }

    // If response has no JSON body (204), throw a clear error
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Login falló: respuesta sin contenido JSON');
    }

    const data = await response.json();
    return data as LoginResponse;
  },

  logout: () => {
    tokenManager.removeToken();
  },

  isAuthenticated: (): boolean => {
    return tokenManager.getToken() !== null;
  },

  getUser: () => {
    return tokenManager.getUser();
  },

  saveUser: (user: any) => {
    tokenManager.setUser(user);
  }
};

// Flights Service
export const flightsService = {
  getFlights: async (userId: string) => {
    console.log('Fetching flights for user:', userId);
    const response = await fetch(`${API_BASE_URL}/flight-cart/${userId}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getSeatsByFlightId: async (externalFlightId: number): Promise<FlightSeatAvailability> => {
    const response = await fetch(`${API_BASE_URL}/seats/flight/${externalFlightId}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<FlightSeatAvailability>(response);
  }
};

// Reservations Service
export const reservationsService = {
  getUserReservations: async (userId: string) => {
    // Note: The endpoint pattern suggests we might need to use a specific flightId
    // For now, we'll fetch all user reservations
    // You might need to adjust this based on your backend requirements
    console.log('Fetching reservations for user:', userId);
    const response = await fetch(`${API_BASE_URL}/reservation/user/${userId}`, {
      headers: getAuthHeaders(),
    });
    // If the above doesn't work, you might need to fetch by specific flight IDs
    return handleResponse(response);
  },

  createReservation: async (externalFlightId: number, userId: string, seatIds: number[]) => {
    const response = await fetch(
      `${API_BASE_URL}/reservation/book/${externalFlightId}/${userId}`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          seatIds,
        })
      }
    );
    return handleResponse(response);
  },

  cancelReservation: async (reservationId: number) => {
    const response = await fetch(`${API_BASE_URL}/reservation/cancel/${reservationId}`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  }
};

// Payment Service
export const paymentService = {
  confirmPayment: async (reservationId: number, userId: string) => {
    const response = await fetch(`${API_BASE_URL}/payment/confirm`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        paymentStatus: "SUCCESS",
        reservationId,
        externalUserId: userId
      })
    });
    return handleResponse(response);
  },

  cancelPayment: async (reservationId: number, userId: string) => {
    const response = await fetch(`${API_BASE_URL}/payment/cancel`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        paymentStatus: "REFUND",
        reservationId,
        externalUserId: userId
      })
    });
    return handleResponse(response);
  }
};