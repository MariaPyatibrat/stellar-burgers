import '@testing-library/jest-dom';

const mockCrypto = {
  randomUUID: jest.fn(
    () => 'mock-uuid-' + Math.random().toString(36).substring(2, 11)
  )
};

Object.defineProperty(global, 'crypto', {
  value: mockCrypto,
  writable: true,
  configurable: true
});
