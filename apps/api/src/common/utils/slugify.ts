/**
 * Normaliza un texto a slug (minúsculas, sin acentos, guiones en vez
 * de espacios). Usado por Technologies y Tags para el patrón
 * find-or-create — dos usuarios escribiendo "Next.js" y "next js"
 * deben resolver al mismo registro.
 */
export function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // quita acentos
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
