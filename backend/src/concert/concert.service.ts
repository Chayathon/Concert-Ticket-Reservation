import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateConcertDto } from './dto/create-concert.dto';
import { UpdateConcertDto } from './dto/update-concert.dto';

@Injectable()
export class ConcertService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createConcertDto: CreateConcertDto) {
    try {
      return await this.prisma.concert.create({
        data: {
          ...createConcertDto,
          availableSeats: createConcertDto.totalSeats,
        },
      });
    } catch (error: unknown) {
      throw new InternalServerErrorException('Failed to create concert');
    }
  }

  async findAll() {
    return this.prisma.concert.findMany({
      orderBy: {
        id: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const concert = await this.prisma.concert.findUnique({
      where: { id },
    });

    if (!concert) {
      throw new NotFoundException(`Concert ${id} not found`);
    }

    return concert;
  }

  async update(id: number, updateConcertDto: UpdateConcertDto) {
    const concert = await this.prisma.concert.findUnique({ where: { id } });
    if (!concert) {
      throw new NotFoundException(`Concert ${id} not found`);
    }

    try {
      return await this.prisma.concert.update({
        where: { id },
        data: {
          ...updateConcertDto,
          availableSeats: updateConcertDto.totalSeats,
        },
      });
    } catch (error: unknown) {
      throw new InternalServerErrorException('Failed to update concert');
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.concert.delete({
        where: { id },
      });
    } catch (error: unknown) {
      throw new InternalServerErrorException('Failed to delete concert');
    }
  }
}
