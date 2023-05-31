import { CanActivate, ExecutionContext, Type, mixin } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserMetadata } from 'src/common/types/userMetadata';
import { RoleCodes } from '../roles/roles.entity';

const AdministrationGuard = (): Type<CanActivate> => {
  class AdministrationMixin extends JwtAuthGuard {
    async canActivate(context: ExecutionContext) {
      await super.canActivate(context);

      const request = context
        .switchToHttp()
        .getRequest<{ user?: UserMetadata }>();
      const user = request.user;

      return user.role.code == RoleCodes.ADMIN;
    }
  }

  return mixin(AdministrationMixin);
};

export default AdministrationGuard;
