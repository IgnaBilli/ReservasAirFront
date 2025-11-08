import { formatCurrency, seatNumToVisual, generateSeatNumber, formatDate } from "../utils";
import { AircraftType } from '@/interfaces';

describe("utils", () => {
  it("formatea moneda correctamente", () => {
    // Normaliza los espacios para comparar
    const formatted = formatCurrency(1000).replace(/\u00A0/g, ' ');
    expect(formatted).toBe("$ 1.000");
  });

  it('convierte número de asiento a visual correctamente para A330', () => {
    const res = seatNumToVisual(1, 'A330' as AircraftType);
    expect(res).toEqual({ row: 1, letter: 'A' });

    const res2 = seatNumToVisual(8, 'A330' as AircraftType);
    expect(res2).toEqual({ row: 1, letter: 'H' });
  });

  it('genera número de asiento legible', () => {
    const seat = generateSeatNumber(2, 'E190' as AircraftType);
    expect(seat).toBe('1B');
  });

  it('formatea fecha devolviendo año y parte legible', () => {
    const input = '2025-10-19T12:00:00Z';
    const out = formatDate(input);

    // Comprueba que devuelve un string no vacío
    expect(typeof out).toBe('string');
    expect(out.length).toBeGreaterThan(0);

    // Debe contener el año y el día
    expect(out).toContain('2025');
    expect(out).toMatch(/\b19\b/);
  });
});

