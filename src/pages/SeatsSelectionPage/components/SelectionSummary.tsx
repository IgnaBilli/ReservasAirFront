import { AircraftConfig, CabinRange } from '@/interfaces';

interface SelectionSummaryProps {
	selectedSeats: number[];
	config: AircraftConfig;
	seatNumToVisual: (num: number, blocks: string[]) => { row: number; letter: string };
	rowCabin: (row: number, cabins: CabinRange[]) => CabinRange | undefined;
}

export const SelectionSummary = ({
	selectedSeats,
	config,
	seatNumToVisual,
	rowCabin
}: SelectionSummaryProps) => {
	if (selectedSeats.length === 0) return null;

	const totalPrice = selectedSeats.reduce((total, num) => {
		const { row } = seatNumToVisual(num, config.blocks);
		const cabin = rowCabin(row, config.cabins);
		return total + (cabin?.price ?? 0);
	}, 0);

	return (
		<div className="mt-6">
			<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
				<div className="flex items-center justify-between">
					<div>
						<p className="font-semibold text-gray-800">
							{selectedSeats.length} asiento{selectedSeats.length !== 1 ? 's' : ''} seleccionado{selectedSeats.length !== 1 ? 's' : ''}
						</p>
						<div className="flex flex-wrap gap-2 mt-2">
							{selectedSeats.map((num) => {
								const { row, letter } = seatNumToVisual(num, config.blocks);
								const cabin = rowCabin(row, config.cabins);
								return (
									<div key={num} className="flex items-center gap-1 bg-white px-2 py-1 rounded text-sm">
										<span className="font-semibold">{row}{letter}</span>
										<span className="text-gray-600">- ${cabin?.price}</span>
									</div>
								);
							})}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};