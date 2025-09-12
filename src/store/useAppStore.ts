import { create } from 'zustand';
import { Reservation } from '@/interfaces';
import { Flight } from '@/interfaces';

interface AppState {
	// Flight selection
	selectedFlight: Flight | null;
	flights: Flight[];

	// Seat selection
	selectedSeats: number[];
	occupiedSeats: number[];

	// Reservations
	reservations: Reservation[];

	// UI State
	isLoading: boolean;
	currentStep: 'search' | 'seats' | 'confirmation' | 'payment' | 'success';

	// Actions
	setSelectedFlight: (flight: Flight) => void;
	setSelectedSeats: (seats: number[]) => void;
	addReservation: (reservation: Reservation) => void;
	updateReservation: (id: number, updates: Partial<Reservation>) => void;
	setLoading: (loading: boolean) => void;
	setCurrentStep: (step: AppState['currentStep']) => void;
	resetSelection: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const useAppStore = create<AppState>((set, _get) => ({
	// Initial state
	selectedFlight: null,
	flights: [],
	selectedSeats: [],
	occupiedSeats: [1, 70, 2, 6, 7, 8, 9, 10, 15, 23, 45, 67, 89, 102],
	reservations: [
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
	],
	isLoading: false,
	currentStep: 'search',

	// Actions
	setSelectedFlight: (flight) => set({ selectedFlight: flight, currentStep: 'seats' }),

	setSelectedSeats: (seats) => set({ selectedSeats: seats }),

	addReservation: (reservation) => set((state) => ({
		reservations: [...state.reservations, reservation]
	})),

	updateReservation: (id, updates) => set((state) => ({
		reservations: state.reservations.map(res =>
			res.reservationId === id ? { ...res, ...updates } : res
		)
	})),

	setLoading: (loading) => set({ isLoading: loading }),

	setCurrentStep: (step) => set({ currentStep: step }),

	resetSelection: () => set({
		selectedFlight: null,
		selectedSeats: [],
		currentStep: 'search'
	})
}));