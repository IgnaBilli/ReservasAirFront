import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/Button';
import { GlobalTimer } from '@/components/ui/GlobalTimer';
import { Modal } from '@/components/ui/Modal';
import { SeatMap } from './components/SeatMap';

const SeatsSelectionPage = () => {
  const navigate = useNavigate();
  const {
    selectedFlight,
    selectedSeats,
    occupiedSeats,
    setSelectedSeats,
    setCurrentStep,
    resetSelection
  } = useAppStore();

  const [showTimeUpModal, setShowTimeUpModal] = useState(false);

  useEffect(() => {
    if (!selectedFlight) {
      navigate('/');
      return;
    }
    setCurrentStep('seats');
  }, [selectedFlight, navigate, setCurrentStep]);

  const handleTimeUp = () => {
    setShowTimeUpModal(true);
  };

  const handleTimeUpConfirm = () => {
    setShowTimeUpModal(false);
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
      navigate('/confirmar-seleccion');
    }
  };

  if (!selectedFlight) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Header with Timer */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 bg-white rounded-xl p-4 shadow-sm">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4 lg:mb-0">
            Selección de Asiento
          </h1>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <GlobalTimer
              onTimeUp={handleTimeUp}
            />
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

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Instrucciones:</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Selecciona los asientos que desees</li>
                <li>• Puedes seleccionar múltiples asientos</li>
                <li>• Haz clic nuevamente para deseleccionar</li>
                <li>• Los precios varían según la clase</li>
              </ul>
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
                occupied={occupiedSeats}
                maxSelectable={999} // No limit
                onChange={setSelectedSeats}
              />
            </div>
          </div>
        </div>

        {/* Time Up Modal */}
        <Modal
          isOpen={showTimeUpModal}
          onClose={handleTimeUpConfirm}
          title="Tiempo Agotado"
          size="sm"
        >
          <div className="text-center">
            <div className="text-4xl mb-4 text-yellow-600">⚠️</div>
            <p className="text-gray-600 mb-6">
              El tiempo para seleccionar asientos ha expirado. Serás redirigido a la página de búsqueda para comenzar nuevamente.
            </p>
            <Button variant="primary" onClick={handleTimeUpConfirm}>
              Entendido
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default SeatsSelectionPage;