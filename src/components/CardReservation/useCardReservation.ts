// src/components/CardReservation/useCardReservation.ts
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Reservation } from '@/interfaces';
import { authService } from '@/services/api';
import { useAppStore } from '@/store/useAppStore';
import { toast } from 'react-toastify';

interface UseCardReservationProps {
	reservation: Reservation;
	onCancelReservation: (reservationId: number) => void;
	isCancelling: boolean;
}

export const useCardReservation = ({
	reservation,
	onCancelReservation,
	isCancelling
}: UseCardReservationProps) => {
	const navigate = useNavigate();
	const [showCancelModal, setShowCancelModal] = useState(false);
	const [isVerifying, setIsVerifying] = useState(false);
	const { user } = useAppStore();

	// Calculate flight date from reservation date
	const flightDate = new Date(reservation.flightData.flightDate);
	const isFlightPast = flightDate < new Date();
	const canRequestRefund = reservation.status === "PAID";
	const canModifySeat = reservation.status !== "PAID" && reservation.status !== "CANCELLED";

	const handleModifySeat = () => {
		if (canModifySeat)
			navigate('/');
	};

	const handleRequestRefund = () => {
		setShowCancelModal(true);
	};

	const handleConfirmRefund = async () => {
		// Verificar si el usuario existe antes de proceder con el reembolso
		if (!user?.id) {
			toast.error("Error: Usuario no autenticado.", {
				closeButton: false,
				autoClose: 3000
			});
			setShowCancelModal(false);
			return;
		}

		setIsVerifying(true);

		try {
			const userCheckResult = await authService.checkUserExists(user.id);
			
			if (!userCheckResult.exists) {
				// Usuario no existe - cerrar sesión
				setShowCancelModal(false);
				setIsVerifying(false);
				
				toast.error("Tu usuario ya no existe en el sistema. Serás redirigido al login.", {
					closeButton: false,
					autoClose: 5000
				});

				// Esperar un momento para que el usuario vea el mensaje
				setTimeout(() => {
					useAppStore.getState().logout();
					navigate('/login');
				}, 2000);
				return;
			}

			// Si el usuario existe, proceder con el reembolso
			setShowCancelModal(false);
			setIsVerifying(false);
			onCancelReservation(reservation.reservationId);
		} catch (error) {
			setIsVerifying(false);
			console.error('Error al verificar usuario:', error);
			toast.error("Error al verificar los datos. Por favor intenta nuevamente.", {
				closeButton: false,
				autoClose: 3000
			});
			setShowCancelModal(false);
		}
	};

	const getStatusVariant = (status: string) => {
		switch (status) {
			case "PAID":
				return "success";
			case "CANCELLED":
				return "danger";
			default:
				return "default";
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case "PAID":
				return "Pagado";
			case "CANCELLED":
				return "Cancelado";
			default:
				return "Pendiente";
		}
	};

	// Format seat numbers for display
	const seatNumbers = reservation.seats.map(seat => seat.seatNumber).join(', ');
	const seatCount = reservation.seats.length;

	return {
		flightDate,
		isFlightPast,
		canRequestRefund,
		canModifySeat,
		showCancelModal,
		isProcessing: isCancelling,
		isVerifying,
		seatNumbers,
		seatCount,
		handleModifySeat,
		handleRequestRefund,
		handleConfirmRefund,
		setShowCancelModal,
		getStatusVariant,
		getStatusText
	};
};