import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { PrismaService } from '../prisma/prisma.service';
import { ReservationStatus } from '../../generated/prisma/client';

describe('ReservationService', () => {
  let service: ReservationService;
  let prisma: {
    reservation: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      count: jest.Mock;
    };
    reservationEvent: {
      findMany: jest.Mock;
      create: jest.Mock;
    };
    concert: {
      aggregate: jest.Mock;
      updateMany: jest.Mock;
      update: jest.Mock;
      findUnique: jest.Mock;
    };
    $transaction: jest.Mock;
  };

  let tx: {
    reservation: {
      findUnique: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
    };
    reservationEvent: {
      create: jest.Mock;
    };
    concert: {
      findUnique: jest.Mock;
      updateMany: jest.Mock;
      update: jest.Mock;
    };
  };

  beforeEach(async () => {
    tx = {
      reservation: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      reservationEvent: {
        create: jest.fn(),
      },
      concert: {
        findUnique: jest.fn(),
        updateMany: jest.fn(),
        update: jest.fn(),
      },
    };

    prisma = {
      reservation: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        count: jest.fn(),
      },
      reservationEvent: {
        findMany: jest.fn(),
        create: jest.fn(),
      },
      concert: {
        aggregate: jest.fn(),
        updateMany: jest.fn(),
        update: jest.fn(),
        findUnique: jest.fn(),
      },
      $transaction: jest.fn(async (arg: unknown) => {
        if (typeof arg === 'function') {
          return arg(tx);
        }

        return [{ _sum: { totalSeats: 300 } }, 120, 10];
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<ReservationService>(ReservationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should create reservation when concert exists and seats are available', async () => {
    const user = { userId: 1, role: 'USER' as const };

    tx.concert.findUnique.mockResolvedValue({ id: 10, totalSeats: 100 });
    tx.reservation.findUnique.mockResolvedValue(null);
    tx.concert.updateMany.mockResolvedValue({ count: 1 });
    tx.reservation.create.mockResolvedValue({
      id: 22,
      userId: 1,
      concertId: 10,
      status: ReservationStatus.RESERVED,
    });
    tx.reservation.findUnique
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({
        id: 22,
        user: { id: 1, name: 'Alice' },
        concert: { id: 10, name: 'Show' },
      });

    const result = await service.create(user, { concertId: 10 });

    expect(tx.concert.updateMany).toHaveBeenCalledWith({
      where: {
        id: 10,
        reserved: { lt: 100 },
      },
      data: {
        reserved: { increment: 1 },
      },
    });
    expect(tx.reservationEvent.create).toHaveBeenCalled();
    expect(result).toEqual({
      id: 22,
      user: { id: 1, name: 'Alice' },
      concert: { id: 10, name: 'Show' },
    });
  });

  it('create should throw NotFoundException when concert does not exist', async () => {
    tx.concert.findUnique.mockResolvedValue(null);

    await expect(
      service.create(
        { userId: 1, role: 'USER' },
        {
          concertId: 999,
        },
      ),
    ).rejects.toThrow(NotFoundException);
  });

  it('create should throw ConflictException when reservation is already RESERVED', async () => {
    tx.concert.findUnique.mockResolvedValue({ id: 10, totalSeats: 50 });
    tx.reservation.findUnique.mockResolvedValue({
      id: 7,
      status: ReservationStatus.RESERVED,
    });

    await expect(
      service.create(
        { userId: 1, role: 'USER' },
        {
          concertId: 10,
        },
      ),
    ).rejects.toThrow(ConflictException);
  });

  it('create should throw BadRequestException when no seats are available', async () => {
    tx.concert.findUnique.mockResolvedValue({ id: 10, totalSeats: 50 });
    tx.reservation.findUnique.mockResolvedValue(null);
    tx.concert.updateMany.mockResolvedValue({ count: 0 });

    await expect(
      service.create(
        { userId: 1, role: 'USER' },
        {
          concertId: 10,
        },
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('findAll should return all reservations for ADMIN', async () => {
    prisma.reservation.findMany.mockResolvedValue([{ id: 1 }, { id: 2 }]);

    const result = await service.findAll({ userId: 999, role: 'ADMIN' });

    expect(prisma.reservation.findMany).toHaveBeenCalledWith({
      include: {
        user: true,
        concert: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    expect(result).toEqual([{ id: 1 }, { id: 2 }]);
  });

  it('findAll should return user reservations for USER', async () => {
    prisma.reservation.findMany.mockResolvedValue([{ id: 10 }]);

    const result = await service.findAll({ userId: 2, role: 'USER' });

    expect(prisma.reservation.findMany).toHaveBeenCalledWith({
      where: {
        userId: 2,
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
    expect(result).toEqual([{ id: 10 }]);
  });

  it('findEvents should return all events for ADMIN', async () => {
    prisma.reservationEvent.findMany.mockResolvedValue([{ id: 1 }]);

    const result = await service.findEvents({ userId: 1, role: 'ADMIN' });

    expect(prisma.reservationEvent.findMany).toHaveBeenCalledWith({
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
    expect(result).toEqual([{ id: 1 }]);
  });

  it('findEvents should return only current user events for USER', async () => {
    prisma.reservationEvent.findMany.mockResolvedValue([{ id: 2 }]);

    const result = await service.findEvents({ userId: 9, role: 'USER' });

    expect(prisma.reservationEvent.findMany).toHaveBeenCalledWith({
      where: {
        reservation: {
          userId: 9,
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
    expect(result).toEqual([{ id: 2 }]);
  });

  it('summary should return aggregate counts', async () => {
    const result = await service.summary();

    expect(prisma.$transaction).toHaveBeenCalled();
    expect(result).toEqual({
      totalSeats: 300,
      reserved: 120,
      cancelled: 10,
    });
  });

  it('cancel should throw NotFoundException when reservation does not exist', async () => {
    prisma.reservation.findUnique.mockResolvedValue(null);

    await expect(
      service.cancel(9, { userId: 1, role: 'USER' }),
    ).rejects.toThrow(NotFoundException);
  });

  it('cancel should throw ForbiddenException when user is not owner', async () => {
    prisma.reservation.findUnique.mockResolvedValue({
      id: 1,
      userId: 7,
      concertId: 3,
      status: ReservationStatus.RESERVED,
    });

    await expect(
      service.cancel(1, { userId: 8, role: 'USER' }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('cancel should return reservation as-is when already cancelled', async () => {
    prisma.reservation.findUnique.mockResolvedValue({
      id: 1,
      userId: 8,
      concertId: 3,
      status: ReservationStatus.CANCELLED,
    });

    const result = await service.cancel(1, { userId: 8, role: 'USER' });

    expect(result).toEqual({
      id: 1,
      userId: 8,
      concertId: 3,
      status: ReservationStatus.CANCELLED,
    });
  });

  it('cancel should update reservation and decrement reserved seats', async () => {
    prisma.reservation.findUnique.mockResolvedValue({
      id: 50,
      userId: 2,
      concertId: 88,
      status: ReservationStatus.RESERVED,
    });

    tx.reservation.update.mockResolvedValue({
      id: 50,
      status: ReservationStatus.CANCELLED,
    });
    tx.reservation.findUnique.mockResolvedValue({
      id: 50,
      status: ReservationStatus.CANCELLED,
      user: { id: 2 },
      concert: { id: 88 },
    });

    const result = await service.cancel(50, { userId: 2, role: 'USER' });

    expect(tx.concert.update).toHaveBeenCalledWith({
      where: { id: 88 },
      data: {
        reserved: { decrement: 1 },
      },
    });
    expect(tx.reservationEvent.create).toHaveBeenCalledWith({
      data: {
        reservationId: 50,
        event: ReservationStatus.CANCELLED,
      },
    });
    expect(result).toEqual({
      id: 50,
      status: ReservationStatus.CANCELLED,
      user: { id: 2 },
      concert: { id: 88 },
    });
  });
});
