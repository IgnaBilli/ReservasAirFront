import { Flight } from "@/interfaces";

export const mockFlights: Flight[] = [
  {
    id: 1,
    flightNumber: "AA1234",
    origin: {
      code: "EZE",
      city: "Buenos Aires",
      time: "14:30"
    },
    destination: {
      code: "SAME",
      city: "Mendoza", 
      time: "16:30"
    },
    aircraft: "A330",
    aircraftModel: "Airbus A330-200",
    date: "2025-09-15",
    duration: "2h 00m",
    price: 89000
  },
  {
    id: 2,
    flightNumber: "LA5678",
    origin: {
      code: "EZE",
      city: "Buenos Aires",
      time: "08:15"
    },
    destination: {
      code: "COR",
      city: "Córdoba",
      time: "09:45"
    },
    aircraft: "B737",
    aircraftModel: "Boeing 737-800",
    date: "2025-09-15",
    duration: "1h 30m",
    price: 75000
  },
  {
    id: 3,
    flightNumber: "AR9012",
    origin: {
      code: "EZE", 
      city: "Buenos Aires",
      time: "18:45"
    },
    destination: {
      code: "IGR",
      city: "Iguazú",
      time: "20:30"
    },
    aircraft: "E190",
    aircraftModel: "Embraer E190",
    date: "2025-09-15", 
    duration: "1h 45m",
    price: 95000
  },
  {
    id: 4,
    flightNumber: "FO3456",
    origin: {
      code: "EZE",
      city: "Buenos Aires", 
      time: "12:00"
    },
    destination: {
      code: "BRC",
      city: "Bariloche",
      time: "14:15"
    },
    aircraft: "A330",
    aircraftModel: "Airbus A330-200",
    date: "2025-09-15",
    duration: "2h 15m", 
    price: 120000
  },
  {
    id: 5,
    flightNumber: "JA7890",
    origin: {
      code: "EZE",
      city: "Buenos Aires",
      time: "06:30"
    },
    destination: {
      code: "SLA",
      city: "Salta",
      time: "08:45"
    },
    aircraft: "B737",
    aircraftModel: "Boeing 737-800", 
    date: "2025-09-15",
    duration: "2h 15m",
    price: 105000
  }
];