import { useEffect, useMemo, useState } from "react";
import { AIRCRAFTS, getAircraftWithPrices } from "@/mocks/aircrafts";
import { AircraftType } from "@/interfaces";
import {
	SeatLegend,
	SeatGrid,
	SelectionSummary,
	seatVisualToNum,
	seatNumToVisual,
	rowCabin,
	seatCode
} from "@/pages/SeatsSelection/components";

export interface SeatMapProps {
	aircraft: AircraftType;
	flightBasePrice?: number; // Base price from the flight
	occupied?: number[];
	maxSelectable?: number;
	initialSelected?: number[];
	onChange?: (selectedCodes: number[]) => void;
}

export const SeatMap = ({
	aircraft,
	flightBasePrice = 0,
	occupied = [],
	maxSelectable = 999,
	initialSelected = [], // Default to empty array
	onChange,
}: SeatMapProps) => {
	const [selected, setSelected] = useState<number[]>(initialSelected);

	// Use the flight's base price to calculate cabin prices, or use default config
	const cfg = flightBasePrice > 0 
		? getAircraftWithPrices(aircraft, flightBasePrice)
		: AIRCRAFTS[aircraft];
	
	const rows = useMemo(() => Array.from({ length: cfg.rows }, (_, i) => i + 1), [cfg.rows]);
	const blocksLetters = useMemo(() => cfg.blocks.map((b) => b.split("")), [cfg.blocks]);
	const occupiedNums = useMemo(() => new Set(occupied), [occupied]);

	// Update selected seats when initialSelected changes
	useEffect(() => {
		setSelected(initialSelected);
	}, [initialSelected]);

	useEffect(() => {
		onChange?.(selected);
	}, [selected, onChange]);

	const toggle = (code: string) => {
		const row = parseInt(code.match(/\d+/)?.[0] || "0", 10);
		const letter = code.replace(/\d+/g, "");
		const num = seatVisualToNum(row, letter, cfg.blocks);

		setSelected((prev) => {
			const has = prev.includes(num);
			if (has) {
				// Deseleccionar
				return prev.filter((n) => n !== num);
			} else {
				// Seleccionar sin límite (a menos que se especifique uno muy bajo)
				if (maxSelectable < 999 && prev.length >= maxSelectable) {
					return [...prev.slice(1), num];
				}
				return [...prev, num];
			}
		});
	};

	return (
		<div className="w-full p-6">
			{/* Leyenda */}
			<div className="mb-6">
				<SeatLegend cabins={cfg.cabins} />
			</div>

			{/* Cabina simulation */}
			<div className="h-2 rounded-full bg-sky-600 w-40 mx-auto mb-6" />

			{/* Seat Grid */}
			<SeatGrid
				rows={rows}
				blocksLetters={blocksLetters}
				config={cfg}
				occupiedNums={occupiedNums}
				selectedSeats={selected}
				onSeatToggle={toggle}
				seatVisualToNum={seatVisualToNum}
				rowCabin={rowCabin}
				seatCode={seatCode}
			/>

			{/* Selection Summary */}
			<SelectionSummary
				selectedSeats={selected}
				config={cfg}
				seatNumToVisual={seatNumToVisual}
				rowCabin={rowCabin}
			/>
		</div>
	);
};