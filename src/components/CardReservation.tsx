import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { formatDate, formatCurrency } from '@/utils';
import { Reservation } from '@/interfaces';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { toast } from 'react-toastify';

interface CardReservationProps {
  reservation: Reservation;
}

const CardReservation = ({ reservation }: CardReservationProps) => {
  const navigate = useNavigate();
  const { updateReservation } = useAppStore();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate flight date from reservation date
  const flightDate = new Date(reservation.flightData.date);
  const isFlightPast = flightDate < new Date();
  const canRequestRefund = reservation.status === "PAID" && !isFlightPast;
  const canModifySeat = reservation.status !== "PAID" && reservation.status !== "CANCELLED";

  const handleModifySeat = () => {
    if (canModifySeat) {
      navigate('/');
    }
  };

  const handleRequestRefund = () => {
    setShowCancelModal(true);
  };

  const handleConfirmRefund = async () => {
    setIsProcessing(true);
    setShowCancelModal(false);

    setTimeout(() => {
      updateReservation(reservation.reservationId, {
        status: "CANCELLED",
        updatedAt: new Date().toISOString()
      });
      setIsProcessing(false);
      toast.success("Reembolso solicitado con éxito", {
        closeButton: false,
        autoClose: 3000
      });
    }, 2000);
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

  return (
    <>
      <Card className="relative">
        <div className="grid md:grid-cols-12 gap-4 items-start">
          {/* Reservation Info */}
          <div className="md:col-span-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-[#74B5CD] rounded-full flex items-center justify-center">
                <span className="text-white text-sm">✈</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                Reserva #{String(reservation.reservationId).padStart(8, '0')}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm mb-4">
              <div>
                <p className="text-gray-600 mb-1">📅 Fecha de Reserva</p>
                <p className="font-semibold text-gray-800">{formatDate(reservation.createdAt)}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">💺 Asiento{seatCount > 1 ? 's' : ''}</p>
                <p className="font-semibold text-lg text-gray-800" title={seatNumbers}>
                  {seatCount > 3 ? `${reservation.seats.slice(0, 3).map(s => s.seatNumber).join(', ')}...` : seatNumbers}
                </p>
                {seatCount > 1 && (
                  <p className="text-xs text-gray-500">{seatCount} asientos</p>
                )}
              </div>
              <div>
                <p className="text-gray-600 mb-1">💰 Total</p>
                <p className="font-semibold text-lg text-gray-800">{formatCurrency(reservation.totalPrice)}</p>
              </div>
            </div>

            {/* Flight Details - Real Data */}
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700">
                <span className="font-semibold">Vuelo: {reservation.flightData.flightNumber}</span>
                <span>{reservation.flightData.origin.code} → {reservation.flightData.destination.code}</span>
                <span>{reservation.flightData.origin.time} - {reservation.flightData.destination.time}</span>
                <span>{formatDate(reservation.flightData.date)}</span>
              </div>
              <div className="mt-1 text-xs text-gray-600">
                {reservation.flightData.origin.city} → {reservation.flightData.destination.city}
              </div>
            </div>

            {/* Seat Details - Expandable for multiple seats */}
            {seatCount > 1 && (
              <div className="mt-3">
                <details className="text-sm">
                  <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
                    Ver detalles de asientos ({seatCount})
                  </summary>
                  <div className="mt-2 space-y-1 pl-4 overflow-auto max-h-40">
                    {reservation.seats.map((seat) => (
                      <div key={seat.seatId} className="flex justify-between items-center">
                        <span className="text-gray-700">{seat.seatNumber} - {seat.cabinName}</span>
                        <span className="text-gray-600">{formatCurrency(seat.price)}</span>
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="md:col-span-4 space-y-3">
            <div className="flex justify-end mb-4">
              <Chip
                variant={getStatusVariant(reservation.status)}
                size="md"
              >
                {getStatusText(reservation.status)}
              </Chip>
            </div>

            <div className="space-y-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleModifySeat}
                className="w-full"
                disabled={!canModifySeat || isProcessing}
              >
                Modificar Asiento →
              </Button>

              {!canModifySeat && reservation.status === "PAID" && (
                <div className="text-xs text-gray-500 text-center">
                  Los asientos pagados no pueden modificarse
                </div>
              )}

              {canRequestRefund && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleRequestRefund}
                  className="w-full"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <LoadingSpinner size="sm" />
                      Procesando...
                    </>
                  ) : (
                    "Solicitar Reembolso →"
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Processing Overlay */}
        {isProcessing && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-xl">
            <div className="text-center">
              <LoadingSpinner size="md" className="mx-auto mb-2" />
              <p className="text-sm text-gray-600">Procesando reembolso...</p>
            </div>
          </div>
        )}
      </Card>

      {/* Refund Confirmation Modal */}
      <Modal
        size="sm"
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Solicitar Reembolso"
        hideCloseButton
      >
        <div className="text-center">
          <p className="text-gray-600 mb-6">
            ¿Estás seguro que deseas cancelar la reserva #{String(reservation.reservationId).padStart(8, '0')} y solicitar el reembolso? <br /> Esta acción no se puede deshacer.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmRefund}
            >
              Confirmar Reembolso
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default CardReservation;