import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ReportResponseDto {
  @Expose()
  id: string;

  @Expose()
  status: string;

  @Expose()
  createdAt: Date;

  constructor(partial: Partial<ReportResponseDto>) {
    Object.assign(this, partial);
  }
}
