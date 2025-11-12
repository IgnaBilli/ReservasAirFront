// src/pages/FlightSearch/FlightSearchPage.tsx
import { useFlightSearch } from './useFlightSearch';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { formatCurrency } from '@/utils';

const formatFlightDate = (dateString: string): string => {
	// Parse using UTC to avoid timezone offset issues
	const date = new Date(dateString);
	const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
	const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
	
	// Use UTC methods to get the correct date components
	const dayOfWeek = days[date.getUTCDay()];
	const day = date.getUTCDate();
	const month = months[date.getUTCMonth()];
	const year = date.getUTCFullYear();
	
	return `${dayOfWeek}, ${day} ${month} ${year}`;
};

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
						flights.slice(0, 10).map((flight) => {
							const isFull = isFlightFull(flight);
							console.log(`Vuelo ${flight.flightNumber} - Status:`, flight.flightStatus);

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
												<span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-semibold">
													{flight.aircraft}
												</span>
												<span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
													<span>📅</span>
													<span>{formatFlightDate(flight.date)}</span>
												</span>
												{/* Indicador de vuelo completo */}
												{isFull && (
													<span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-semibold">
														COMPLETO
													</span>
												)}
												{flight.flightStatus === "DELAYED" && (
													<span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm font-semibold">
														DEMORADO
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
												<div className="flex items-start justify-center lg:justify-end gap-1">
													<span className={`text-xs font-medium mt-1 ${isFull ? 'text-gray-400' : 'text-gray-500'}`}>
														{flight.currency || 'ARS'}
													</span>
													<div className={`text-3xl font-bold ${isFull ? 'text-gray-400' : 'text-[#74B5CD]'}`}>
														{formatCurrency(flight.price)}
													</div>
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