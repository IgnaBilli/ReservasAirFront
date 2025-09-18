// src/store/useAppStore.ts
import { create } from 'zustand';
import { Flight } from '@/interfaces';

interface AppState {
	// User
	userId: number; // For this example, we'll use a fixed userId

	// Flight selection
	selectedFlight: Flight | null;

	// Seat selection with persistence
	selectedSeats: number[];

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
	userId: 1, // Fixed user ID for demo purposes
	selectedFlight: null,
	selectedSeats: [],

	// Timer state
	timerStartTime: null,
	timerDuration: 240, // 2 minutes in seconds
	isTimerActive: false,

	isLoading: false,
	currentStep: 'search',

	// Actions
	setSelectedFlight: (flight) => {
		set({
			selectedFlight: flight,
			currentStep: 'seats',
			selectedSeats: [] // Reset selected seats when changing flight
		});
		get().startTimer();
	},

	setSelectedSeats: (seats) => set({ selectedSeats: seats }),

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