// src/pages/SeatsSelection/SeatsSelectionPage.tsx
import { useSeatsSelection } from './useSeatsSelection';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { GlobalTimer } from '@/components/ui/GlobalTimer';
import { Modal } from '@/components/ui/Modal';
import { SeatMap } from './components/SeatMap';

const SeatsSelectionPage = () => {
  const {
    selectedFlight,
    selectedSeats,
    occupiedSeats,
    isLoading,
    showTimeUpModal,
    showErrorModal,
    handleTimeUp,
    handleTimeUpConfirm,
    handleErrorConfirm,
    handleBackToSearch,
    handleViewReservations,
    handleConfirmSelection,
    setSelectedSeats
  } = useSeatsSelection();

  if (!selectedFlight) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Header with Timer */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 bg-white rounded-xl p-4 shadow-sm">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4 lg:mb-0">
            Selección de Asiento - Vuelo {selectedFlight.flightNumber}
          </h1>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <GlobalTimer onTimeUp={handleTimeUp} />
            <Button variant="secondary" onClick={handleViewReservations}>
              Mis Reservas
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left Panel - Flight Info and Controls */}
          <div className="lg:col-span-4 space-y-4">
            {/* Flight Info Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <div className="w-6 h-6 bg-[#74B5CD] rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✈</span>
                  </div>
                  <span className="font-semibold text-lg text-gray-800">Vuelo {selectedFlight.flightNumber}</span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-800">{selectedFlight.origin.city}</p>
                      <p className="text-sm text-gray-600">{selectedFlight.origin.code} • {selectedFlight.origin.time}</p>
                    </div>
                    <div className="flex items-center">
                      <div className="w-8 h-0.5 bg-[#74B5CD]"></div>
                      <div className="w-2 h-2 bg-[#74B5CD] transform rotate-45 mx-1"></div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-800">{selectedFlight.destination.city}</p>
                      <p className="text-sm text-gray-600">{selectedFlight.destination.code} • {selectedFlight.destination.time}</p>
                    </div>
                  </div>

                  <div className="border-t pt-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Aeronave</p>
                        <p className="font-semibold text-gray-800">{selectedFlight.aircraftModel}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Tipo</p>
                        <p className="font-semibold text-gray-800">{selectedFlight.aircraft}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Duración</p>
                        <p className="font-semibold text-gray-800">{selectedFlight.duration}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Fecha</p>
                        <p className="font-semibold text-gray-800">{selectedFlight.date}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Availability Info Card */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <span className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </span>
                Disponibilidad
              </h3>
              <div className="text-sm text-gray-700">
                <p><span className="font-medium">{occupiedSeats.length}</span> asientos ocupados</p>
                <p><span className="font-medium">{selectedSeats.length}</span> asiento{selectedSeats.length !== 1 ? 's' : ''} seleccionado{selectedSeats.length !== 1 ? 's' : ''}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                variant="secondary"
                onClick={handleBackToSearch}
                className="w-full"
              >
                ← Volver a Búsqueda
              </Button>

              {selectedSeats.length > 0 && (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleConfirmSelection}
                  className="w-full"
                >
                  Continuar con {selectedSeats.length} asiento{selectedSeats.length !== 1 ? 's' : ''}
                </Button>
              )}
            </div>
          </div>

          {/* Right Panel - Seat Map */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-xl shadow-sm h-full">
              <SeatMap
                aircraft={selectedFlight.aircraft}
                flightBasePrice={selectedFlight.price}
                occupied={occupiedSeats}
                initialSelected={selectedSeats}
                onChange={setSelectedSeats}
              />
            </div>
          </div>
        </div>

        {/* Time Up Modal */}
        <Modal
          size="sm"
          isOpen={showTimeUpModal}
          onClose={handleTimeUpConfirm}
          title="Tiempo Agotado"
          hideCloseButton
        >
          <div className="text-center">
            <div className="text-4xl mb-4 text-yellow-600">⚠️</div>
            <p className="text-gray-600 mb-6">
              El tiempo para seleccionar asientos ha expirado. <br />
              Serás redirigido a la página de búsqueda.
            </p>
            <Button variant="primary" onClick={handleTimeUpConfirm} className="w-full">
              Entendido
            </Button>
          </div>
        </Modal>

        {/* Error Modal */}
        <Modal
          size="sm"
          isOpen={showErrorModal}
          onClose={handleErrorConfirm}
          title="Error de Conexión"
          hideCloseButton
        >
          <div className="text-center">
            <div className="text-4xl mb-4 text-red-600">⚠️</div>
            <p className="text-gray-600 mb-6">
              No se pudo cargar la disponibilidad de asientos. <br />
              Por favor, intenta nuevamente más tarde.
            </p>
            <Button variant="primary" onClick={handleErrorConfirm} className="w-full">
              Aceptar
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default SeatsSelectionPage;