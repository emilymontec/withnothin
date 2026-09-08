'use client';

import { useEffect } from 'react';
import { authService } from './services/auth-service';
import { useSessionStore } from '@/stores/session-store';

/**
 * Se monta una sola vez en el root layout. Sincroniza el token actual
 * de Supabase con useSessionStore y escucha cambios (login, logout,
 * refresh automático de token).
 */
export function SessionProvider({ children }: { children: React.ReactNode }) {
  const setToken = useSessionStore((s) => s.setToken);
  const setInitialized = useSessionStore((s) => s.setInitialized);

  useEffect(() => {
    authService.getSession().then((session) => {
      setToken(session?.access_token ?? null);
      setInitialized(true);
    });

    const unsubscribe = authService.onAuthStateChange((token) => {
      setToken(token);
    });

    return unsubscribe;
  }, [setToken, setInitialized]);

  return <>{children}</>;
}
