import { Injectable } from '@nestjs/common';
import { Country } from './entities/country.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from './entities/city.entity';
import { Currency, CurrencyCodes } from './entities/currency.entity';
import { Language } from './entities/language.entity';
import { LanguageDegree } from './entities/language-degree.entity';
import {
  AvailabilityStatus,
  AvailabilityStatusCodes,
} from './entities/availability-status.entity';
import { SpecializationCategory } from './entities/specialization-category.entity';
import { Specialization } from './entities/specialization.entity';

@Injectable()
export class ReferencesService {
  constructor(
    @InjectRepository(Country)
    private countryRepository: Repository<Country>,
    @InjectRepository(City)
    private cityRepository: Repository<City>,
    @InjectRepository(Currency)
    private currencyRepository: Repository<Currency>,
    @InjectRepository(Language)
    private languageRepository: Repository<Language>,
    @InjectRepository(LanguageDegree)
    private languageDegreeRepository: Repository<LanguageDegree>,
    @InjectRepository(AvailabilityStatus)
    private availabilityStatusRepository: Repository<AvailabilityStatus>,
    @InjectRepository(SpecializationCategory)
    private specializationCategoryRepository: Repository<SpecializationCategory>,
    @InjectRepository(Specialization)
    private specializationRepository: Repository<Specialization>,
  ) {}

  async getAllCountries(): Promise<Country[]> {
    return await this.countryRepository.find({
      relations: ['cities'],
    });
  }

  async getCitiesByCountry(countryId: string): Promise<City[]> {
    return await this.cityRepository.find({
      where: { country: { id: countryId } },
    });
  }

  async getCurrencies(): Promise<Currency[]> {
    return await this.currencyRepository.find();
  }

  async getCurrencyByCode(code: CurrencyCodes): Promise<Currency> {
    return await this.currencyRepository.findOne({
      where: { code },
    });
  }

  async getAllLanguages(): Promise<Language[]> {
    return await this.languageRepository.find();
  }

  async getAllLanguageDegrees(): Promise<LanguageDegree[]> {
    return await this.languageDegreeRepository.find({
      select: ['id', 'name'],
      order: { order: 'ASC' },
    });
  }

  async getAllAvailabilityStatuses(): Promise<AvailabilityStatus[]> {
    return await this.availabilityStatusRepository.find();
  }

  async getAllSpecializationCategories(): Promise<SpecializationCategory[]> {
    const categories = await this.specializationCategoryRepository.find({
      relations: ['specializations'],
    });

    for(let category of categories){
      for(let specialization of category.specializations){
        specialization['value'] = specialization.id
      }
    }

    return categories;
  }

  async getSpecializationsByCategory(
    categoryId: string,
  ): Promise<Specialization[]> {
    const specializations = await this.specializationRepository.find({
      where: { category: { id: categoryId } },
    });

    for(let specialization of specializations){
      specialization['value'] = specialization.id
    }

    return specializations;
  }

  async getAvailabilityStatusByCode(
    code: AvailabilityStatusCodes,
  ): Promise<AvailabilityStatus> {
    return await this.availabilityStatusRepository.findOne({
      where: { code },
    });
  }
}
