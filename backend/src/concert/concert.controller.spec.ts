import { Test, TestingModule } from '@nestjs/testing';
import { ConcertController } from './concert.controller';
import { ConcertService } from './concert.service';

describe('ConcertController', () => {
  let controller: ConcertController;
  let concertService: {
    create: jest.Mock;
    findAll: jest.Mock;
    findOne: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };

  beforeEach(async () => {
    concertService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConcertController],
      providers: [
        {
          provide: ConcertService,
          useValue: concertService,
        },
      ],
    }).compile();

    controller = module.get<ConcertController>(ConcertController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create should forward dto to service', async () => {
    const dto = { name: 'A', description: 'B', totalSeats: 10 };
    concertService.create.mockResolvedValue({ id: 1, ...dto, reserved: 0 });

    const result = await controller.create(dto);

    expect(concertService.create).toHaveBeenCalledWith(dto);
    expect(result.id).toBe(1);
  });

  it('findAll should return all concerts', async () => {
    concertService.findAll.mockResolvedValue([{ id: 1 }, { id: 2 }]);

    const result = await controller.findAll();

    expect(concertService.findAll).toHaveBeenCalled();
    expect(result).toEqual([{ id: 1 }, { id: 2 }]);
  });

  it('findOne should forward id to service', async () => {
    concertService.findOne.mockResolvedValue({ id: 7 });

    const result = await controller.findOne(7);

    expect(concertService.findOne).toHaveBeenCalledWith(7);
    expect(result).toEqual({ id: 7 });
  });

  it('update should forward id and dto to service', async () => {
    const dto = { description: 'Updated' };
    concertService.update.mockResolvedValue({ id: 3, description: 'Updated' });

    const result = await controller.update(3, dto);

    expect(concertService.update).toHaveBeenCalledWith(3, dto);
    expect(result).toEqual({ id: 3, description: 'Updated' });
  });

  it('delete should forward id to service', async () => {
    concertService.delete.mockResolvedValue({ id: 5 });

    const result = await controller.delete(5);

    expect(concertService.delete).toHaveBeenCalledWith(5);
    expect(result).toEqual({ id: 5 });
  });
});
