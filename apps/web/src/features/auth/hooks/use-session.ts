import { useSessionStore } from '@/stores/session-store';

export function useSession() {
  const token = useSessionStore((s) => s.token);
  const isInitialized = useSessionStore((s) => s.isInitialized);

  return {
    token,
    isAuthenticated: Boolean(token),
    isInitialized,
  };
}
