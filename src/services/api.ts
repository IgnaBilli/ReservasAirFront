// src/services/api.ts
const API_BASE_URL = "https://reservasairback-production.up.railway.app";

// Helper para manejar respuestas
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok)
    throw new Error(`HTTP error! status: ${response.status}`);
  return response.json();
}

// Flights Service
export const flightsService = {
  getFlights: async () => {
    const response = await fetch(`${API_BASE_URL}/flights`);
    return handleResponse(response);
  },

  getSeatsByFlightId: async (externalFlightId: number) => {
    const response = await fetch(`${API_BASE_URL}/seats/flight/${externalFlightId}`);
    return handleResponse(response);
  }
};

// Reservations Service
export const reservationsService = {
  getUserReservations: async (externalUserId: number) => {
    // Note: The endpoint pattern suggests we might need to use a specific flightId
    // For now, we'll fetch all user reservations
    // You might need to adjust this based on your backend requirements
    const response = await fetch(`${API_BASE_URL}/reservation/user/${externalUserId}`);
    // If the above doesn't work, you might need to fetch by specific flight IDs
    return handleResponse(response);
  },

  createReservation: async (externalFlightId: number, externalUserId: number, seatIds: number[]) => {
    const response = await fetch(
      `${API_BASE_URL}/reservation/book/${externalFlightId}/${externalUserId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
    });
    return handleResponse(response);
  }
};

// Payment Service
export const paymentService = {
  confirmPayment: async (reservationId: number, externalUserId: number) => {
    const response = await fetch(`${API_BASE_URL}/payment/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentStatus: "SUCCESS",
        reservationId,
        externalUserId
      })
    });
    return handleResponse(response);
  },

  cancelPayment: async (reservationId: number, externalUserId: number) => {
    const response = await fetch(`${API_BASE_URL}/payment/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentStatus: "REFUND",
        reservationId,
        externalUserId
      })
    });
    return handleResponse(response);
  }
};