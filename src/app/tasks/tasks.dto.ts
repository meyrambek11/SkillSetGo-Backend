import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { Specialization } from '../references/entities/specialization.entity';
import { Currency } from '../references/entities/currency.entity';

export class StoreTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsString()
  deadline: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsArray()
  files?: string[] = [];

  @IsArray()
  @IsOptional()
  specializations?: Specialization[];
}

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  deadline: string;

  @IsOptional()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsArray()
  files?: string[] = [];

  @IsArray()
  @IsOptional()
  specializations?: Specialization[];

  @IsOptional()
  @IsObject()
  currency: Currency;
}

export class TaskQuery {
  @IsOptional()
  fromPrice?: number = null;

  @IsOptional()
  toPrice?: number = null;

  @IsOptional()
  currencyId?: string = null;

  @IsOptional()
  specializationIds?: string = null;

  @IsOptional()
  specializationCategoryId?: string = null;

  @IsOptional()
  keyword?: string = '';
}
