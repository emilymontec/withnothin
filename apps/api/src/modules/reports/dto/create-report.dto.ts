import { ReportTargetType } from '@withnothin/shared-types';
import { IsEnum, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateReportDto {
  @IsEnum(ReportTargetType)
  targetType: ReportTargetType;

  @IsString()
  targetId: string;

  @IsString()
  @MinLength(3)
  @MaxLength(500)
  reason: string;
}
