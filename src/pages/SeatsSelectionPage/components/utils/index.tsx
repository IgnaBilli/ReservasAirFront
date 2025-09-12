import { CabinRange } from '@/interfaces';

// Calcula la cantidad total de asientos por fila
export const totalSeatsPerRow = (blocks: string[]) =>
	blocks.reduce((sum, b) => sum + b.length, 0);

// Convierte código visual de asiento (ej: 12A) a número único
export const seatVisualToNum = (row: number, letter: string, blocks: string[]) => {
	let idx = 0;
	for (let b = 0; b < blocks.length; b++) {
		const block = blocks[b];
		for (let l = 0; l < block.length; l++) {
			if (block[l] === letter) return (row - 1) * totalSeatsPerRow(blocks) + idx + l + 1;
		}
		idx += block.length;
	}
	return -1;
};

// Convierte número único de asiento a código visual (ej: 12A)
export const seatNumToVisual = (num: number, blocks: string[]) => {
	const seatsPerRow = totalSeatsPerRow(blocks);
	const row = Math.ceil(num / seatsPerRow);
	let idx = (num - 1) % seatsPerRow;

	for (let b = 0; b < blocks.length; b++) {
		const block = blocks[b];
		if (idx < block.length) return { row, letter: block[idx] };
		idx -= block.length;
	}
	return { row: 0, letter: "" };
};

// Busca la cabina correspondiente a una fila
export const rowCabin = (row: number, cabins: CabinRange[]) =>
	cabins.find((c) => row >= c.fromRow && row <= c.toRow);

// Genera el código visual de asiento (ej: 12A)
export const seatCode = (row: number, letter: string) => `${row}${letter}`;