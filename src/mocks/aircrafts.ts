import { AircraftType, CabinRange } from "@/interfaces";

// Configuración de cada tipo de avión
export interface AircraftConfig {
  rows: number;
  blocks: string[];
  aislesAfterBlock: number[];
  cabins: CabinRange[];
}

// Diccionario con la configuración de cada avión
export const AIRCRAFTS: Record<AircraftType, AircraftConfig> = {
  E190: {
    rows: 28,
    blocks: ["AB", "CD"],
    aislesAfterBlock: [0],
    cabins: [
      { name: "First", fromRow: 1, toRow: 2, price: 700 },
      { name: "Business", fromRow: 3, toRow: 5, price: 550 },
      { name: "Economy", fromRow: 6, toRow: 28, price: 400 },
    ],
  },
  B737: {
    rows: 30,
    blocks: ["ABC", "DEF"],
    aislesAfterBlock: [0],
    cabins: [
      { name: "First", fromRow: 1, toRow: 4, price: 750 },
      { name: "Business", fromRow: 5, toRow: 8, price: 600 },
      { name: "Economy", fromRow: 9, toRow: 30, price: 450 },
    ],
  },
  A330: {
    rows: 36,
    blocks: ["AB", "CDEF", "GH"],
    aislesAfterBlock: [0, 1],
    cabins: [
      { name: "First", fromRow: 1, toRow: 3, price: 1100 },
      { name: "Business", fromRow: 4, toRow: 12, price: 800 },
      { name: "Economy", fromRow: 13, toRow: 36, price: 520 },
    ],
  },
};