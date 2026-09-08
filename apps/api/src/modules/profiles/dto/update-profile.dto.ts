import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateProfileDto } from './create-profile.dto';

// El username NO se actualiza por este endpoint (evita colisiones/decisiones
// de renombrado; si se necesita, será un flujo propio y explícito).
export class UpdateProfileDto extends PartialType(
  OmitType(CreateProfileDto, ['username'] as const),
) {}
