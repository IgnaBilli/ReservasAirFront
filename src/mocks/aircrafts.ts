import { AircraftConfig, AircraftType } from "@/interfaces";

// Porcentajes de incremento sobre el precio base del vuelo
export const CABIN_PRICE_MULTIPLIERS = {
  economy: 1.0,    // Precio base (0% adicional)
  business: 1.2,   // 20% más que el precio base
  first: 1.4,      // 40% más que el precio base
};

// Función para calcular precios de cabina basados en el precio base del vuelo
export const calculateCabinPrices = (basePrice: number) => ({
  economy: basePrice * CABIN_PRICE_MULTIPLIERS.economy,
  business: basePrice * CABIN_PRICE_MULTIPLIERS.business,
  first: basePrice * CABIN_PRICE_MULTIPLIERS.first,
});

// Diccionario con la configuración de cada avión
// El precio es temporal y será reemplazado por el precio calculado del vuelo
export const AIRCRAFTS: Record<AircraftType, AircraftConfig> = {
  E190: {
    rows: 28,
    blocks: ["AB", "CD"],
    aislesAfterBlock: [0],
    cabins: [
      { name: "first", fromRow: 1, toRow: 2, price: 0 },
      { name: "business", fromRow: 3, toRow: 5, price: 0 },
      { name: "economy", fromRow: 6, toRow: 28, price: 0 },
    ],
  },
  B737: {
    rows: 30,
    blocks: ["ABC", "DEF"],
    aislesAfterBlock: [0],
    cabins: [
      { name: "first", fromRow: 1, toRow: 4, price: 0 },
      { name: "business", fromRow: 5, toRow: 8, price: 0 },
      { name: "economy", fromRow: 9, toRow: 30, price: 0 },
    ],
  },
  A330: {
    rows: 36,
    blocks: ["AB", "CDEF", "GH"],
    aislesAfterBlock: [0, 1],
    cabins: [
      { name: "first", fromRow: 1, toRow: 3, price: 0 },
      { name: "business", fromRow: 4, toRow: 12, price: 0 },
      { name: "economy", fromRow: 13, toRow: 36, price: 0 },
    ],
  },
};

// Función helper para obtener la configuración del avión con precios calculados
export const getAircraftWithPrices = (
  aircraftType: AircraftType,
  flightBasePrice: number
): AircraftConfig => {
  const config = AIRCRAFTS[aircraftType];
  const prices = calculateCabinPrices(flightBasePrice);

  return {
    ...config,
    cabins: config.cabins.map((cabin) => ({
      ...cabin,
      price: prices[cabin.name],
    })),
  };
};