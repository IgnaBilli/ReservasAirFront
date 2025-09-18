// src/pages/FlightSearch/FlightSearchPage.tsx
import { useFlightSearch } from './useFlightSearch';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { formatCurrency } from '@/utils';

const FlightSearchPage = () => {
	const {
		flights,
		isLoading,
		error,
		handleSelectFlight,
		handleViewReservations,
		isFlightFull
	} = useFlightSearch();

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-4xl mx-auto px-4">
				{/* Header */}
				<div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
					<h1 className="text-3xl font-semibold text-gray-800 mb-4 md:mb-0">
						Vuelos Disponibles
					</h1>
					<Button variant="secondary" onClick={handleViewReservations}>
						Ver Mis Reservas
					</Button>
				</div>

				{/* Flight Results */}
				<div className="space-y-4">
					{isLoading ? (
						<div className="flex items-center justify-center h-64">
							<LoadingSpinner size="lg" />
						</div>
					) : error ? (
						<Card className="text-center py-12">
							<h3 className="text-xl font-semibold text-red-600 mb-2">
								Error al cargar vuelos
							</h3>
							<p className="text-gray-500">
								Por favor, intenta de nuevo más tarde.
							</p>
						</Card>
					) : flights.length === 0 ? (
						<Card className="text-center py-12">
							<h3 className="text-xl font-semibold text-gray-600 mb-2">
								No hay vuelos disponibles
							</h3>
							<p className="text-gray-500">
								Por favor, intenta más tarde.
							</p>
						</Card>
					) : (
						flights.slice(0, 6).map((flight) => {
							const isFull = isFlightFull(flight);
							return (
								<Card key={flight.id} className={`transition-all ${isFull ? 'opacity-60' : 'hover:shadow-md'}`}>
									<div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
										{/* Flight Info */}
										<div className="lg:col-span-8">
											<div className="flex items-center gap-4 mb-4">
												<div className="flex items-center gap-2">
													<div className="w-8 h-8 bg-[#74B5CD] rounded-full flex items-center justify-center">
														<span className="text-white text-sm font-bold">✈</span>
													</div>
													<span className="font-bold text-lg text-gray-800">{flight.flightNumber}</span>
												</div>
												<span className="text-gray-600 w-32">{flight.aircraftModel}</span>
												<span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-semibold">
													{flight.aircraft}
												</span>
												{/* Indicador de vuelo completo */}
												{isFull && (
													<span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-semibold">
														COMPLETO
													</span>
												)}
											</div>

											<div className="grid grid-cols-3 gap-4 items-center">
												{/* Origin */}
												<div className="text-center">
													<div className="text-2xl font-bold text-gray-800">{flight.origin.time}</div>
													<div className="text-lg font-semibold text-gray-800">{flight.origin.code}</div>
													<div className="text-sm text-gray-600">{flight.origin.city}</div>
												</div>

												{/* Flight Path */}
												<div className="flex items-center justify-center">
													<div className="flex items-center w-full">
														<div className="w-3 h-3 bg-[#74B5CD] rounded-full"></div>
														<div className="flex-1 h-0.5 bg-[#74B5CD] mx-2 relative">
															<div className="absolute top-[-4px] right-[-4px] w-2 h-2 bg-[#74B5CD] transform rotate-45"></div>
														</div>
													</div>
													<div className="text-center mx-2">
														<div className="text-xs text-gray-600">{flight.duration}</div>
														<div className="text-xs text-gray-500">Directo</div>
													</div>
												</div>

												{/* Destination */}
												<div className="text-center">
													<div className="text-2xl font-bold text-gray-800">{flight.destination.time}</div>
													<div className="text-lg font-semibold text-gray-800">{flight.destination.code}</div>
													<div className="text-sm text-gray-600">{flight.destination.city}</div>
												</div>
											</div>
										</div>

										{/* Price and Select */}
										<div className="lg:col-span-4 flex flex-col text-center lg:text-right">
											<div className="mb-4">
												<div className="text-xs text-gray-600 mb-1">Desde</div>
												<div className={`text-3xl font-bold ${isFull ? 'text-gray-400' : 'text-[#74B5CD]'}`}>
													{formatCurrency(flight.price)}
												</div>
												<div className="text-xs text-gray-500">Por persona</div>
											</div>

											<Button
												variant={isFull ? "secondary" : "primary"}
												size="lg"
												onClick={() => handleSelectFlight(flight)}
												disabled={isFull}
												className="w-full lg:w-auto"
											>
												{isFull ? 'Vuelo Completo' : 'Seleccionar Vuelo'}
											</Button>
										</div>
									</div>
								</Card>
							);
						})
					)}
				</div>
			</div>
		</div>
	);
};

export default FlightSearchPage;