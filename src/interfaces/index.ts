// Tipos principales usados en la lógica de asientos
export type AircraftType = "E190" | "B737" | "A330";
export type CabinName = "economy" | "business" | "first";
export type SeatState = "available" | "occupied" | "reserved";

// Configuración de cada tipo de avión
export interface AircraftConfig {
  rows: number;
  blocks: string[];
  aislesAfterBlock: number[];
  cabins: CabinRange[];
}

// Estructura de un vuelo
export interface Flight {
  id: number;
  flightNumber: string;
  origin: {
    code: string;
    city: string;
    time: string;
  };
  destination: {
    code: string;
    city: string;
    time: string;
  };
  aircraft: AircraftType;
  aircraftModel: string;
  date: string;
  duration: string;
  price: number;
}

export interface FlightSeatAvailability {
  flightId: number;
  aircraftType: AircraftType;
  occupiedSeats: number[];
  reservedSeats: number[]; // Asientos temporalmente reservados
  lastUpdated: string;
}

// Estructura para definir rangos de cabinas y precios
export interface CabinRange {
  name: CabinName;
  fromRow: number;
  toRow: number;
  price: number;
}

// Updated reservation interface with flight data and multiple seats
export type Reservation = {
  reservationId: number;
  externalUserId: number;
  externalFlightId: number;
  flightData: {
    flightNumber: string;
    origin: {
      code: string;
      city: string;
      time: string;
    };
    destination: {
      code: string;
      city: string;
      time: string;
    };
    date: string;
    aircraftModel: string;
  };
  seats: Array<{
    seatId: number;
    seatNumber: string;
    cabinName: string;
    price: number;
  }>;
  totalPrice: number;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export interface CardReservationProps {
  reservation: Reservation;
}