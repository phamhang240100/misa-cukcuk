import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';

// In-memory storage mock to ensure RAM-only execution and absolute reset on reload/re-enter
const createMemoryStorage = (): Storage => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string): string | null => {
      return store[key] !== undefined ? store[key] : null;
    },
    setItem: (key: string, value: string): void => {
      store[key] = String(value);
    },
    removeItem: (key: string): void => {
      delete store[key];
    },
    clear: (): void => {
      store = {};
    },
    key: (index: number): string | null => {
      const keys = Object.keys(store);
      return keys[index] !== undefined ? keys[index] : null;
    },
    get length(): number {
      return Object.keys(store).length;
    }
  };
};

try {
  const memoryLocalStorage = createMemoryStorage();
  const memorySessionStorage = createMemoryStorage();
  
  Object.defineProperty(window, 'localStorage', {
    value: memoryLocalStorage,
    writable: true,
    configurable: true
  });
  
  Object.defineProperty(window, 'sessionStorage', {
    value: memorySessionStorage,
    writable: true,
    configurable: true
  });
} catch (e) {
  console.warn('Could not override storage with RAM storage, falling back to clearing storage', e);
  try {
    localStorage.clear();
    sessionStorage.clear();
  } catch (err) {}
}

import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

