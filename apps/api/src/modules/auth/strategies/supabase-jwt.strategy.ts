import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

export interface SupabaseJwtPayload {
  sub: string; // id del usuario en Supabase Auth — se reutiliza como users.id
  email: string;
  role?: string;
  exp: number;
}

/**
 * Verifica la firma y expiración del JWT emitido por Supabase Auth.
 * Supabase firma sus tokens con el "JWT Secret" del proyecto (HS256),
 * disponible en Project Settings > API de Supabase.
 *
 * NestJS NUNCA emite tokens — solo los verifica. La emisión (login,
 * registro, refresh) ocurre contra Supabase directamente desde
 * Web/Android usando su SDK de cliente.
 */
@Injectable()
export class SupabaseJwtStrategy {
  constructor(private readonly configService: ConfigService) {}

  verify(token: string): SupabaseJwtPayload {
    const secret = this.configService.get<string>('JWT_PUBLIC_KEY_OR_SECRET');

    try {
      const payload = jwt.verify(token, secret as string, {
        algorithms: ['HS256'],
      }) as SupabaseJwtPayload;

      if (!payload.sub || !payload.email) {
        throw new UnauthorizedException('Token con formato inválido');
      }

      return payload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedException('Token expirado');
      }
      throw new UnauthorizedException('Token inválido');
    }
  }
}
