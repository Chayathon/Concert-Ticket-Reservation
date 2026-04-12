import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConcertService } from './concert.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ConcertService', () => {
  let service: ConcertService;
  let prisma: {
    concert: {
      create: jest.Mock;
      findMany: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      concert: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConcertService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<ConcertService>(ConcertService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should create concert with reserved set to 0', async () => {
    prisma.concert.create.mockResolvedValue({
      id: 1,
      name: 'Concert A',
      description: 'Desc',
      totalSeats: 100,
      reserved: 0,
    });

    const dto = {
      name: 'Concert A',
      description: 'Desc',
      totalSeats: 100,
    };

    const result = await service.create(dto);

    expect(prisma.concert.create).toHaveBeenCalledWith({
      data: {
        ...dto,
        reserved: 0,
      },
    });
    expect(result.id).toBe(1);
  });

  it('create should throw InternalServerErrorException when prisma create fails', async () => {
    prisma.concert.create.mockRejectedValue(new Error('db error'));

    await expect(
      service.create({
        name: 'Concert A',
        description: 'Desc',
        totalSeats: 100,
      }),
    ).rejects.toThrow(InternalServerErrorException);
  });

  it('findAll should return ordered concerts', async () => {
    prisma.concert.findMany.mockResolvedValue([{ id: 1 }, { id: 2 }]);

    const result = await service.findAll();

    expect(prisma.concert.findMany).toHaveBeenCalledWith({
      orderBy: { id: 'asc' },
    });
    expect(result).toEqual([{ id: 1 }, { id: 2 }]);
  });

  it('findOne should return concert when found', async () => {
    prisma.concert.findUnique.mockResolvedValue({ id: 10, reserved: 0 });

    const result = await service.findOne(10);

    expect(result).toEqual({ id: 10, reserved: 0 });
  });

  it('findOne should throw NotFoundException when concert not found', async () => {
    prisma.concert.findUnique.mockResolvedValue(null);

    await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
  });

  it('update should update concert when valid', async () => {
    prisma.concert.findUnique.mockResolvedValue({ id: 1, reserved: 5 });
    prisma.concert.update.mockResolvedValue({
      id: 1,
      totalSeats: 20,
      reserved: 5,
    });

    const result = await service.update(1, { totalSeats: 20 });

    expect(prisma.concert.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { totalSeats: 20 },
    });
    expect(result.totalSeats).toBe(20);
  });

  it('update should throw NotFoundException when concert not found', async () => {
    prisma.concert.findUnique.mockResolvedValue(null);

    await expect(service.update(404, { totalSeats: 20 })).rejects.toThrow(
      NotFoundException,
    );
  });

  it('update should throw BadRequestException when totalSeats is less than reserved', async () => {
    prisma.concert.findUnique.mockResolvedValue({ id: 1, reserved: 10 });

    await expect(service.update(1, { totalSeats: 5 })).rejects.toThrow(
      BadRequestException,
    );
  });

  it('update should throw InternalServerErrorException when prisma update fails', async () => {
    prisma.concert.findUnique.mockResolvedValue({ id: 1, reserved: 10 });
    prisma.concert.update.mockRejectedValue(new Error('db update error'));

    await expect(service.update(1, { totalSeats: 20 })).rejects.toThrow(
      InternalServerErrorException,
    );
  });

  it('delete should remove concert when found', async () => {
    prisma.concert.findUnique.mockResolvedValue({ id: 1 });
    prisma.concert.delete.mockResolvedValue({ id: 1 });

    const result = await service.delete(1);

    expect(prisma.concert.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(result).toEqual({ id: 1 });
  });

  it('delete should throw NotFoundException when concert not found', async () => {
    prisma.concert.findUnique.mockResolvedValue(null);

    await expect(service.delete(999)).rejects.toThrow(NotFoundException);
  });

  it('delete should throw InternalServerErrorException when prisma delete fails', async () => {
    prisma.concert.findUnique.mockResolvedValue({ id: 1 });
    prisma.concert.delete.mockRejectedValue(new Error('db delete error'));

    await expect(service.delete(1)).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});
