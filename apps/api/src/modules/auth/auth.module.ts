import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { SupabaseJwtStrategy } from './strategies/supabase-jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [SupabaseJwtStrategy],
  exports: [SupabaseJwtStrategy], // AuthGuard depende de esta estrategia
})
export class AuthModule {}
