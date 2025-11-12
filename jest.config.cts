// jest.config.ts
import type { Config } from 'jest';

const jestConfig: Config = {
  // Cobertura con V8 para mejor performance
  coverageProvider: 'v8',

  // Entorno simula el DOM en tests de React
  testEnvironment: 'jsdom',

  // Archivos de setup antes de cada test (opcional)
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  // Alias @/ para imports y estilos
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },

  // Transform TS/TSX con ts-jest apuntando a tsconfig correcto
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.app.json',
        diagnostics: { ignoreCodes: [1343] }
      }
    ]
  },

  // Extensiones de archivos que Jest reconocerá
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  // Ignorar node_modules excepto los transform necesarios
  transformIgnorePatterns: ['/node_modules/']
};

export default jestConfig;



