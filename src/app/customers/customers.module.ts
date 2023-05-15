import { Module } from '@nestjs/common';
import { CustomerController } from './customers.controller';
import { CustomerService } from './customers.service';
import { ConfigModule } from '@nestjs/config';
import { TasksModule } from '../tasks/tasks.module';

@Module({
  imports: [ConfigModule.forRoot(), TasksModule],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomersModule {}
