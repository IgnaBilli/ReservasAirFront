import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AIRCRAFTS } from '@/mocks/aircrafts';
import { useAppStore } from '@/store/useAppStore';
import { seatNumToVisual, formatCurrency } from '@/utils';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { Timer } from '@/components/ui/Timer';
import { Modal } from '@/components/ui/Modal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

const ConfirmationPage = () => {
	const navigate = useNavigate();
	const {
		selectedFlight,
		selectedSeats,
		setCurrentStep,
		resetSelection,
		isLoading,
		setLoading,
		addReservation
	} = useAppStore();

	const [showTimeUpModal, setShowTimeUpModal] = useState(false);
	const [showPaymentModal, setShowPaymentModal] = useState(false);

	useEffect(() => {
		if (!selectedFlight || selectedSeats.length === 0) {
			navigate('/');
			return;
		}
		setCurrentStep('confirmation');
	}, [selectedFlight, selectedSeats, navigate, setCurrentStep]);

	const handleTimeUp = () => {
		setShowTimeUpModal(true);
	};

	const handleTimeUpConfirm = () => {
		setShowTimeUpModal(false);
		resetSelection();
		navigate('/');
	};

	const handleModifySeats = () => {
		// This will persist the selection since we're using the store
		navigate('/seleccionar-asiento');
	};

	const handleProceedToPayment = () => {
		setShowPaymentModal(true);
	};

	const handleConfirmPayment = async () => {
		setLoading(true);

		// Simular procesamiento de pago
		setTimeout(() => {
			// Crear reservas para cada asiento seleccionado
			selectedSeats.forEach((seatId, index) => {
				const seatNumber = (() => {
					const { row, letter } = seatNumToVisual(seatId, selectedFlight!.aircraft);
					return `${row}${letter}`;
				})();

				const newReservation = {
					reservationId: Date.now() + index,
					externalUserId: 1,
					externalFlightId: selectedFlight!.id,
					seatId: seatId,
					status: "PAID",
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
					seatNumber: seatNumber
				};

				addReservation(newReservation);
			});

			setLoading(false);
			setShowPaymentModal(false);
			setCurrentStep('success');

			navigate('/mis-reservas');
		}, 3000);
	};

	if (!selectedFlight || selectedSeats.length === 0) {
		return null;
	}

	const aircraftConfig = AIRCRAFTS[selectedFlight.aircraft];

	// Crear array de asientos con precios y ordenar por precio
	const seatsWithPrices = selectedSeats.map(seatId => {
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
	}).sort((a, b) => b.price - a.price); // Ordenar por precio descendente

	const totalPrice = seatsWithPrices.reduce((total, seat) => total + seat.price, 0);

	const getCabinName = (cabinName?: string) => {
		return cabinName === "first" ? "Primera Clase" :
			cabinName === "business" ? "business" : "Economica";
	};

	return (
		<div className="min-h-screen bg-gray-50 py-4">
			<div className="max-w-4xl mx-auto px-4">
				{/* Header with Timer */}
				<div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
					<h1 className="text-3xl font-semibold text-gray-800 mb-4 md:mb-0">
						Confirmación de Reserva
					</h1>
					<Timer
						initialMinutes={4}
						onTimeUp={handleTimeUp}
					/>
				</div>

				{/* Flight Summary */}
				<Card className="mb-6">
					<h2 className="text-xl font-semibold text-gray-800 mb-4">Detalles del Vuelo</h2>
					<div className="grid md:grid-cols-2 gap-4">
						<div>
							<p className="text-sm text-gray-600">Vuelo</p>
							<p className="font-semibold text-lg text-gray-800">{selectedFlight.flightNumber}</p>
						</div>
						<div>
							<p className="text-sm text-gray-600">Aeronave</p>
							<p className="font-semibold text-gray-800">{selectedFlight.aircraftModel}</p>
						</div>
						<div>
							<p className="text-sm text-gray-600">Origen</p>
							<p className="font-semibold text-gray-800">{selectedFlight.origin.city} ({selectedFlight.origin.code})</p>
							<p className="text-sm text-gray-600">{selectedFlight.origin.time}</p>
						</div>
						<div>
							<p className="text-sm text-gray-600">Destino</p>
							<p className="font-semibold text-gray-800">{selectedFlight.destination.city} ({selectedFlight.destination.code})</p>
							<p className="text-sm text-gray-600">{selectedFlight.destination.time}</p>
						</div>
					</div>
				</Card>

				{/* Selected Seats - Sorted by Price */}
				<Card className="mb-6">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-xl font-semibold text-gray-800">
							Asientos Seleccionados ({seatsWithPrices.length})
						</h2>
						<Button variant="secondary" size="sm" onClick={handleModifySeats}>
							Modificar Selección
						</Button>
					</div>

					<div className="space-y-3 overflow-auto max-h-72">
						{seatsWithPrices.map((seat) => (
							<div key={seat.seatId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
								<div className="flex items-center gap-4">
									<div className="w-10 h-10 bg-[#74B5CD] rounded-lg flex items-center justify-center text-white font-bold">
										{seat.letter}
									</div>
									<div>
										<p className="font-semibold text-lg text-gray-800">Asiento {seat.seatNumber}</p>
										<p className="text-sm text-gray-600">{getCabinName(seat.cabin?.name)}</p>
									</div>
								</div>
								<div className="text-right">
									<Chip variant="default">
										{formatCurrency(seat.price)}
									</Chip>
								</div>
							</div>
						))}
					</div>
				</Card>

				{/* Price Summary */}
				<Card className="mb-6">
					<h2 className="text-xl font-semibold text-gray-800 mb-4">Resumen de Precios</h2>
					<div className="space-y-2">
						<div className="flex justify-between text-gray-800">
							<span>Subtotal ({selectedSeats.length} asiento{selectedSeats.length !== 1 ? 's' : ''})</span>
							<span>{formatCurrency(totalPrice)}</span>
						</div>
						<div className="flex justify-between text-sm text-gray-600">
							<span>Tasas e impuestos</span>
							<span>Incluidos</span>
						</div>
						<div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-lg">
							<span className="text-gray-800">Total</span>
							<span className="text-[#74B5CD]">{formatCurrency(totalPrice)}</span>
						</div>
					</div>
				</Card>

				{/* Action Button - Only Proceed to Payment */}
				<div className="flex justify-center">
					<Button
						className="w-full"
						variant="primary"
						size="lg"
						onClick={handleProceedToPayment}
					>
						Proceder al Pago - {formatCurrency(totalPrice)}
					</Button>
				</div>

				{/* Payment Modal */}
				<Modal
					size="sm"
					hideCloseButton
					isOpen={showPaymentModal}
					onClose={() => setShowPaymentModal(false)}
				>
					<div className="text-center">
						{isLoading ? (
							<>
								<LoadingSpinner size="lg" className="mx-auto mb-4" />
								<h3 className="text-lg font-semibold mb-2 text-gray-800">Procesando Pago</h3>
								<p className="text-gray-600">Por favor espera mientras procesamos tu reserva...</p>
							</>
						) : (
							<>
								<div className="text-4xl mb-4 text-blue-600">💳</div>
								<p className="text-gray-600 mb-6">
									¿Confirmas el pago de {formatCurrency(totalPrice)} por {selectedSeats.length} asiento{selectedSeats.length !== 1 ? 's' : ''}?
								</p>
								<div className="flex gap-3 justify-center">
									<Button variant="secondary" onClick={() => setShowPaymentModal(false)}>
										Cancelar
									</Button>
									<Button
										variant="primary"
										onClick={handleConfirmPayment}
									>
										Confirmar Pago
									</Button>
								</div>
							</>
						)}
					</div>
				</Modal>

				{/* Time Up Modal */}
				<Modal
					size="sm"
					isOpen={showTimeUpModal}
					onClose={handleTimeUpConfirm}
					hideCloseButton
				>
					<div className="text-center">
						<div className="text-4xl mb-4 text-yellow-600">⚠️</div>
						<p className="text-gray-600 mb-6">
							El tiempo para completar la reserva ha expirado. <br /> Serás redirigido a la página de búsqueda.
						</p>
						<Button variant="primary" onClick={handleTimeUpConfirm} className="w-full">
							Entendido
						</Button>
					</div>
				</Modal>
			</div>
		</div>
	);
};

export default ConfirmationPage;