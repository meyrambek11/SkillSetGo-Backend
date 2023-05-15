import { Module } from '@nestjs/common';
import { TaskController } from './tasks.controller';
import { TaskService } from './services/tasks.service';
import { TaskStatusService } from './services/task-statuses.service';
import { TaskStatus } from './entities/task-statuses.entity';
import { Task } from './entities/tasks.entity';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Task, TaskStatus]),
    UsersModule,
  ],
  controllers: [TaskController],
  providers: [TaskService, TaskStatusService],
  exports: [TaskService],
})
export class TasksModule {}
