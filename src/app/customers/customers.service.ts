import { Injectable } from '@nestjs/common';
import { UserMetadata } from 'src/common/types/userMetadata';
import { TaskService } from '../tasks/services/tasks.service';
import { GetAllResponse } from 'src/common/types/get-all.response';
import { Task } from '../tasks/entities/tasks.entity';
import { TaskStatusCodes } from '../tasks/entities/task-statuses.entity';

@Injectable()
export class CustomerService {
  constructor(private taskService: TaskService) {}

  async getTasks(
    user: UserMetadata,
    code: TaskStatusCodes,
  ): Promise<GetAllResponse<Task>> {
    return await this.taskService.getManyByUser(user.id, code);
  }
}
