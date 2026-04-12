import { ForbiddenException } from '@nestjs/common';
import { RolesGuard } from './roles.guard';
import { ROLES_KEY } from '../decorators/roles.decorator';

describe('RolesGuard', () => {
  let guard: RolesGuard;

  beforeEach(() => {
    guard = new RolesGuard();
    jest.restoreAllMocks();
  });

  function createExecutionContext(userRole?: 'USER' | 'ADMIN') {
    return {
      getHandler: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({
          user: userRole ? { role: userRole, userId: 1 } : undefined,
        }),
      }),
    } as never;
  }

  it('returns true when no roles metadata exists', () => {
    jest.spyOn(Reflect, 'getMetadata').mockReturnValue(undefined);

    const result = guard.canActivate(createExecutionContext('USER'));

    expect(result).toBe(true);
  });

  it('returns true when roles metadata is empty', () => {
    jest.spyOn(Reflect, 'getMetadata').mockReturnValue([]);

    const result = guard.canActivate(createExecutionContext('USER'));

    expect(result).toBe(true);
  });

  it('throws ForbiddenException when user role is missing', () => {
    jest.spyOn(Reflect, 'getMetadata').mockReturnValue(['ADMIN']);

    expect(() => guard.canActivate(createExecutionContext())).toThrow(
      new ForbiddenException('Insufficient role'),
    );
  });

  it('throws ForbiddenException when user role is not allowed', () => {
    jest.spyOn(Reflect, 'getMetadata').mockReturnValue(['ADMIN']);

    expect(() => guard.canActivate(createExecutionContext('USER'))).toThrow(
      new ForbiddenException('Insufficient role'),
    );
  });

  it('returns true when user role is allowed', () => {
    jest
      .spyOn(Reflect, 'getMetadata')
      .mockImplementation((metadataKey: unknown) => {
        if (metadataKey === ROLES_KEY) {
          return ['ADMIN'];
        }
        return undefined;
      });

    const result = guard.canActivate(createExecutionContext('ADMIN'));

    expect(result).toBe(true);
  });
});
