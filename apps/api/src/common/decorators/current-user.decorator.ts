import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
}

/**
 * Extrae el usuario autenticado adjuntado por AuthGuard al request.
 * Uso: create(@CurrentUser() user: AuthenticatedUser) { ... }
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthenticatedUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

/**
 * Igual que CurrentUser, pero pensado para endpoints @Public(): el
 * usuario puede no existir (visitante anónimo) sin que eso sea un error.
 * AuthGuard intenta resolver el usuario también en rutas públicas si
 * llega un token válido; si no llega, request.user queda undefined.
 */
export const OptionalCurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthenticatedUser | undefined => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
