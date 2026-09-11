import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * Marca un endpoint como restringido a ciertos roles. Se combina con
 * RolesGuard (registrado globalmente): si el endpoint no tiene este
 * decorador, cualquier usuario autenticado puede acceder — el rol
 * solo importa donde se declara explícitamente.
 *
 * Uso: @Roles('ADMIN') @Get('admin/users') ...
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
