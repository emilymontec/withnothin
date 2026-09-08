import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * Instancia única de PrismaClient para toda la aplicación.
 * Los repositorios de cada módulo inyectan este servicio en vez de
 * instanciar su propio cliente — así hay un único pool de conexiones.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
