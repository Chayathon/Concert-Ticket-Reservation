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
  await prisma.reservationEvent.deleteMany();
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

  await prisma.user.create({
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
      reserved: 1,
    },
  });

  const concert2 = await prisma.concert.create({
    data: {
      name: 'Jazz Night Live',
      description: 'A relaxing evening with smooth jazz.',
      totalSeats: 50,
      reserved: 0,
    },
  });

  const concert3 = await prisma.concert.create({
    data: {
      name: 'Pop Idol Tour 2026',
      description: 'The most anticipated pop concert.',
      totalSeats: 1,
      reserved: 1,
    },
  });

  // จำลองประวัติการจอง
  const reservation1 = await prisma.reservation.create({
    data: {
      userId: user1.id,
      concertId: concert1.id,
      status: ReservationStatus.RESERVED,
    },
  });

  const reservation2 = await prisma.reservation.create({
    data: {
      userId: user2.id,
      concertId: concert3.id,
      status: ReservationStatus.RESERVED,
    },
  });

  await prisma.reservationEvent.create({
    data: {
      reservationId: reservation1.id,
      event: ReservationStatus.RESERVED,
    },
  });

  await prisma.reservationEvent.create({
    data: {
      reservationId: reservation2.id,
      event: ReservationStatus.RESERVED,
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
