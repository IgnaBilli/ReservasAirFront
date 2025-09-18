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
    handleCancelReservation
  } = useMyReservations();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold text-gray-800 mb-4 md:mb-0">
            Mis Reservas
          </h1>
          <Button variant="secondary" onClick={handleBackToSearch}>
            Buscar Nuevos Vuelos
          </Button>
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