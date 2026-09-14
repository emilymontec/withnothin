'use client';

import { useEffect } from 'react';

/**
 * Todas las páginas mostraban siempre el título genérico del layout
 * raíz ("WithNothin"), sin importar si se estaba viendo un post, un
 * perfil o el feed. Esto actualiza `document.title` en el cliente.
 *
 * No reemplaza metadata real de Next.js (`export const metadata` /
 * `generateMetadata`) para SEO/previews de redes sociales — eso
 * requiere que cada página dinámica se parta en un server component
 * (para el metadata) + un client component (para los hooks de
 * react-query), que es un refactor más grande y queda señalado para
 * la próxima ronda. Esto sí arregla lo que ve el usuario en la
 * pestaña del navegador, que es el problema inmediato.
 */
export function useDocumentTitle(title: string | undefined) {
  useEffect(() => {
    if (!title) return;
    const previous = document.title;
    document.title = `${title} · WithNothin`;
    return () => {
      document.title = previous;
    };
  }, [title]);
}
