// src/store/useAppStore.ts
import { create } from 'zustand';
import { Flight, User } from '@/interfaces';
import { authService } from '@/services/api';

interface AppState {
	// Auth
	user: User | null;
	isAuthenticated: boolean;
	
	// User (legacy - will use user.id from auth)
	userId: number;

	// Flight selection
	selectedFlight: Flight | null;

	// Seat selection with persistence
	selectedSeats: number[];

	// Global Timer
	timerStartTime: number | null;
	timerDuration: number; // in seconds (2 minutes = 120 seconds)
	isTimerActive: boolean;
	isTimerPaused: boolean;

	// UI State
	isLoading: boolean;
	currentStep: 'search' | 'seats' | 'confirmation' | 'payment' | 'success';

	// Auth Actions
	setUser: (user: User | null) => void;
	logout: () => void;
	initAuth: () => void;

	// Actions
	setSelectedFlight: (flight: Flight) => void;
	setSelectedSeats: (seats: number[]) => void;
	setLoading: (loading: boolean) => void;
	setCurrentStep: (step: AppState['currentStep']) => void;

	// Timer actions
	startTimer: () => void;
	stopTimer: () => void;
	pauseTimer: () => void;
	getTimeLeft: () => number;

	resetSelection: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
	// Initial state
	user: null,
	isAuthenticated: authService.isAuthenticated(),
	userId: 1, // Legacy - will be replaced by user.id
	selectedFlight: null,
	selectedSeats: [],

	// Timer state
	timerStartTime: null,
	timerDuration: 120, // 2 minutes in seconds
	isTimerActive: false,
	isTimerPaused: false,

	isLoading: false,
	currentStep: 'search',

	// Auth Actions
	setUser: (user) => {
		// Persist user to localStorage when setting
		if (user) {
			authService.saveUser(user);
		}
		set({ 
			user, 
			isAuthenticated: user !== null,
			userId: user ? parseInt(user.id) : 1
		});
		
	},

	logout: () => {
		authService.logout();
		set({
			user: null,
			isAuthenticated: false,
			selectedFlight: null,
			selectedSeats: [],
			currentStep: 'search',
			isTimerActive: false,
			timerStartTime: null,
			isTimerPaused: false
		});
	},

	initAuth: () => {
		const isAuth = authService.isAuthenticated();
		const user = authService.getUser();
		set({ 
			isAuthenticated: isAuth,
			user: user,
			userId: user ? parseInt(user.id) : 1
		});
	},

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
		isTimerActive: true,
		isTimerPaused: false
	}),

	stopTimer: () => set({
		isTimerActive: false,
		timerStartTime: null,
		isTimerPaused: false
	}),

	pauseTimer: () => set({
		isTimerPaused: true
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
		timerStartTime: null,
		isTimerPaused: false
	})
}));