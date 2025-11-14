// src/pages/MyReservations/MyReservationsPage.tsx
import { useMyReservations } from './useMyReservations';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import CardReservation from '@/components/CardReservation';

const MyReservationsPage = () => {
  const {
    reservations,
    isLoading,
    error,
    cancellingId,
    handleBackToSearch,
    handleCancelReservation,
    handleRefreshReservations
  } = useMyReservations();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold text-gray-800 mb-4 md:mb-0">
            Mis Reservas
          </h1>
          <div className="flex gap-2">
            <Button 
              variant="secondary" 
              onClick={handleRefreshReservations}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Actualizar
            </Button>
            <Button variant="secondary" onClick={handleBackToSearch}>
              Buscar Nuevos Vuelos
            </Button>
          </div>
        </div>

        {/* Reservations List */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <Card className="text-center py-12">
            <h3 className="text-xl font-semibold text-red-600 mb-2">
              Error al cargar reservas
            </h3>
            <p className="text-gray-500 mb-6">
              No se pudieron cargar tus reservas. Por favor, intenta de nuevo más tarde.
            </p>
            <div className="mb-3 flex justify-center">
              <Button variant="primary" onClick={handleBackToSearch}>
                Buscar Vuelos
              </Button>
            </div>
          </Card>
        ) : reservations.length > 0 ? (
          <div className="space-y-6">
            {reservations.map(reservation => (
              <CardReservation
                key={reservation.reservationId}
                reservation={reservation}
                onCancelReservation={handleCancelReservation}
                isCancelling={cancellingId === reservation.reservationId}
              />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No tenés reservas aún
            </h3>
            <p className="text-gray-500 mb-6">
              Buscá y reserva tu próximo vuelo para verlo acá.
            </p>
            <div className="mb-3 flex justify-center">
              <Button variant="primary" onClick={handleBackToSearch}>
                Buscar Vuelos
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MyReservationsPage;