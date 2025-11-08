/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/FlightSearch/useFlightSearch.ts
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAppStore } from '@/store/useAppStore';
import { flightsService } from '@/services/api';
import { Flight, AircraftType } from '@/interfaces';

// Helper function to generate flight number based on aircraft type
const generateFlightNumber = (aircraft: string, index: number): string => {
	const prefixes: Record<string, string> = {
		'A330': 'AA',
		'B737': 'LA',
		'E190': 'AR'
	};
	return `${prefixes[aircraft] || 'FL'}${1000 + index}`;
};

// Transform API response to match our Flight interface
// The new API returns: { externalUserId, flights: { success, message, externalUserId, flights: [...], flightCount } }
const transformFlightData = (apiData: any): Flight[] => {
	// Access the nested flights array
	const flightsArray = apiData?.flights?.flights || [];
	
	return flightsArray.map((flight: any, index: number) => ({
		id: flight.externalFlightId,
		flightNumber: generateFlightNumber(flight.aircraft, index),
		origin: {
			code: flight.origin.code,
			city: flight.origin.city,
			time: flight.origin.time
		},
		destination: {
			code: flight.destination.code,
			city: flight.destination.city,
			time: flight.destination.time
		},
		aircraft: flight.aircraft as AircraftType,
		aircraftModel: flight.aircraftModel,
		date: new Date(flight.flightDate).toISOString().split('T')[0],
		duration: flight.duration,
		price: 450, // Base price - will be adjusted based on cabin class
		freeSeats: flight.freeSeats,
		occupiedSeats: flight.occupiedSeats,
		flightStatus: flight.flightStatus
	}));
};

export const useFlightSearch = () => {
	const navigate = useNavigate();
	const { setSelectedFlight, user } = useAppStore();
	const userId = user?.id;

	// Fetch flights from API
	const {
		data: flightsData,
		isLoading,
		error,
		refetch
	} = useQuery({
		queryKey: ['flights', userId],
		queryFn: () => {
			if (!userId) throw new Error('User ID is required');
			return flightsService.getFlights(userId);
		},
		select: transformFlightData,
		staleTime: 1000 * 60 * 5, // 5 minutes
		enabled: !!userId, // Only run query if userId exists
	});

	const handleSelectFlight = (flight: Flight) => {
		// Check if flight is full based on free seats
		if (flight.freeSeats === 0) {
			return;
		}

		setSelectedFlight(flight);
		navigate(`/seleccionar-asientos/${flight.id}`);
	};

	const handleViewReservations = () => {
		navigate('/mis-reservas');
	};

	const isFlightFull = (flight: Flight) => {
		return flight.freeSeats === 0;
	};

	return {
		flights: flightsData || [],
		isLoading,
		error,
		refetch,
		handleSelectFlight,
		handleViewReservations,
		isFlightFull
	};
};