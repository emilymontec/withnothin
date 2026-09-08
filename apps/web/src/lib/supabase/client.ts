import { createClient } from '@supabase/supabase-js';

/**
 * Único punto de creación del cliente Supabase en la web.
 * Se usa EXCLUSIVAMENTE para Auth (login/registro/sesión) y, más
 * adelante, para obtener signed URLs de Storage — nunca para
 * consultar tablas de negocio directamente (eso es responsabilidad
 * de la API, vía api-client.ts).
 */
export const supabaseBrowserClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
);
