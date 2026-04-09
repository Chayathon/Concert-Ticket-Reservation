import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, ReservationStatus } from '../../generated/prisma/client';
import { type AccessTokenPayload } from '../auth/auth.constants';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Injectable()
export class ReservationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    currentUser: AccessTokenPayload,
    createReservationDto: CreateReservationDto,
  ) {
    const { concertId } = createReservationDto;

    try {
      return await this.prisma.$transaction(async (tx) => {
        const concert = await tx.concert.findUnique({
          where: { id: concertId },
          select: { id: true },
        });

        if (!concert) {
          throw new NotFoundException(`Concert ${concertId} not found`);
        }

        const existingReservation = await tx.reservation.findUnique({
          where: {
            userId_concertId: {
              userId: currentUser.userId,
              concertId,
            },
          },
        });

        if (existingReservation?.status === ReservationStatus.RESERVED) {
          throw new ConflictException(
            'You already reserved a seat for this concert',
          );
        }

        const seatUpdateResult = await tx.concert.updateMany({
          where: {
            id: concertId,
            availableSeats: { gt: 0 },
          },
          data: {
            availableSeats: { decrement: 1 },
          },
        });

        if (seatUpdateResult.count === 0) {
          throw new BadRequestException('No seats available for this concert');
        }

        return tx.reservation.create({
          data: {
            userId: currentUser.userId,
            concertId,
            status: ReservationStatus.RESERVED,
          },
          include: {
            user: true,
            concert: true,
          },
        });
      });
    } catch (error: unknown) {
      throw new InternalServerErrorException('Failed to create reservation');
    }
  }

  findAll(currentUser: AccessTokenPayload) {
    if (currentUser.role === 'ADMIN') {
      return this.prisma.reservation.findMany({
        include: {
          user: true,
          concert: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }

    return this.prisma.reservation.findMany({
      where: {
        userId: currentUser.userId,
      },
      include: {
        user: true,
        concert: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number, currentUser: AccessTokenPayload) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
      include: {
        user: true,
        concert: true,
      },
    });

    if (!reservation) {
      throw new NotFoundException(`Reservation ${id} not found`);
    }

    return reservation;
  }

  async cancel(id: number, currentUser: AccessTokenPayload) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
    });

    if (!reservation) {
      throw new NotFoundException(`Reservation ${id} not found`);
    }

    if (reservation.status === ReservationStatus.CANCELLED) {
      return this.prisma.reservation.findUnique({
        where: { id },
        include: {
          user: true,
          concert: true,
        },
      });
    }

    try {
      return await this.prisma.$transaction(async (tx) => {
        await tx.concert.update({
          where: { id: reservation.concertId },
          data: {
            availableSeats: { increment: 1 },
          },
        });

        return tx.reservation.update({
          where: { id },
          data: {
            status: ReservationStatus.CANCELLED,
          },
          include: {
            user: true,
            concert: true,
          },
        });
      });
    } catch (error: unknown) {
      throw new InternalServerErrorException('Failed to cancel reservation');
    }
  }
}
