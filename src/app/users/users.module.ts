import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { ReferencesModule } from '../references/references.module';
import { RolesModule } from '../roles/roles.module';
import { FreelancersModule } from '../freelancers/freelancers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ReferencesModule,
    RolesModule,
    FreelancersModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
