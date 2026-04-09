import { IsInt, Min } from 'class-validator';

export class LoginDto {
  @IsInt()
  @Min(1)
  userId!: number;
}
