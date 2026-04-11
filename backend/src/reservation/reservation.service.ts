import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ReservationStatus } from '../../generated/prisma/client';
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

    return this.prisma.$transaction(async (tx) => {
      const concert = await tx.concert.findUnique({
        where: { id: concertId },
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
          reserved: { lt: concert.totalSeats },
        },
        data: {
          reserved: { increment: 1 },
        },
      });

      if (seatUpdateResult.count === 0) {
        throw new BadRequestException('No seats available for this concert');
      }

      const reservation = existingReservation
        ? await tx.reservation.update({
            where: { id: existingReservation.id },
            data: { status: ReservationStatus.RESERVED },
          })
        : await tx.reservation.create({
            data: {
              userId: currentUser.userId,
              concertId,
              status: ReservationStatus.RESERVED,
            },
          });

      await tx.reservationEvent.create({
        data: {
          reservationId: reservation.id,
          event: ReservationStatus.RESERVED,
        },
      });

      return tx.reservation.findUnique({
        where: { id: reservation.id },
        include: {
          user: true,
          concert: true,
        },
      });
    });
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
        events: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  findEvents(currentUser: AccessTokenPayload) {
    if (currentUser.role === 'ADMIN') {
      return this.prisma.reservationEvent.findMany({
        include: {
          reservation: {
            include: {
              user: true,
              concert: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }

    return this.prisma.reservationEvent.findMany({
      where: {
        reservation: {
          userId: currentUser.userId,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        reservation: {
          include: {
            user: true,
            concert: true,
          },
        },
      },
    });
  }

  async summary() {
    const [totalSeats, reservedCount, cancelledCount] =
      await this.prisma.$transaction([
        this.prisma.concert.aggregate({
          _sum: {
            totalSeats: true,
          },
        }),
        this.prisma.reservation.count({
          where: {
            status: ReservationStatus.RESERVED,
          },
        }),
        this.prisma.reservation.count({
          where: {
            status: ReservationStatus.CANCELLED,
          },
        }),
      ]);

    return {
      totalSeats: totalSeats._sum.totalSeats ?? 0,
      reserved: reservedCount,
      cancelled: cancelledCount,
    };
  }

  async cancel(id: number, currentUser: AccessTokenPayload) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
    });

    if (!reservation) {
      throw new NotFoundException(`Reservation ${id} not found`);
    }

    if (reservation.userId !== currentUser.userId) {
      throw new ForbiddenException('You can only cancel your own reservation');
    }

    if (reservation.status === ReservationStatus.CANCELLED) {
      return reservation;
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.concert.update({
        where: { id: reservation.concertId },
        data: {
          reserved: { decrement: 1 },
        },
      });

      const updatedReservation = await tx.reservation.update({
        where: { id },
        data: {
          status: ReservationStatus.CANCELLED,
        },
      });

      await tx.reservationEvent.create({
        data: {
          reservationId: updatedReservation.id,
          event: ReservationStatus.CANCELLED,
        },
      });

      return tx.reservation.findUnique({
        where: { id },
        include: {
          user: true,
          concert: true,
        },
      });
    });
  }
}
