import { City } from 'src/app/references/entities/city.entity';
import { Country } from 'src/app/references/entities/country.entity';
import { Currency } from 'src/app/references/entities/currency.entity';
import { Role } from 'src/app/roles/roles.entity';

export class UserMetadata {
  email: string;
  id: string;
  name: string;
  surname: string;
  middleName?: string;
  photo?: string;
  role: Role;
  isBan: boolean;
  currency: Currency;
  phoneNumber: string;
  balance: number;
  country: Country;
  city: City;
}
