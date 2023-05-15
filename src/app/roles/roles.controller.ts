import { Controller, Get } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Role } from './roles.entity';

@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @Get()
  getAll(): Promise<Role[]> {
    return this.rolesService.getAll();
  }
}
