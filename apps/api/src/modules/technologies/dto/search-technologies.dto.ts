import { IsOptional, IsString, MaxLength } from 'class-validator';

export class SearchTechnologiesDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  search?: string;
}
