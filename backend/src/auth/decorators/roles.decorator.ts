import { SetMetadata } from '@nestjs/common';
import { type AccessTokenPayload } from '../auth.constants';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: AccessTokenPayload['role'][]) =>
  SetMetadata(ROLES_KEY, roles);
