import { IsIn } from 'class-validator';

export class UpdateReportStatusDto {
  @IsIn(['REVIEWED', 'DISMISSED'])
  status: 'REVIEWED' | 'DISMISSED';
}
