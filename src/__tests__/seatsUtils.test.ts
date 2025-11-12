import { totalSeatsPerRow, seatVisualToNum, seatNumToVisual, rowCabin, seatCode } from '@/pages/SeatsSelection/components/utils';
import { CabinRange } from '@/interfaces';

describe('seats utils', () => {
  const blocks = ['AB', 'CD']; // 4 asientos por fila

  const block = ['AB', 'CDE'];

  test('Deberia devolver el total de asientos por fila', () => {
    expect(totalSeatsPerRow(block)).toBe(5);
  });
  

  test('Deberia convertir el codigo de asiento a numero', () => {
    expect(seatVisualToNum(1, 'A', blocks)).toBe(1);
    expect(seatVisualToNum(1, 'D', blocks)).toBe(4);
    expect(seatVisualToNum(2, 'A', blocks)).toBe(5);
  });

  test('Deberia convertir el numero a numero de asiento', () => {
    expect(seatNumToVisual(1, blocks)).toEqual({ row: 1, letter: 'A' });
    expect(seatNumToVisual(3, blocks)).toEqual({ row: 1, letter: 'C' });
    expect(seatNumToVisual(5, blocks)).toEqual({ row: 2, letter: 'A' });
  });

  test('Buscar cabina por fila', () => {
    const cabins: CabinRange[] = [
      { fromRow: 1, toRow: 5, name: 'economy', price: 1000 },
      { fromRow: 6, toRow: 10, name: 'business', price: 5000 }
    ];

    expect(rowCabin(3, cabins)).toEqual(cabins[0]);
    expect(rowCabin(7, cabins)).toEqual(cabins[1]);

    expect(rowCabin(3, cabins)?.name).toBe('economy');
    expect(rowCabin(7, cabins)?.name).toBe('business');

    expect(seatCode(12, 'A')).toBe('12A');
  });
});
