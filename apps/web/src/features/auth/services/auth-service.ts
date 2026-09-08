import { supabaseBrowserClient } from '@/lib/supabase/client';

export interface AuthCredentials {
  email: string;
  password: string;
}

/**
 * Toda interacción de la web con Supabase Auth pasa por aquí.
 * Ningún componente llama a supabaseBrowserClient.auth directamente.
 */
export const authService = {
  async signUp({ email, password }: AuthCredentials) {
    const { data, error } = await supabaseBrowserClient.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  },

  async signIn({ email, password }: AuthCredentials) {
    const { data, error } = await supabaseBrowserClient.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabaseBrowserClient.auth.signOut();
    if (error) throw error;
  },

  async getSession() {
    const { data } = await supabaseBrowserClient.auth.getSession();
    return data.session;
  },

  onAuthStateChange(callback: (token: string | null) => void) {
    const { data: subscription } = supabaseBrowserClient.auth.onAuthStateChange(
      (_event, session) => {
        callback(session?.access_token ?? null);
      },
    );
    return () => subscription.subscription.unsubscribe();
  },
};
