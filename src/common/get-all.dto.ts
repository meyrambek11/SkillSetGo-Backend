import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

export enum SortOptions {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class GetAllQueryDto {
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  limit = 10;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  page = 1;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => `%${value}%`)
  keyword = '%%';

  @IsOptional()
  @IsString()
  sortElement: string;

  @IsOptional()
  @IsString()
  @IsEnum(SortOptions)
  sortBy: SortOptions = SortOptions.ASC;
}
