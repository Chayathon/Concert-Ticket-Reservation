import { validateSync } from 'class-validator';
import { AppModule } from './app.module';
import { AuthModule } from './auth/auth.module';
import { ConcertModule } from './concert/concert.module';
import { ReservationModule } from './reservation/reservation.module';
import { PrismaModule } from './prisma/prisma.module';
import { CreateAuthDto } from './auth/dto/create-auth.dto';
import { UpdateAuthDto } from './auth/dto/update-auth.dto';
import { UpdateReservationDto } from './reservation/dto/update-reservation.dto';
import { Auth } from './auth/entities/auth.entity';
import { Concert } from './concert/entities/concert.entity';
import { Reservation } from './reservation/entities/reservation.entity';
import { Roles, ROLES_KEY } from './auth/decorators/roles.decorator';
import { ReservationStatus } from '../generated/prisma/enums';

describe('Structure coverage tests', () => {
  it('module classes should be constructable', () => {
    expect(new AppModule()).toBeInstanceOf(AppModule);
    expect(new AuthModule()).toBeInstanceOf(AuthModule);
    expect(new ConcertModule()).toBeInstanceOf(ConcertModule);
    expect(new ReservationModule()).toBeInstanceOf(ReservationModule);
    expect(new PrismaModule()).toBeInstanceOf(PrismaModule);
  });

  it('dto classes should be constructable', () => {
    expect(new CreateAuthDto()).toBeInstanceOf(CreateAuthDto);
    expect(new UpdateAuthDto()).toBeInstanceOf(UpdateAuthDto);
  });

  it('update reservation dto should validate enum status', () => {
    const dto = new UpdateReservationDto();
    dto.status = ReservationStatus.RESERVED;

    const validErrors = validateSync(dto);
    expect(validErrors).toHaveLength(0);

    const invalid = new UpdateReservationDto();
    (invalid as unknown as { status: string }).status = 'INVALID_STATUS';

    const invalidErrors = validateSync(invalid);
    expect(invalidErrors.length).toBeGreaterThan(0);
  });

  it('entity classes should be constructable', () => {
    expect(new Auth()).toBeInstanceOf(Auth);
    expect(new Concert()).toBeInstanceOf(Concert);
    expect(new Reservation()).toBeInstanceOf(Reservation);
  });

  it('roles decorator should store metadata', () => {
    class DummyController {
      @Roles('ADMIN', 'USER')
      handle() {}
    }

    const roles = Reflect.getMetadata(
      ROLES_KEY,
      DummyController.prototype.handle,
    );
    expect(roles).toEqual(['ADMIN', 'USER']);
  });
});
