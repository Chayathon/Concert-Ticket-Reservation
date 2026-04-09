import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { type AccessTokenPayload } from '../auth.constants';
import { ROLES_KEY } from '../decorators/roles.decorator';

type RequestWithUser = {
  user?: AccessTokenPayload;
};

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = Reflect.getMetadata(
      ROLES_KEY,
      context.getHandler(),
    ) as AccessTokenPayload['role'][] | undefined;

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const currentUserRole = request.user?.role;

    if (!currentUserRole || !requiredRoles.includes(currentUserRole)) {
      throw new ForbiddenException('Insufficient role');
    }

    return true;
  }
}
