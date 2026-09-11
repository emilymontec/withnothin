import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { SupabaseJwtStrategy } from '../../modules/auth/strategies/supabase-jwt.strategy';
import { UsersService } from '../../modules/users/users.service';

/**
 * Guard global: toda ruta requiere JWT válido de Supabase Auth salvo
 * que esté marcada con @Public().
 *
 * Adicionalmente resuelve el "problema de la primera vez": Supabase
 * gestiona el registro/login, pero nuestra base de datos (users/profiles)
 * necesita enterarse de que ese usuario existe. En vez de un webhook
 * separado, se aprovisiona de forma perezosa (JIT) en el primer request
 * autenticado — más simple de operar en esta etapa que mantener un
 * webhook de Supabase sincronizado.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtStrategy: SupabaseJwtStrategy,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader: string | undefined = request.headers?.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token no provisto');
    }

    const token = authHeader.slice('Bearer '.length);
    const payload = this.jwtStrategy.verify(token);

    const user = await this.usersService.getOrProvisionFromAuth({
      id: payload.sub,
      email: payload.email,
    });

    request.user = { id: user.id, email: user.email, role: user.role };
    return true;
  }
}
