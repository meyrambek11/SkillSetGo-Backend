import { Module } from '@nestjs/common';
import { ReferencesController } from './references.controller';
import { ReferencesService } from './references.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Currency } from './entities/currency.entity';
import { Country } from './entities/country.entity';
import { City } from './entities/city.entity';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Language } from './entities/language.entity';
import { LanguageDegree } from './entities/language-degree.entity';
import { AvailabilityStatus } from './entities/availability-status.entity';
import { SpecializationCategory } from './entities/specialization-category.entity';
import { Specialization } from './entities/specialization.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([
      Country,
      City,
      Currency,
      Language,
      LanguageDegree,
      AvailabilityStatus,
      SpecializationCategory,
      Specialization,
    ]),
    JwtModule,
  ],
  controllers: [ReferencesController],
  providers: [ReferencesService],
  exports: [ReferencesService],
})
export class ReferencesModule {}
