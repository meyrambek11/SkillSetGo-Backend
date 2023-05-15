import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserInfo } from 'src/common/decorators/user.decorator';
import { UserMetadata } from 'src/common/types/userMetadata';
import { StoreTaskDto, TaskQuery, UpdateTaskDto } from './tasks.dto';
import { TaskService } from './services/tasks.service';
import { Task } from './entities/tasks.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetAllResponse } from 'src/common/types/get-all.response';
import { TaskStatusService } from './services/task-statuses.service';
import { TaskStatus } from './entities/task-statuses.entity';
import { DeleteResult } from 'typeorm';

@UseGuards(JwtAuthGuard)
@Controller('task')
export class TaskController {
  constructor(
    private taskService: TaskService,
    private taskStatusService: TaskStatusService,
  ) {}

  @Get('statuses')
  getAllStatuses(): Promise<TaskStatus[]> {
    return this.taskStatusService.getAll();
  }

  @Post()
  store(
    @UserInfo() user: UserMetadata,
    @Body() payload: StoreTaskDto,
  ): Promise<Task> {
    return this.taskService.store(user, payload);
  }

  @Patch('/:id')
  update(
    @UserInfo() user: UserMetadata,
    @Body() payload: UpdateTaskDto,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Task> {
    return this.taskService.update(user, payload, id);
  }

  @Get('/:id')
  getOne(@Param('id', ParseUUIDPipe) id: string): Promise<Task> {
    return this.taskService.getOne(id);
  }

  @Get()
  getAll(@Query() query: TaskQuery): Promise<GetAllResponse<Task>> {
    return this.taskService.getAll(query);
  }

  @Delete('/:id')
  delete(
    @Param('id', ParseUUIDPipe) id: string,
    @UserInfo() user: UserMetadata,
  ): Promise<DeleteResult> {
    return this.taskService.delete(id, user);
  }
}
