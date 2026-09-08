import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Marca un endpoint como accesible sin autenticación.
 * Por defecto, TODA la API requiere JWT válido (ver AuthGuard global).
 *
 * Uso:
 *   @Public()
 *   @Get('technologies')
 *   findAll() { ... }
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
