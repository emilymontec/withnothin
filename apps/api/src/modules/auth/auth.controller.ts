import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser, AuthenticatedUser } from '../../common/decorators/current-user.decorator';

/**
 * NestJS NO implementa login/registro/refresh: esos flujos ocurren
 * directamente entre el cliente (Web/Android) y Supabase Auth mediante
 * su SDK. Este módulo solo expone lo necesario para que el cliente
 * confirme que su token es válido contra nuestra API.
 */
@ApiTags('auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  @Get('me')
  getSession(@CurrentUser() user: AuthenticatedUser) {
    return user;
  }
}
