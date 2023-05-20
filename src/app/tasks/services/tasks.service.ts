import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { StoreTaskDto, TaskQuery, UpdateTaskDto } from '../tasks.dto';
import { UserMetadata } from 'src/common/types/userMetadata';
import { UsersService } from 'src/app/users/users.service';
import { RoleCodes } from 'src/app/roles/roles.entity';
import { TaskStatusService } from './task-statuses.service';
import { TaskStatusCodes } from '../entities/task-statuses.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from '../entities/tasks.entity';
import {
  Brackets,
  DeleteResult,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { GetAllResponse } from 'src/common/types/get-all.response';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    private userService: UsersService,
    private taskStatusService: TaskStatusService,
  ) {}

  async store(user: UserMetadata, payload: StoreTaskDto): Promise<Task> {
    const author = await this.userService.getOne(user.id);

    if (author.role.code !== RoleCodes.CUSTOMER)
      throw new HttpException(
        `User role is not custumer`,
        HttpStatus.BAD_REQUEST,
      );

    const status = await this.taskStatusService.getOneByCode(
      TaskStatusCodes.NEW,
    );

    return await this.taskRepository.save({
      ...payload,
      user: { id: author.id },
      status,
      currency: author.currency,
    });
  }

  async update(
    user: UserMetadata,
    payload: UpdateTaskDto,
    id: string,
  ): Promise<Task> {
    const task = await this.getOneByUser(user.id, id);

    if (task.status.code == TaskStatusCodes.APPOINTED) return task;

    return await this.taskRepository.save({
      id: task.id,
      ...payload,
    });
  }

  async getOneByUser(userId: string, id: string): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['status'],
    });

    if (!task)
      throw new HttpException(
        `Task with id: ${id} does not exist`,
        HttpStatus.BAD_REQUEST,
      );

    return task;
  }

  async getOne(id: string): Promise<Task> {
    return await this.taskRepository.findOne({
      where: { id },
      relations: [
        'user',
        'user.country',
        'user.city',
        'status',
        'currency',
        'specializations',
      ],
    });
  }

  async changeStatusToAppoint(id: string): Promise<void> {
    const status = await this.taskStatusService.getOneByCode(
      TaskStatusCodes.APPOINTED,
    );

    await this.taskRepository.update(id, {
      status,
    });
  }

  async getOneWithUser(id: string): Promise<Task> {
    return await this.taskRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async getAll(query: TaskQuery): Promise<GetAllResponse<Task>> {
    let tasksQuery = this.taskRepository
      .createQueryBuilder('task')
      .orderBy('task.created_at', 'ASC')
      .leftJoinAndSelect('task.user', 'user')
      .leftJoinAndSelect('user.country', 'country')
      .leftJoinAndSelect('user.city', 'city')
      .leftJoinAndSelect('task.status', 'status')
      .leftJoinAndSelect('task.currency', 'currency')
      .leftJoinAndSelect('task.specializations', 'specializations')
      .leftJoinAndSelect('specializations.category', 'specializationCategory')
      .where('status.code = :status', { status: TaskStatusCodes.NEW });

    tasksQuery = this.filteringReceivedData(tasksQuery, query);
    tasksQuery = this.searchingReceivedData(tasksQuery, query.keyword);

    const tasks = await tasksQuery.getMany();

    return {
      data: tasks,
      meta: {
        total: tasks.length,
        page: null,
        limit: null,
      },
    };
  }

  async getManyByUser(
    userId: string,
    code: TaskStatusCodes,
  ): Promise<GetAllResponse<Task>> {
    const tasks = await this.taskRepository.find({
      where: { user: { id: userId }, status: { code } },
      relations: [
        'status',
        'currency',
        'specializations',
        'specializations.category',
      ],
    });

    return {
      data: tasks,
      meta: {
        total: tasks.length,
        limit: null,
        page: null,
      },
    };
  }

  async delete(id: string, user: UserMetadata): Promise<DeleteResult> {
    const task = await this.getOneByUser(user.id, id);
    return await this.taskRepository.softDelete(task.id);
  }

  filteringReceivedData(
    tasksQuery: SelectQueryBuilder<Task>,
    query: TaskQuery,
  ): SelectQueryBuilder<Task> {
    if (query.fromPrice)
      tasksQuery.andWhere('task.price >= :from', { from: query.fromPrice });

    if (query.toPrice)
      tasksQuery.andWhere('task.price <= :to', { to: query.toPrice });

    if (query.currencyId)
      tasksQuery.andWhere('currency.id = :currencyId', {
        currencyId: query.currencyId,
      });

    if (query.specializationCategoryId)
      tasksQuery.andWhere('specializationCategory.id = :categoryId', {
        categoryId: query.specializationCategoryId,
      });

    return tasksQuery;
  }

  searchingReceivedData(
    tasksQuery: SelectQueryBuilder<Task>,
    keyword: string,
  ): SelectQueryBuilder<Task> {
    if (keyword === '') return tasksQuery;

    tasksQuery.andWhere(
      new Brackets((qb) => {
        qb.where("task.title Ilike '%' || :title || '%'", { title: keyword });
        qb.orWhere("task.description Ilike '%' || :description || '%'", {
          description: keyword,
        });
      }),
    );

    return tasksQuery;
  }
}
