import {
  IsEmail,
  IsLowercase,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
} from 'class-validator';
import { Role } from '../roles/roles.entity';
import { Country } from '../references/entities/country.entity';
import { City } from '../references/entities/city.entity';
import { Currency } from '../references/entities/currency.entity';

export class StoreUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsNotEmpty()
  surname: string;

  @IsString()
  @IsOptional()
  middleName?: string;

  @IsEmail()
  @IsLowercase()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  phoneNumber: string;

  @IsOptional()
  @IsUrl()
  photo: string;

  @IsObject()
  @IsNotEmpty()
  role: Role;

  @IsObject()
  @IsNotEmpty()
  country: Country;

  @IsObject()
  @IsNotEmpty()
  city: City;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsString()
  @IsOptional()
  surname?: string;

  @IsString()
  @IsOptional()
  middleName?: string;

  @IsEmail()
  @IsLowercase()
  @IsOptional()
  email?: string;

  @IsPhoneNumber()
  @IsOptional()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  photo?: string;

  @IsOptional()
  @IsObject()
  currency?: Currency;

  @IsObject()
  @IsOptional()
  country?: Country;

  @IsObject()
  @IsOptional()
  city?: City;
}
