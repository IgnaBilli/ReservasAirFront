import { create } from 'zustand';
import { Flight, Reservation } from '@/interfaces';

interface AppState {
	// Flight selection
	selectedFlight: Flight | null;
	flights: Flight[];

	// Seat selection
	selectedSeats: number[];
	occupiedSeats: number[];

	// Reservations
	reservations: Reservation[];

	// Global Timer
	timerStartTime: number | null;
	timerDuration: number; // in seconds (4 minutes = 240 seconds)
	isTimerActive: boolean;

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

	// Timer actions
	startTimer: () => void;
	stopTimer: () => void;
	getTimeLeft: () => number;

	resetSelection: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
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

	// Timer state
	timerStartTime: null,
	timerDuration: 120, // 2 minutes in seconds
	isTimerActive: false,

	isLoading: false,
	currentStep: 'search',

	// Actions
	setSelectedFlight: (flight) => {
		set({ selectedFlight: flight, currentStep: 'seats' });
		get().startTimer();
	},

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

	// Timer actions
	startTimer: () => set({
		timerStartTime: Date.now(),
		isTimerActive: true
	}),

	stopTimer: () => set({
		isTimerActive: false,
		timerStartTime: null
	}),

	getTimeLeft: () => {
		const state = get();
		if (!state.isTimerActive || !state.timerStartTime) return 0;

		const elapsed = Math.floor((Date.now() - state.timerStartTime) / 1000);
		const remaining = Math.max(0, state.timerDuration - elapsed);
		return remaining;
	},

	resetSelection: () => set({
		selectedFlight: null,
		selectedSeats: [],
		currentStep: 'search',
		// Stop timer when resetting
		isTimerActive: false,
		timerStartTime: null
	})
}));