import { Test, TestingModule } from '@nestjs/testing';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';

describe('ReservationController', () => {
  let controller: ReservationController;
  let reservationService: {
    create: jest.Mock;
    findAll: jest.Mock;
    findEvents: jest.Mock;
    summary: jest.Mock;
    cancel: jest.Mock;
  };

  beforeEach(async () => {
    reservationService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findEvents: jest.fn(),
      summary: jest.fn(),
      cancel: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationController],
      providers: [
        {
          provide: ReservationService,
          useValue: reservationService,
        },
      ],
    }).compile();

    controller = module.get<ReservationController>(ReservationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create should forward current user and dto', async () => {
    const user = { userId: 1, role: 'USER' as const };
    const dto = { concertId: 10 };
    reservationService.create.mockResolvedValue({ id: 100 });

    const result = await controller.create(user, dto);

    expect(reservationService.create).toHaveBeenCalledWith(user, dto);
    expect(result).toEqual({ id: 100 });
  });

  it('findAll should forward current user', async () => {
    const user = { userId: 2, role: 'ADMIN' as const };
    reservationService.findAll.mockResolvedValue([{ id: 1 }]);

    const result = await controller.findAll(user);

    expect(reservationService.findAll).toHaveBeenCalledWith(user);
    expect(result).toEqual([{ id: 1 }]);
  });

  it('findEvents should forward current user', async () => {
    const user = { userId: 3, role: 'USER' as const };
    reservationService.findEvents.mockResolvedValue([{ id: 99 }]);

    const result = await controller.findEvents(user);

    expect(reservationService.findEvents).toHaveBeenCalledWith(user);
    expect(result).toEqual([{ id: 99 }]);
  });

  it('summary should return reservation summary', async () => {
    reservationService.summary.mockResolvedValue({
      totalSeats: 100,
      reserved: 80,
      cancelled: 3,
    });

    const result = await controller.summary();

    expect(reservationService.summary).toHaveBeenCalled();
    expect(result).toEqual({
      totalSeats: 100,
      reserved: 80,
      cancelled: 3,
    });
  });

  it('cancel should forward id and current user', async () => {
    const user = { userId: 9, role: 'USER' as const };
    reservationService.cancel.mockResolvedValue({ id: 44 });

    const result = await controller.cancel(44, user);

    expect(reservationService.cancel).toHaveBeenCalledWith(44, user);
    expect(result).toEqual({ id: 44 });
  });
});
