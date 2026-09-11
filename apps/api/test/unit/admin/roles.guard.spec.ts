import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from '../../../src/common/guards/roles.guard';

function buildContext(userRole: string | undefined): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({ user: userRole ? { role: userRole } : undefined }),
    }),
    getHandler: () => ({}),
    getClass: () => ({}),
  } as unknown as ExecutionContext;
}

describe('RolesGuard', () => {
  it('permite pasar si el endpoint no requiere roles', () => {
    const reflector = { getAllAndOverride: jest.fn().mockReturnValue(undefined) } as unknown as Reflector;
    const guard = new RolesGuard(reflector);
    expect(guard.canActivate(buildContext('USER'))).toBe(true);
  });

  it('permite pasar si el usuario tiene el rol requerido', () => {
    const reflector = { getAllAndOverride: jest.fn().mockReturnValue(['ADMIN']) } as unknown as Reflector;
    const guard = new RolesGuard(reflector);
    expect(guard.canActivate(buildContext('ADMIN'))).toBe(true);
  });

  it('rechaza si el usuario no tiene el rol requerido', () => {
    const reflector = { getAllAndOverride: jest.fn().mockReturnValue(['ADMIN']) } as unknown as Reflector;
    const guard = new RolesGuard(reflector);
    expect(() => guard.canActivate(buildContext('USER'))).toThrow(ForbiddenException);
  });
});
