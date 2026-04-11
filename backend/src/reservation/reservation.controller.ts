import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { type AccessTokenPayload } from '../auth/auth.constants';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('reservation')
@UseGuards(AuthGuard)
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('USER')
  create(
    @CurrentUser() currentUser: AccessTokenPayload,
    @Body() createReservationDto: CreateReservationDto,
  ) {
    return this.reservationService.create(currentUser, createReservationDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('USER', 'ADMIN')
  findAll(@CurrentUser() currentUser: AccessTokenPayload) {
    return this.reservationService.findAll(currentUser);
  }

  @Get('events')
  @UseGuards(RolesGuard)
  @Roles('USER', 'ADMIN')
  findEvents(@CurrentUser() currentUser: AccessTokenPayload) {
    return this.reservationService.findEvents(currentUser);
  }

  @Get('summary')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  summary() {
    return this.reservationService.summary();
  }

  @Patch(':id/cancel')
  @UseGuards(RolesGuard)
  @Roles('USER')
  cancel(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: AccessTokenPayload,
  ) {
    return this.reservationService.cancel(id, currentUser);
  }
}
