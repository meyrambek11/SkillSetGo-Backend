import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { AvailabilityStatus } from '../references/entities/availability-status.entity';
import { Specialization } from '../references/entities/specialization.entity';
import { Language } from '../references/entities/language.entity';
import { LanguageDegree } from '../references/entities/language-degree.entity';

export class UpdateFreelancerDto {
  @IsOptional()
  @IsString()
  readonly title?: string;

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsOptional()
  readonly availabilityStatus?: AvailabilityStatus;

  @IsNumber()
  @IsOptional()
  readonly pricePerHour?: number;

  @IsArray()
  @IsOptional()
  readonly specializations?: Specialization[];
}

export class StoreFreelancerEducationDto {
  @IsString()
  @IsNotEmpty()
  educationalInstitution: string;

  @IsString()
  @IsNotEmpty()
  specialization: string;

  @IsNumber()
  @IsNotEmpty()
  yearBegin: number;

  @IsNumber()
  @IsNotEmpty()
  yearEnd: number;
}

export class StoreFreelancerExperienceDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}

export class StoreFreelancerLanguageDto {
  @IsNotEmpty()
  @IsObject()
  language: Language;

  @IsNotEmpty()
  @IsObject()
  languageDegree: LanguageDegree;
}

export class StoreFreelancerWorkExperienceDto {
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @IsString()
  @IsNotEmpty()
  position: string;

  @IsNumber()
  @IsNotEmpty()
  yearBegin: number;

  @IsNumber()
  @IsOptional()
  yearEnd: number;

  @IsOptional()
  @IsString()
  accomplishment: string;
}

export class GetAllFreelancerQuery {
  @IsOptional()
  fromPricePerHour?: number = null;

  @IsOptional()
  toPricePerHour?: number = null;

  @IsOptional()
  availabilityStatusId?: string = null;

  @IsOptional()
  specializationCategoryId?: string = null;

  @IsOptional()
  keyword?: string = '';
}
