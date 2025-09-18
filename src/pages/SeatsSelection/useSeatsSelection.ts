// src/pages/SeatsSelection/useSeatsSelection.ts
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAppStore } from '@/store/useAppStore';
import { flightsService } from '@/services/api';

export const useSeatsSelection = () => {
	const navigate = useNavigate();
	const [showTimeUpModal, setShowTimeUpModal] = useState(false);
	const [showErrorModal, setShowErrorModal] = useState(false);

	const {
		selectedFlight,
		selectedSeats,
		setSelectedSeats,
		setCurrentStep,
		resetSelection
	} = useAppStore();

	// Fetch seat availability for the selected flight
	const {
		data: seatAvailability,
		isLoading,
		error
	} = useQuery({
		queryKey: ['seatAvailability', selectedFlight?.id],
		queryFn: () => flightsService.getSeatsByFlightId(selectedFlight!.id),
		enabled: !!selectedFlight?.id,
		staleTime: 1000 * 30, // 30 seconds - seats can change quickly
		refetchInterval: 1000 * 30, // Refetch every 30 seconds to get updates
	});

	useEffect(() => {
		if (!selectedFlight) {
			navigate('/');
			return;
		}
		setCurrentStep('seats');
	}, [selectedFlight, navigate, setCurrentStep]);

	useEffect(() => {
		if (error) {
			setShowErrorModal(true);
		}
	}, [error]);

	const handleTimeUp = () => {
		setShowTimeUpModal(true);
	};

	const handleTimeUpConfirm = () => {
		setShowTimeUpModal(false);
		resetSelection();
		navigate('/');
	};

	const handleErrorConfirm = () => {
		setShowErrorModal(false);
		resetSelection();
		navigate('/');
	};

	const handleBackToSearch = () => {
		resetSelection();
		navigate('/');
	};

	const handleViewReservations = () => {
		navigate('/mis-reservas');
	};

	const handleConfirmSelection = () => {
		if (selectedSeats.length > 0) {
			setCurrentStep('confirmation');
			navigate(`/confirmar-seleccion/${selectedFlight!.id}`);
		}
	};

	// Combine occupied and reserved seats from API
	const getOccupiedSeats = () => {
		if (!seatAvailability) return [];
		return [
			...(seatAvailability?.occupiedSeats || []),
			...(seatAvailability?.reservedSeats || [])
		];
	};

	return {
		selectedFlight,
		selectedSeats,
		occupiedSeats: getOccupiedSeats(),
		isLoading,
		error,
		showTimeUpModal,
		showErrorModal,
		handleTimeUp,
		handleTimeUpConfirm,
		handleErrorConfirm,
		handleBackToSearch,
		handleViewReservations,
		handleConfirmSelection,
		setSelectedSeats
	};
};