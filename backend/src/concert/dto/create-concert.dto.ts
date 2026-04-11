import { IsInt, IsString, Min, MinLength } from 'class-validator';

export class CreateConcertDto {
  @IsString()
  @MinLength(1)
  name!: string;

  @IsString()
  @MinLength(1)
  description!: string;

  @IsInt()
  @Min(0)
  totalSeats!: number;
}
