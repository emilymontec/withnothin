import { IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateCommunityDto {
  @IsString()
  @MinLength(2)
  @MaxLength(60)
  name: string;

  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @Matches(/^[a-z0-9-]+$/, {
    message: 'El slug solo puede contener minúsculas, números y guiones',
  })
  slug: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;
}
