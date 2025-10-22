// src/pages/Confirmation/useConfirmation.ts
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppStore } from '@/store/useAppStore';
import { reservationsService, paymentService } from '@/services/api';
import { AIRCRAFTS } from '@/mocks/aircrafts';
import { seatNumToVisual } from '@/utils';
import { toast } from 'react-toastify';

export const useConfirmation = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const {
		user,
		selectedFlight,
		selectedSeats,
		setCurrentStep,
		resetSelection,
		isLoading,
		setLoading,
		stopTimer
	} = useAppStore();

	const [showTimeUpModal, setShowTimeUpModal] = useState(false);
	const [showPaymentModal, setShowPaymentModal] = useState(false);

	useEffect(() => {
		if (!selectedFlight || selectedSeats.length === 0) {
			navigate('/mis-reservas');
			return;
		}
		setCurrentStep('confirmation');
	}, [selectedFlight, selectedSeats, navigate, setCurrentStep]);

	// Mutation for creating reservation
	const createReservationMutation = useMutation({
		mutationFn: async () => {
			if (!selectedFlight) throw new Error('No flight selected');
			if (!user?.id) throw new Error('User not authenticated');

			// Step 1: Create reservation
			const reservationResponse = await reservationsService.createReservation(
				selectedFlight.id,
				user.id,
				selectedSeats
			) as unknown as { reservationId: number }; // Type as any to avoid TS error

			// Extract reservationId from response
			// Assuming the response includes the reservation details or ID
			const newReservationId = reservationResponse.reservationId ||
				Math.floor(Date.now() / 1000); // Fallback to timestamp

			// Step 2: Confirm payment
			await paymentService.confirmPayment(newReservationId, user.id);

			return reservationResponse;
		},
		onSuccess: () => {
			// Invalidate queries to refresh data
			queryClient.invalidateQueries({ queryKey: ['reservations'] });
			queryClient.invalidateQueries({ queryKey: ['seatAvailability'] });

			setLoading(false);
			setShowPaymentModal(false);
			setCurrentStep('success');
			stopTimer();
			resetSelection();

			toast.success("Reserva efectuada con éxito", {
				closeButton: false,
				autoClose: 3000
			});

			navigate('/mis-reservas');
		},
		onError: (error) => {
			setLoading(false);
			console.error('Error creating reservation:', error);
			toast.error("Error al procesar la reserva. Por favor intente nuevamente.", {
				closeButton: false,
				autoClose: 3000
			});
		}
	});

	const handleTimeUp = () => {
		setShowTimeUpModal(true);
	};

	const handleTimeUpConfirm = () => {
		setShowTimeUpModal(false);
		resetSelection();
		navigate('/');
	};

	const handleModifySeats = () => {
		navigate(`/seleccionar-asientos/${selectedFlight!.id}`);
	};

	const handleProceedToPayment = () => {
		setShowPaymentModal(true);
	};

	const handleConfirmPayment = async () => {
		setLoading(true);
		createReservationMutation.mutate();
	};

	// Calculate seats with prices
	const getSeatsWithPrices = () => {
		if (!selectedFlight) return [];

		const aircraftConfig = AIRCRAFTS[selectedFlight.aircraft];

		return selectedSeats.map(seatId => {
			const { row, letter } = seatNumToVisual(seatId, selectedFlight.aircraft);
			const cabin = aircraftConfig.cabins.find(c => row >= c.fromRow && row <= c.toRow);
			return {
				seatId,
				row,
				letter,
				seatNumber: `${row}${letter}`,
				cabin,
				price: cabin?.price || 0
			};
		}).sort((a, b) => b.price - a.price);
	};

	const seatsWithPrices = getSeatsWithPrices();
	const totalPrice = seatsWithPrices.reduce((total, seat) => total + seat.price, 0);

	const getCabinName = (cabinName?: string) => {
		return cabinName === "first" ? "Primera Clase" :
			cabinName === "business" ? "Business" : "Economica";
	};

	return {
		selectedFlight,
		selectedSeats,
		seatsWithPrices,
		totalPrice,
		isLoading,
		showTimeUpModal,
		showPaymentModal,
		handleTimeUp,
		handleTimeUpConfirm,
		handleModifySeats,
		handleProceedToPayment,
		handleConfirmPayment,
		setShowPaymentModal,
		getCabinName
	};
};