import React, { useMemo, useState } from "react";

// Tipos principales usados en la lógica de asientos
export type AircraftType = "E190" | "B737" | "A330";
export type CabinName = "Economy" | "Business" | "First";
export type SeatState = "available" | "occupied" | "reserved";

// Estructura para definir rangos de cabinas y precios
export interface CabinRange {
  name: CabinName;
  fromRow: number;
  toRow: number;
  price: number;
}

// Configuración de cada tipo de avión
export interface AircraftConfig {
  rows: number;
  blocks: string[];
  aislesAfterBlock: number[];
  cabins: CabinRange[];
}

// Props principales del componente de selección de asientos
export interface SeatMapProps {
  aircraft: AircraftType;
  occupied?: number[];
  reserved?: number[];
  maxSelectable?: number;
  onChange?: (selectedCodes: number[]) => void;
}

// Diccionario con la configuración de cada avión
const AIRCRAFTS: Record<AircraftType, AircraftConfig> = {
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

// Calcula la cantidad total de asientos por fila
const totalSeatsPerRow = (blocks: string[]) => blocks.reduce((sum, b) => sum + b.length, 0);

// Convierte código visual de asiento (ej: 12A) a número único
const seatVisualToNum = (row: number, letter: string, blocks: string[]) => {
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
const seatNumToVisual = (num: number, blocks: string[]) => {
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
const rowCabin = (row: number, cabins: CabinRange[]) =>
  cabins.find((c) => row >= c.fromRow && row <= c.toRow);

// Genera el código visual de asiento (ej: 12A)
const seatCode = (row: number, letter: string) => `${row}${letter}`;

// Componente para mostrar la leyenda de colores y precios
const SeatLegend: React.FC<{ cabins: CabinRange[] }> = ({ cabins }) => (
  <div className="flex gap-4 text-sm text-black">
    {cabins.map((c) => (
      <div key={c.name} className="flex items-center gap-2">
        <span className={`w-5 h-5 rounded ${c.name === "First" ? "bg-[#ACA7BE]" : c.name === "Business" ? "bg-[#A3B0BD]" : "bg-[#D9D9D9]"}`} />
        {c.name === "First" ? "Primera Clase" : c.name === "Business" ? "Business" : "Economica"} (${c.price})
      </div>
    ))}
    <div className="flex items-center gap-2"><span className="w-5 h-5 rounded bg-[#5C6A7F]" />Ocupado</div>
    <div className="flex items-center gap-2"><span className="w-5 h-5 rounded bg-[#FFE100]" />Reservado</div>
    <div className="flex items-center gap-2"><span className="w-5 h-5 rounded bg-[#74B5CD]" />Seleccionado</div>
  </div>
);

// Botón para cada asiento, muestra color y estado
interface SeatBtnProps {
  code: string;
  state: SeatState;
  selected: boolean;
  cabin: CabinName;
  onToggle: () => void;
}

const SeatBtn: React.FC<SeatBtnProps> = ({ code, state, selected, cabin, onToggle }) => {
  // Mapa de colores según estado/cabina
  const colorMap: Record<string, string> = {
    occupied: "bg-[#5C6A7F] border-[#5C6A7F] text-white",
    reserved: "bg-[#FFE100] border-[#FFE100] text-black",
    First: "bg-[#ACA7BE] border-[#ACA7BE] text-white",
    Business: "bg-[#A3B0BD] border-[#A3B0BD] text-white",
    Economy: "bg-[#D9D9D9] border-[#D9D9D9] text-black",
    selected: "bg-[#74B5CD] border-[#74B5CD] text-white",
  };
  let cls = state === "occupied" ? colorMap.occupied
    : selected ? colorMap.selected
    : state === "reserved" ? colorMap.reserved
    : colorMap[cabin];
  const disabled = state === "occupied" || state === "reserved";
  const letter = code.replace(/\d+/g, "");
  return (
    <button
      type="button"
      aria-label={`${code} ${state}`}
      disabled={disabled}
      onClick={onToggle}
      className={`w-8 h-8 md:w-9 md:h-9 rounded-md flex items-center justify-center text-[11px] md:text-xs font-semibold border ${cls} disabled:cursor-not-allowed`}
    >
      {letter}
    </button>
  );
};

// Componente principal que renderiza el mapa de asientos
export const SeatMap: React.FC<SeatMapProps> = ({
  aircraft,
  occupied = [],
  reserved = [],
  maxSelectable = 1,
  onChange,
}) => {
  // Obtiene la configuración del avión seleccionado
  const cfg = AIRCRAFTS[aircraft];

  // Genera array de filas y bloques de letras
  const rows = useMemo(() => Array.from({ length: cfg.rows }, (_, i) => i + 1), [cfg.rows]);
  const blocksLetters = useMemo(() => cfg.blocks.map((b) => b.split("")), [cfg.blocks]);

  // Convierte arrays de ocupados/reservados a Set para búsqueda rápida
  const occupiedNums = useMemo(() => new Set(occupied), [occupied]);
  const reservedNums = useMemo(() => new Set(reserved), [reserved]);

  // Estado local para asientos seleccionados
  const [selected, setSelected] = useState<number[]>([]);

  // Nuevo useEffect para notificar al padre
  React.useEffect(() => {
    onChange?.(selected);
  }, [selected, onChange]);

  // Maneja la selección/deselección de asientos
  const toggle = (code: string) => {
    const row = parseInt(code.match(/\d+/)?.[0] || "0", 10);
    const letter = code.replace(/\d+/g, "");
    const num = seatVisualToNum(row, letter, cfg.blocks);
    setSelected((prev) => {
      const has = prev.includes(num);
      let next = has ? prev.filter((n) => n !== num) : [...prev, num];
      if (!has && next.length > maxSelectable) next = [num];
      return next;
    });
  };

  // Renderiza la interfaz de selección de asientos
  return (
    <div className="w-full grid grid-rows-[auto_auto_1fr_auto] gap-4">
      {/* Leyenda de colores y precios */}
      <div className="flex items-center justify-between"><SeatLegend cabins={cfg.cabins} /></div>
      {/* Simulación de cabina (franja azul) */}
      <div className="h-2 rounded-full bg-sky-600 w-40 mx-auto" />
      {/* Grilla de asientos */}
      <div className="relative overflow-auto rounded-xl border bg-white p-4 max-h-[70vh]">
        <div className="mx-auto w-max">
          {/* Letras de los bloques arriba de la grilla */}
          <div className="flex items-end gap-3 mb-2 justify-center">
            {blocksLetters.map((letters, idx) => (
              <div key={idx} className="flex gap-1">
                {letters.map((l) => (
                  <div key={l} className="w-8 md:w-9 text-center text-[10px] md:text-xs text-gray-500">{l}</div>
                ))}
                {cfg.aislesAfterBlock.includes(idx) && <div className="w-4 md:w-6" />}
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
                        const num = seatVisualToNum(row, letter, cfg.blocks);
                        const isSelected = selected.includes(num);
                        const state: SeatState = occupiedNums.has(num)
                          ? "occupied"
                          : reservedNums.has(num)
                          ? "reserved"
                          : "available";
                        const cabin = rowCabin(row, cfg.cabins)?.name ?? "Economy";
                        return (
                          <SeatBtn
                            key={code}
                            code={code}
                            state={state}
                            selected={isSelected}
                            cabin={cabin}
                            onToggle={() => toggle(code)}
                          />
                        );
                      })}
                      {/* Espacio para pasillo si corresponde */}
                      {cfg.aislesAfterBlock.includes(bIdx) && <div className="w-4 md:w-6" />}
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
      {/* Panel de información y confirmación */}
      <div className="flex flex-col gap-4 mt-4">
        {/* Muestra el asiento seleccionado y su precio */}
        {selected.length > 0 && (() => {
          const num = selected[0];
          const { row: rowN, letter } = seatNumToVisual(num, cfg.blocks);
          const code = seatCode(rowN, letter);
          const cab = rowCabin(rowN, cfg.cabins);
          return (
            <div className="flex items-center justify-between bg-[#eef5f8] rounded-lg px-6 py-4">
              <div>
                <div className="font-semibold text-gray-700 text-[16px]">
                  Asiento Seleccionado: <span className="text-black">{code}</span>
                </div>
                <div className="text-xs text-left text-gray-500">{cab?.name === "First" ? "Primera Clase" : cab?.name === "Business" ? "Business" : "Economica"}</div>
              </div>
              <span className="px-3 py-1 rounded-full bg-gray-200 text-gray-700 font-semibold text-sm">${cab?.price ?? 0}</span>
            </div>
          );
        })()}
        {/* Botón para confirmar la reserva */}
        <div className="flex items-center justify-between border rounded-lg px-6 py-4 bg-white">
          <div>
            <div className="font-semibold text-gray-700 text-[16px]">Confirmar selección?</div>
            <div className="text-xs text-gray-500">Se crea una reserva temporal</div>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-gray-200 text-gray-700 font-semibold text-sm">
              ${selected.length > 0 ? (() => {
                const num = selected[0];
                const { row: rowN } = seatNumToVisual(num, cfg.blocks);
                const cab = rowCabin(rowN, cfg.cabins);
                return cab?.price ?? 0;
              })() : 0}
            </span>
            <button
              className="px-4 py-2 rounded cursor-pointer bg-[#74B5CD] text-white font-semibold disabled:opacity-50"
              disabled={selected.length === 0}
              onClick={() => {
                const codes = selected.map(n => {
                  const { row, letter } = seatNumToVisual(n, cfg.blocks);
                  return seatCode(row, letter);
                });
                console.log("CONFIRM", codes, selected);
              }}
            >
              Crear Reserva
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
