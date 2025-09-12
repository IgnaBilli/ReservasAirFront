import { AircraftConfig, CabinRange } from '@/interfaces';
import { SeatButton } from './SeatButton';

interface SeatGridProps {
	rows: number[];
	blocksLetters: string[][];
	config: AircraftConfig;
	occupiedNums: Set<number>;
	selectedSeats: number[];
	onSeatToggle: (code: string) => void;
	seatVisualToNum: (row: number, letter: string, blocks: string[]) => number;
	rowCabin: (row: number, cabins: CabinRange[]) => CabinRange | undefined;
	seatCode: (row: number, letter: string) => string;
}

export const SeatGrid = ({
	rows,
	blocksLetters,
	config,
	occupiedNums,
	selectedSeats,
	onSeatToggle,
	seatVisualToNum,
	rowCabin,
	seatCode
}: SeatGridProps) => {
	return (
		<div className="relative overflow-auto rounded-xl border bg-white p-4 max-h-[70vh]">
			<div className="mx-auto w-max">
				{/* Letras de los bloques arriba de la grilla */}
				<div className="flex items-end gap-3 mb-2 justify-center">
					{blocksLetters.map((letters, idx) => (
						<div key={idx} className="flex gap-1">
							{letters.map((l) => (
								<div key={l} className="w-8 md:w-9 text-center text-[10px] md:text-xs text-gray-500">
									{l}
								</div>
							))}
							{config.aislesAfterBlock.includes(idx) && <div className="w-4 md:w-6" />}
						</div>
					))}
				</div>

				{/* Filas de asientos */}
				<div className="flex flex-col gap-1">
					{rows.map((row) => (
						<div key={row} className="flex items-center gap-3">
							{/* Número de fila a la izquierda */}
							<div className="w-6 text-right text-[10px] md:text-xs text-gray-700">{row}</div>

							{/* Botones de asientos */}
							<div className="flex items-center gap-3">
								{blocksLetters.map((letters, bIdx) => (
									<div key={`${row}-b-${bIdx}`} className="flex gap-1">
										{letters.map((letter) => {
											const code = seatCode(row, letter);
											const num = seatVisualToNum(row, letter, config.blocks);
											const isSelected = selectedSeats.includes(num);
											const state = occupiedNums.has(num) ? "occupied" : "available";
											const cabin = rowCabin(row, config.cabins)?.name ?? "economy";

											return (
												<SeatButton
													key={code}
													code={code}
													state={state}
													selected={isSelected}
													cabin={cabin}
													onToggle={() => onSeatToggle(code)}
												/>
											);
										})}
										{/* Espacio para pasillo si corresponde */}
										{config.aislesAfterBlock.includes(bIdx) && <div className="w-4 md:w-6" />}
									</div>
								))}
							</div>

							{/* Número de fila a la derecha */}
							<div className="w-6 text-left text-[10px] md:text-xs text-gray-700">{row}</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};