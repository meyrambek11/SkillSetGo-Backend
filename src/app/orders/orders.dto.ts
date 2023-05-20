import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { Task } from '../tasks/entities/tasks.entity';

export class ResponseDto {
  @IsObject()
  @IsNotEmpty()
  task: Task;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsOptional()
  @IsString()
  letter: string;
}

export class ReviewDto {
  @IsArray()
  @IsNotEmpty()
  files: string[];
}
