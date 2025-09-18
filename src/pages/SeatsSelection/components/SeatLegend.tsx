import { CabinRange } from '@/interfaces';

interface SeatLegendProps {
	cabins: CabinRange[];
}

export const SeatLegend = ({ cabins }: SeatLegendProps) => (
	<div className="flex flex-wrap gap-4 text-sm text-black">
		{cabins.map((c) => (
			<div key={c.name} className="flex items-center gap-2">
				<span
					className={`w-5 h-5 rounded ${c.name === "first"
							? "bg-[#ACA7BE]"
							: c.name === "business"
								? "bg-[#A3B0BD]"
								: "bg-[#D9D9D9]"
						}`}
				/>
				<span>
					{c.name === "first" ? "Primera Clase" : c.name === "business" ? "Business" : "Economica"} (${c.price})
				</span>
			</div>
		))}
		<div className="flex items-center gap-2">
			<span className="w-5 h-5 rounded bg-[#5C6A7F]" />
			<span>Ocupado</span>
		</div>
		<div className="flex items-center gap-2">
			<span className="w-5 h-5 rounded bg-[#74B5CD]" />
			<span>Seleccionado</span>
		</div>
	</div>
);