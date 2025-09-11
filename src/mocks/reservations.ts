import { Reservation } from "@/interfaces";

export const reservations: Reservation[] = [
  {
    reservationId: 30,
    externalUserId: 1,
    externalFlightId: 1,
    seatId: 11,
    status: "PAID",
    createdAt: "2025-09-11T17:44:36.000Z",
    updatedAt: "2025-09-11T17:55:56.000Z",
    seatNumber: "1A"
  },
  {
    reservationId: 7,
    externalUserId: 1,
    externalFlightId: 1,
    seatId: 12,
    status: "CANCELLED",
    createdAt: "2025-09-11T18:02:32.000Z",
    updatedAt: "2025-09-11T18:16:56.000Z",
    seatNumber: "1B"
  }
];