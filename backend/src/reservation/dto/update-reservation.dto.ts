import { PartialType } from '@nestjs/mapped-types';
import { IsEnum } from 'class-validator';
import { CreateReservationDto } from './create-reservation.dto';
import { ReservationStatus } from '../../../generated/prisma/enums';

export class UpdateReservationDto extends PartialType(CreateReservationDto) {
  @IsEnum(ReservationStatus)
  status!: ReservationStatus;
}
