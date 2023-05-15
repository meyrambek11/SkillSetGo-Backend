import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { ReferencesService } from './references.service';
import { Country } from './entities/country.entity';
import { City } from './entities/city.entity';
import { Currency } from './entities/currency.entity';
import { Language } from './entities/language.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LanguageDegree } from './entities/language-degree.entity';
import { AvailabilityStatus } from './entities/availability-status.entity';
import { SpecializationCategory } from './entities/specialization-category.entity';
import { Specialization } from './entities/specialization.entity';

@Controller('references')
export class ReferencesController {
  constructor(private referencesService: ReferencesService) {}

  @Get('countries')
  getAllCountry(): Promise<Country[]> {
    return this.referencesService.getAllCountries();
  }

  @Get('cities/:countryId')
  getCitiesByCountry(
    @Param('countryId', ParseUUIDPipe) countryId: string,
  ): Promise<City[]> {
    return this.referencesService.getCitiesByCountry(countryId);
  }

  @Get('currencies')
  getCurrencies(): Promise<Currency[]> {
    return this.referencesService.getCurrencies();
  }

  @UseGuards(JwtAuthGuard)
  @Get('languages')
  getAllLanguages(): Promise<Language[]> {
    return this.referencesService.getAllLanguages();
  }

  @UseGuards(JwtAuthGuard)
  @Get('language-degrees')
  getAllLanguageDegrees(): Promise<LanguageDegree[]> {
    return this.referencesService.getAllLanguageDegrees();
  }

  @UseGuards(JwtAuthGuard)
  @Get('availability-statuses')
  getAllAvailabilityStatuses(): Promise<AvailabilityStatus[]> {
    return this.referencesService.getAllAvailabilityStatuses();
  }

  @UseGuards(JwtAuthGuard)
  @Get('specialization-categories')
  getAllSpecializationCategories(): Promise<SpecializationCategory[]> {
    return this.referencesService.getAllSpecializationCategories();
  }

  @UseGuards(JwtAuthGuard)
  @Get('specializations/:categoryId')
  getSpecializationsByCategory(
    @Param('categoryId', ParseUUIDPipe) categoryId: string,
  ): Promise<Specialization[]> {
    return this.referencesService.getSpecializationsByCategory(categoryId);
  }
}
