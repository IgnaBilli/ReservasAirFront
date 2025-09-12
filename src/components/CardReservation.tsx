import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { formatDate } from '@/utils';
import { Reservation } from '@/interfaces';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface CardReservationProps {
  reservation: Reservation;
}

const CardReservation = ({ reservation }: CardReservationProps) => {
  const navigate = useNavigate();
  const { updateReservation } = useAppStore();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Simular fecha de vuelo (para el ejemplo, usamos fecha futura)
  const flightDate = new Date();
  flightDate.setDate(flightDate.getDate() + 7); // 7 días desde hoy

  const isFlightPast = flightDate < new Date();
  const canRequestRefund = reservation.status === "PAID" && !isFlightPast;
  const canModifySeat = reservation.status !== "PAID" && reservation.status !== "CANCELLED";

  const handleModifySeat = () => {
    // Solo permite modificar si no está pagado
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

    // Simular procesamiento del reembolso
    setTimeout(() => {
      updateReservation(reservation.reservationId, {
        status: "CANCELLED",
        updatedAt: new Date().toISOString()
      });
      setIsProcessing(false);
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

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-600 mb-1">📅 Fecha de Reserva</p>
                <p className="font-semibold text-gray-800">{formatDate(reservation.createdAt)}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">💺 Asiento</p>
                <p className="font-semibold text-lg text-gray-800">{reservation.seatNumber}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">🎫 Estado</p>
                <Chip variant={getStatusVariant(reservation.status)}>
                  {getStatusText(reservation.status)}
                </Chip>
              </div>
            </div>

            {/* Flight Details Mock */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4 text-sm text-gray-700">
                <span className="font-semibold">Vuelo: AA1234</span>
                <span>EZE → SAME</span>
                <span>14:30 - 16:30</span>
                <span>{formatDate(flightDate.toISOString())}</span>
              </div>
            </div>
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
                variant={canModifySeat ? "secondary" : "secondary"}
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
            ¿Estás seguro que deseas cancelar la reserva #{String(reservation.reservationId).padStart(8, '0')} y solicitar el reembolso? Esta acción no se puede deshacer.
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