import { create } from 'zustand';

interface SessionState {
  token: string | null;
  isInitialized: boolean;
  setToken: (token: string | null) => void;
  setInitialized: (value: boolean) => void;
}

/**
 * El token vive en memoria (Zustand), respaldado por la sesión real
 * de Supabase (que persiste en localStorage internamente vía su SDK).
 * Este store es solo un "espejo" reactivo para que api-client.ts y
 * los componentes puedan leer el token sin llamar a Supabase cada vez.
 */
export const useSessionStore = create<SessionState>((set) => ({
  token: null,
  isInitialized: false,
  setToken: (token) => set({ token }),
  setInitialized: (isInitialized) => set({ isInitialized }),
}));
