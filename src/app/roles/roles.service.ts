import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Role, RoleCodes } from './roles.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async getAll(): Promise<Role[]> {
    return await this.roleRepository.find({
      where: { code: In([RoleCodes.CUSTOMER, RoleCodes.FREELANCER]) },
    });
  }

  async getOneByCode(code: RoleCodes): Promise<Role> {
    return await this.roleRepository.findOne({
      where: { code },
    });
  }

  async getOne(id: string): Promise<Role> {
    return await this.roleRepository.findOne({
      where: { id },
    });
  }
}
