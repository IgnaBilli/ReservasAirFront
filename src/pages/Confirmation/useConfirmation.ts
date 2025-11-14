// src/pages/Confirmation/useConfirmation.ts
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppStore } from '@/store/useAppStore';
import { reservationsService, paymentService, flightsService, authService } from '@/services/api';
import { getAircraftWithPrices } from '@/mocks/aircrafts';
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
	
	// Guardar datos localmente para que no se pierdan después del reset
	const [localFlight, setLocalFlight] = useState(selectedFlight);
	const [localSeats, setLocalSeats] = useState(selectedSeats);

	useEffect(() => {
		if (!selectedFlight || selectedSeats.length === 0) {
			// Si ya tenemos datos locales, no redirigir (estamos en proceso de pago)
			if (!localFlight || localSeats.length === 0) {
				navigate('/mis-reservas');
			}
			return;
		}
		setLocalFlight(selectedFlight);
		setLocalSeats(selectedSeats);
		setCurrentStep('confirmation');
	}, [selectedFlight, selectedSeats, navigate, setCurrentStep, localFlight, localSeats]);

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
			if (!localFlight) throw new Error('No flight selected');
			if (!user?.id) throw new Error('User not authenticated');

			// Create reservation (without confirming payment)
			const reservationResponse = await reservationsService.createReservation(
				localFlight.id,
				user.id,
				localSeats
			) as unknown as { reservationId: number };

			// Reset selection immediately after the request is sent (before response)
			resetSelection();

			return reservationResponse;
		},
		onSuccess: (data) => {
			const resId = data.reservationId;
			
			setLoading(false);
			setShowPaymentModal(false);
			stopTimer();
			
			toast.success("Reserva creada exitosamente. Pendiente de confirmación de pago.", {
				closeButton: false,
				autoClose: 3000
			});

			// Invalidar queries para que se actualice la lista de reservas
			queryClient.invalidateQueries({ queryKey: ['reservations'] });
			queryClient.invalidateQueries({ queryKey: ['seatAvailability'] });

			// Ir directo a mis reservas sin polling
			navigate('/mis-reservas');
			
			// Comentado: Start polling for payment confirmation
			// startPaymentPolling(resId);
		},
		onError: (error) => {
			setLoading(false);
			setShowPaymentModal(false);
			console.error('Error creating reservation:', error);
			
			// Check if the error is due to seats already taken
			if (error instanceof Error && error.message === 'SEATS_ALREADY_TAKEN') {
				toast.error("Los asientos seleccionados ya han sido reservados. Serás redirigido a la búsqueda de vuelos.", {
					closeButton: false,
					autoClose: 5000
				});
				
				// Invalidate queries to get fresh data
				queryClient.invalidateQueries({ queryKey: ['seatAvailability'] });
				queryClient.invalidateQueries({ queryKey: ['flights'] });
				
				// Reset selection and navigate back to flights page
				resetSelection();
				stopTimer();
				
				setTimeout(() => {
					navigate('/');
				}, 2000);
			} else {
				toast.error("Error al procesar la reserva. Por favor intente nuevamente.", {
					closeButton: false,
					autoClose: 3000
				});
			}
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
		navigate(`/seleccionar-asientos/${localFlight!.id}`);
	};

	const handleProceedToPayment = () => {
		setShowPaymentModal(true);
	};

	const handleConfirmPayment = async () => {
		if (!localFlight) return;

		setLoading(true);

		try {
			// 1. Primero verificar si el usuario existe
			if (!user?.id) {
				toast.error("Error: Usuario no autenticado.", {
					closeButton: false,
					autoClose: 3000
				});
				setLoading(false);
				setShowPaymentModal(false);
				return;
			}

			const userCheckResult = await authService.checkUserExists(user.id);
			
			if (!userCheckResult.exists) {
				// Usuario no existe - cerrar sesión
				setLoading(false);
				setShowPaymentModal(false);
				
				toast.error("Tu usuario ya no existe en el sistema. Serás redirigido al login.", {
					closeButton: false,
					autoClose: 5000
				});

				// Limpiar todo y cerrar sesión
				resetSelection();
				stopTimer();
				
				// Esperar un momento para que el usuario vea el mensaje
				setTimeout(() => {
					useAppStore.getState().logout();
					navigate('/login');
				}, 2000);
				return;
			}

			// 2. Verificar si el vuelo está cancelado antes de proceder
			const { cancelled } = await flightsService.checkFlightCancelled(localFlight.id);
			
			if (cancelled) {
				setLoading(false);
				setShowPaymentModal(false);
				
				toast.error("El vuelo ha sido cancelado. Serás redirigido a la búsqueda de vuelos.", {
					closeButton: false,
					autoClose: 5000
				});

				// Invalidar el cache de vuelos para obtener datos actualizados
				queryClient.invalidateQueries({ queryKey: ['flights'] });

				// Limpiar selección y volver a la página de vuelos
				resetSelection();
				stopTimer();
				navigate('/');
				return;
			}

			// Si el vuelo no está cancelado y el usuario existe, continuar con la reserva
			// Pausar el timer cuando se confirma el pago
			pauseTimer();
			createReservationMutation.mutate();
		} catch (error) {
			setLoading(false);
			console.error('Error al verificar estado del vuelo o usuario:', error);
			toast.error("Error al verificar los datos. Por favor intenta nuevamente.", {
				closeButton: false,
				autoClose: 3000
			});
		}
	};

	// Calculate seats with prices
	const getSeatsWithPrices = () => {
		if (!localFlight) return [];

		// Use flight's base price to calculate cabin prices
		const aircraftConfig = getAircraftWithPrices(
			localFlight.aircraft,
			localFlight.price
		);

		return localSeats.map(seatId => {
			const { row, letter } = seatNumToVisual(seatId, localFlight.aircraft);
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
		selectedFlight: localFlight,
		selectedSeats: localSeats,
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