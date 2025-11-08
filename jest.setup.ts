/// <reference types="@testing-library/jest-dom" />
// jest.setup.ts
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Solo define si no existen
if (typeof global.TextEncoder === 'undefined') {
  (global as any).TextEncoder = TextEncoder;
}

if (typeof global.TextDecoder === 'undefined') {
  (global as any).TextDecoder = TextDecoder;
}

// ===== Mock import.meta.env para Jest =====
// Valor por defecto si no está definido
if (!process.env.VITE_API_BASE_URL) {
  process.env.VITE_API_BASE_URL = 'http://localhost:3000/api';
}

// Definir un shim para import.meta.env sin usar la palabra reservada directamente
try {
  if (!(Object.prototype.hasOwnProperty.call(globalThis, 'import'))) {
    Object.defineProperty(globalThis as any, 'import', {
      value: { meta: { env: { VITE_API_BASE_URL: process.env.VITE_API_BASE_URL } } },
      configurable: true,
      writable: false,
      enumerable: false
    });
  } else if (!(globalThis as any).import?.meta?.env?.VITE_API_BASE_URL) {
    (globalThis as any).import.meta = {
      env: { VITE_API_BASE_URL: process.env.VITE_API_BASE_URL }
    };
  }
} catch {
  // Ignorar si el entorno no permite definir esta propiedad
}
