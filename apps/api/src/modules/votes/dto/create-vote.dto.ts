import { IsIn } from 'class-validator';

export class CreateVoteDto {
  @IsIn([1, -1])
  value: 1 | -1;
}
