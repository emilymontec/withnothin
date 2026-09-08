import { PartialType, OmitType } from '@nestjs/swagger';
import { CreatePostDto } from './create-post.dto';

// El tipo NO se puede cambiar después de creado — evita que un STUCK
// se convierta en SHOWCASE perdiendo el contexto de por qué existe.
export class UpdatePostDto extends PartialType(OmitType(CreatePostDto, ['type'] as const)) {}
