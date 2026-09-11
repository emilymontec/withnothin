import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateCommunityDto } from './create-community.dto';

// El slug no se puede cambiar — evita romper links existentes a la comunidad.
export class UpdateCommunityDto extends PartialType(
  OmitType(CreateCommunityDto, ['slug'] as const),
) {}
