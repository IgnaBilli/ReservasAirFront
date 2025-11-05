// src/components/CardReservation/useCardReservation.ts
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Reservation } from '@/interfaces';

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

	const handleConfirmRefund = () => {
		setShowCancelModal(false);
		onCancelReservation(reservation.reservationId);
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