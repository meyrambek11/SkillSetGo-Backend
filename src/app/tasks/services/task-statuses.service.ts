import { Injectable } from '@nestjs/common';
import { TaskStatus, TaskStatusCodes } from '../entities/task-statuses.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TaskStatusService {
  constructor(
    @InjectRepository(TaskStatus)
    private taskStatusRepository: Repository<TaskStatus>,
  ) {}

  async getOneByCode(code: TaskStatusCodes): Promise<TaskStatus> {
    return await this.taskStatusRepository.findOne({
      where: { code },
    });
  }

  async getAll(): Promise<TaskStatus[]> {
    return await this.taskStatusRepository.find();
  }
}
