import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * Global para no tener que importar PrismaModule en cada módulo de dominio.
 * Sigue siendo la ÚNICA vía de acceso a la base de datos: nadie fuera de
 * los repositorios debería inyectar PrismaService directamente.
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
