import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

import { ROLES_KEY } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/models/roles.model';
import { PayloadToken } from 'src/auth/models/token.model';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<Role[]>(ROLES_KEY, context.getHandler());

    if (!roles) return true;
    // ['admin', 'customer'];
    const request = context.switchToHttp().getRequest();
    const user = request.user as PayloadToken;

    // { role: 'admin', sub: 1212 }
    const isAuth = roles.some((role) => role === user.role);

    // if (!isAuth) throw new UnauthorizedException('your role is wrong');
    if (!isAuth)
      throw new UnauthorizedException('No tiene los permisos necesarios');

    return isAuth;
  }
}
