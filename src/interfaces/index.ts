// Tipos principales usados en la lógica de asientos
export type AircraftType = "E190" | "B737" | "A330";
export type CabinName = "Economy" | "Business" | "First";
export type SeatState = "available" | "occupied" | "reserved";

// Estructura para definir rangos de cabinas y precios
export interface CabinRange {
  name: CabinName;
  fromRow: number;
  toRow: number;
  price: number;
}

// Mis reservas
export type Reservation = {
  reservationId: number;
  externalUserId: number;
  externalFlightId: number;
  seatId: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  seatNumber: string;
};

export interface CardReservationProps {
  reservation: Reservation;
}
