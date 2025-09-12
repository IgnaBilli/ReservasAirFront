import { FlightSeatAvailability } from "@/interfaces";

// Función helper para generar asientos ocupados aleatorios
const generateRandomOccupiedSeats = (totalSeats: number, occupancyRate: number = 0.3): number[] => {
	const numOccupied = Math.floor(totalSeats * occupancyRate);
	const occupied: number[] = [];

	while (occupied.length < numOccupied) {
		const randomSeat = Math.floor(Math.random() * totalSeats) + 1;
		if (!occupied.includes(randomSeat)) {
			occupied.push(randomSeat);
		}
	}

	return occupied.sort((a, b) => a - b);
};

// Calcular total de asientos por tipo de aircraft
const getAircraftTotalSeats = (aircraftType: string): number => {
	switch (aircraftType) {
		case "E190": return 28 * 4; // 28 filas x 4 asientos por fila (AB CD)
		case "B737": return 30 * 6; // 30 filas x 6 asientos por fila (ABC DEF)
		case "A330": return 36 * 8; // 36 filas x 8 asientos por fila (AB CDEF GH)
		default: return 100;
	}
};

export const mockFlightSeatsAvailability: FlightSeatAvailability[] = [
	{
		flightId: 1001, // AA1234 - A330
		aircraftType: "A330",
		occupiedSeats: [1, 2, 8, 15, 23, 24, 45, 67, 89, 102, 134, 156, 178, 201, 223, 245, 267, 289],
		reservedSeats: [],
		lastUpdated: new Date().toISOString()
	},
	{
		flightId: 1002, // LA5678 - B737
		aircraftType: "B737",
		occupiedSeats: [3, 7, 12, 18, 25, 34, 41, 56, 67, 78, 89, 95, 112, 125, 134, 145, 167],
		reservedSeats: [],
		lastUpdated: new Date().toISOString()
	},
	{
		flightId: 1003, // VM2468 - E190 (VUELO COMPLETO)
		aircraftType: "E190",
		occupiedSeats: Array.from({ length: 112 }, (_, i) => i + 1), // Todos los asientos ocupados
		reservedSeats: [],
		lastUpdated: new Date().toISOString()
	},
	{
		flightId: 1004, // FO3456 - A330
		aircraftType: "A330",
		occupiedSeats: generateRandomOccupiedSeats(getAircraftTotalSeats("A330"), 0.25),
		reservedSeats: [],
		lastUpdated: new Date().toISOString()
	},
	{
		flightId: 1005, // JA7890 - B737
		aircraftType: "B737",
		occupiedSeats: generateRandomOccupiedSeats(getAircraftTotalSeats("B737"), 0.35),
		reservedSeats: [],
		lastUpdated: new Date().toISOString()
	},
	{
		flightId: 1006, // AR9012 - E190
		aircraftType: "E190",
		occupiedSeats: [1, 5, 9, 15, 23, 34, 45, 56, 67, 78, 89, 95, 103],
		reservedSeats: [],
		lastUpdated: new Date().toISOString()
	},
];

// Helper function para obtener disponibilidad por flight ID
export const getFlightSeatAvailability = (flightId: number): FlightSeatAvailability | undefined => {
	return mockFlightSeatsAvailability.find(availability => availability.flightId === flightId);
};

// Helper function para verificar si un vuelo está completo
export const isFlightFull = (flightId: number): boolean => {
	const availability = getFlightSeatAvailability(flightId);
	if (!availability) return false;

	const totalSeats = getAircraftTotalSeats(availability.aircraftType);
	return availability.occupiedSeats.length >= totalSeats;
};