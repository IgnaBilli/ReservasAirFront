// src/pages/Confirmation/useConfirmation.ts
import { useEffect, useState, useRef } from 'react';
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
		stopTimer,
		pauseTimer
	} = useAppStore();

	const [showTimeUpModal, setShowTimeUpModal] = useState(false);
	const [showPaymentModal, setShowPaymentModal] = useState(false);
	const [isWaitingPayment, setIsWaitingPayment] = useState(false);
	const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		if (!selectedFlight || selectedSeats.length === 0) {
			navigate('/mis-reservas');
			return;
		}
		setCurrentStep('confirmation');
	}, [selectedFlight, selectedSeats, navigate, setCurrentStep]);

	// Cleanup polling on unmount
	useEffect(() => {
		return () => {
			if (pollingIntervalRef.current) {
				clearInterval(pollingIntervalRef.current);
			}
		};
	}, []);

	// Start polling for payment status (both success and failed)
	const startPaymentPolling = (resId: number) => {
		console.log('🔄 Iniciando polling para reserva:', resId);
		setIsWaitingPayment(true);
		
		// Clear any existing interval
		if (pollingIntervalRef.current) {
			clearInterval(pollingIntervalRef.current);
		}

		// Poll every 5 seconds
		pollingIntervalRef.current = setInterval(async () => {
			try {
				// Check both endpoints simultaneously - el que responda true primero gana
				const [successResponse, failedResponse] = await Promise.all([
					paymentService.checkPaymentStatus(resId).catch(err => {
						console.error('Error checking success status:', err);
						return { success: false };
					}),
					paymentService.checkPaymentFailed(resId).catch(err => {
						console.error('Error checking failed status:', err);
						return { success: false };
					})
				]) as [{ success: boolean }, { success: boolean }];
				
				// Check if payment was confirmed (success endpoint returns true)
				if (successResponse.success) {
					console.log('✅ Pago confirmado!');
					
					// Stop polling
					if (pollingIntervalRef.current) {
						clearInterval(pollingIntervalRef.current);
						pollingIntervalRef.current = null;
					}

					setIsWaitingPayment(false);

					// Invalidate queries to refresh data
					queryClient.invalidateQueries({ queryKey: ['reservations'] });
					queryClient.invalidateQueries({ queryKey: ['seatAvailability'] });

					setLoading(false);
					setShowPaymentModal(false);
					setCurrentStep('success');
					stopTimer();
					resetSelection();

					toast.success("Pago confirmado con éxito", {
						closeButton: false,
						autoClose: 3000
					});

					navigate('/mis-reservas');
				} 
				// Check if payment failed (failed endpoint returns true)
				else if (failedResponse.success) {
					console.log('❌ Pago falló!');
					
					// Stop polling
					if (pollingIntervalRef.current) {
						clearInterval(pollingIntervalRef.current);
						pollingIntervalRef.current = null;
					}

					setIsWaitingPayment(false);
					setLoading(false);
					setShowPaymentModal(false);

					toast.error("El pago ha fallado. Por favor intenta nuevamente.", {
						closeButton: false,
						autoClose: 5000
					});

					// Redirect to reservations to see status
					navigate('/mis-reservas');
				}
				// Both returned false - payment still pending
				else {
					console.log('⏳ Pago aún pendiente...');
				}
			} catch (error) {
				console.error('❌ Error al verificar estado del pago:', error);
			}
		}, 5000); // Poll every 5 seconds
	};

	// Mutation for creating reservation
	const createReservationMutation = useMutation({
		mutationFn: async () => {
			if (!selectedFlight) throw new Error('No flight selected');
			if (!user?.id) throw new Error('User not authenticated');

			// Create reservation (without confirming payment)
			const reservationResponse = await reservationsService.createReservation(
				selectedFlight.id,
				user.id,
				selectedSeats
			) as unknown as { reservationId: number };

			return reservationResponse;
		},
		onSuccess: (data) => {
			const resId = data.reservationId;
			
			setLoading(false);
			
			toast.info("Reserva creada. Esperando confirmación de pago...", {
				closeButton: false,
				autoClose: 3000
			});

			// Start polling for payment confirmation
			startPaymentPolling(resId);
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
		// Pausar el timer cuando se confirma el pago
		pauseTimer();
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
		isWaitingPayment,
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