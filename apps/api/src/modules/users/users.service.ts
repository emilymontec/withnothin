import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UserResponseDto } from './dto/user-response.dto';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  /**
   * Aprovisionamiento perezoso (JIT): si el usuario ya existe en nuestra
   * base de datos lo retorna; si es su primer request autenticado
   * (recién se registró en Supabase Auth), lo crea. Ver AuthGuard.
   */
  async getOrProvisionFromAuth(authUser: { id: string; email: string }): Promise<User> {
    const existing = await this.usersRepository.findById(authUser.id);
    if (existing) {
      return existing;
    }

    return this.usersRepository.create({ id: authUser.id, email: authUser.email });
  }

  async findById(id: string): Promise<UserResponseDto> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return new UserResponseDto(user);
  }
}
