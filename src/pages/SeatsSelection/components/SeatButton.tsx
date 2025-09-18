import { CabinName, SeatState } from '@/interfaces';

interface SeatButtonProps {
	code: string;
	state: SeatState;
	selected: boolean;
	cabin: CabinName;
	onToggle: () => void;
}

export const SeatButton = ({ code, state, selected, cabin, onToggle }: SeatButtonProps) => {
	// Mapa de colores según estado/cabina
	const colorMap: Record<string, string> = {
		occupied: "bg-[#5C6A7F] border-[#5C6A7F] text-white cursor-not-allowed",
		selected: "bg-[#74B5CD] border-[#74B5CD] text-white hover:bg-[#5da3bd] cursor-pointer",
		first: "bg-[#ACA7BE] border-[#ACA7BE] text-white hover:bg-[#9b94b2] cursor-pointer",
		business: "bg-[#A3B0BD] border-[#A3B0BD] text-white hover:bg-[#92a1af] cursor-pointer",
		economy: "bg-[#D9D9D9] border-[#D9D9D9] text-black hover:bg-[#c9c9c9] cursor-pointer",
	};

	const cls = state === "occupied"
		? colorMap.occupied
		: selected
			? colorMap.selected
			: colorMap[cabin];

	const disabled = state === "occupied";
	const letter = code.replace(/\d+/g, "");

	return (
		<button
			type="button"
			aria-label={`${code} ${state}`}
			disabled={disabled}
			onClick={onToggle}
			className={`w-8 h-8 md:w-9 md:h-9 rounded-t-md flex items-center justify-center text-[11px] md:text-xs font-semibold border transition-colors duration-200 ${cls}`}
		>
			{letter}
		</button>
	);
};