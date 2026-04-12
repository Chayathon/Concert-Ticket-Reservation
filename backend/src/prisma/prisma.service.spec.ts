import { PrismaService } from './prisma.service';

const connectMock = jest.fn();
const disconnectMock = jest.fn();
const poolEndMock = jest.fn();

jest.mock('../../generated/prisma/client', () => {
  class PrismaClientMock {
    $connect = connectMock;
    $disconnect = disconnectMock;

    constructor(_options?: unknown) {}
  }

  return {
    PrismaClient: PrismaClientMock,
  };
});

jest.mock('pg', () => ({
  Pool: jest.fn().mockImplementation(() => ({
    end: poolEndMock,
  })),
}));

jest.mock('@prisma/adapter-pg', () => ({
  PrismaPg: jest.fn().mockImplementation(() => ({
    adapter: true,
  })),
}));

describe('PrismaService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize and call $connect on module init', async () => {
    const service = new PrismaService();

    await service.onModuleInit();

    expect(connectMock).toHaveBeenCalled();
  });

  it('should disconnect prisma and close pool on module destroy', async () => {
    const service = new PrismaService();

    await service.onModuleDestroy();

    expect(disconnectMock).toHaveBeenCalled();
    expect(poolEndMock).toHaveBeenCalled();
  });
});
