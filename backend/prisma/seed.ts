import {
  PrismaClient,
  Role,
  ReservationStatus,
} from './../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // ล้างข้อมูลเก่าทิ้ง
  await prisma.user.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.concert.deleteMany();

  const user1 = await prisma.user.create({
    data: {
      name: 'John Doe',
      role: Role.USER,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Jane Doe',
      role: Role.USER,
    },
  });

  const admin = await prisma.user.create({
    data: {
      name: 'Admin',
      role: Role.ADMIN,
    },
  });

  // สร้าง Concerts
  const concert1 = await prisma.concert.create({
    data: {
      name: 'Rock Fest 2026',
      description: 'The biggest rock festival of the year!',
      totalSeats: 100,
      availableSeats: 100,
    },
  });

  const concert2 = await prisma.concert.create({
    data: {
      name: 'Jazz Night Live',
      description: 'A relaxing evening with smooth jazz.',
      totalSeats: 50,
      availableSeats: 50,
    },
  });

  const concert3 = await prisma.concert.create({
    data: {
      name: 'Pop Idol Tour 2026',
      description: 'The most anticipated pop concert.',
      totalSeats: 2,
      availableSeats: 0,
    },
  });

  // จำลองประวัติการจอง
  await prisma.reservation.create({
    data: {
      userId: user1.id,
      concertId: concert1.id,
      status: ReservationStatus.RESERVED,
    },
  });

  await prisma.reservation.create({
    data: {
      userId: user2.id,
      concertId: concert3.id,
      status: ReservationStatus.RESERVED,
    },
  });

  // ลองจำลองการกดยกเลิก
  await prisma.reservation.create({
    data: {
      userId: user1.id,
      concertId: concert2.id,
      status: ReservationStatus.CANCELLED,
    },
  });

  console.log('Seed Success!');
}

main()
  .catch((e) => {
    console.error('Error during Seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
