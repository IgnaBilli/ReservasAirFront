import { AIRCRAFTS } from '@/mocks/aircrafts';
import { AircraftType } from '@/interfaces';

export const seatNumToVisual = (num: number, aircraft: AircraftType) => {
  const cfg = AIRCRAFTS[aircraft];
  const blocks = cfg.blocks;
  const seatsPerRow = blocks.reduce((sum, b) => sum + b.length, 0);
  const row = Math.ceil(num / seatsPerRow);
  let idx = (num - 1) % seatsPerRow;
  
  for (let b = 0; b < blocks.length; b++) {
    const block = blocks[b];
    if (idx < block.length) {
      return { row, letter: block[idx] };
    }
    idx -= block.length;
  }
  return { row: 0, letter: "" };
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-AR', {
    weekday: 'long',
    year: 'numeric', 
    month: 'long',
    day: 'numeric'
  });
};

export const generateSeatNumber = (seatId: number, aircraft: AircraftType): string => {
  const { row, letter } = seatNumToVisual(seatId, aircraft);
  return `${row}${letter}`;
};