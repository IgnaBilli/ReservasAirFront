import { create } from 'zustand';
import { Reservation, Flight, FlightSeatAvailability } from '@/interfaces';
import { reservations } from '@/mocks/reservations';
import { getFlightSeatAvailability } from '@/mocks/flightSeatsAvailability';

interface AppState {
	// Flight selection
	selectedFlight: Flight | null;
	flights: Flight[];
	currentFlightAvailability: FlightSeatAvailability | null;

	// Seat selection with persistence
	selectedSeats: number[];

	// Reservations
	reservations: Reservation[];

	// Global Timer
	timerStartTime: number | null;
	timerDuration: number; // in seconds (2 minutes = 120 seconds)
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

	// New actions for flight availability
	getCurrentFlightOccupiedSeats: () => number[];

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
	currentFlightAvailability: null,
	selectedSeats: [],
	reservations,

	// Timer state
	timerStartTime: null,
	timerDuration: 120, // 2 minutes in seconds
	isTimerActive: false,

	isLoading: false,
	currentStep: 'search',

	// Actions
	setSelectedFlight: (flight) => {
		const availability = getFlightSeatAvailability(flight.id);
		set({
			selectedFlight: flight,
			currentFlightAvailability: availability,
			currentStep: 'seats',
			selectedSeats: [] // Reset selected seats when changing flight
		});
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

	// New method to get occupied seats for current flight
	getCurrentFlightOccupiedSeats: () => {
		const state = get();
		return state.currentFlightAvailability?.occupiedSeats || [];
	},

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
		currentFlightAvailability: null,
		selectedSeats: [],
		currentStep: 'search',
		// Stop timer when resetting
		isTimerActive: false,
		timerStartTime: null
	})
}));