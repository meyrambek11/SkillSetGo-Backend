import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  GetAllFreelancerQuery,
  StoreFreelancerEducationDto,
  StoreFreelancerExperienceDto,
  StoreFreelancerLanguageDto,
  StoreFreelancerWorkExperienceDto,
  UpdateFreelancerDto,
} from './freelancers.dto';
import { UserInfo } from 'src/common/decorators/user.decorator';
import { UserMetadata } from 'src/common/types/userMetadata';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FreelancerService } from './services/freelancers.service';
import { Freelancer } from './entities/freelancers.entity';
import { FreelancerEducationService } from './services/freelancers-education.service';
import { FreelancerEducation } from './entities/freelancer-educations.entity';
import { DeleteResult } from 'typeorm';
import { FreelancerExperience } from './entities/freelancer-experiences.entity';
import { FreelancerExperienceService } from './services/freelancers-experience.service';
import { FreelancerLanguageService } from './services/freelancers-language.service';
import { FreelancerWorkExperienceService } from './services/freelancers-work-experience.service';
import { GetAllResponse } from 'src/common/types/get-all.response';
import { FreelancerWorkExperience } from './entities/freelancer-work-experiences.entity';
import { FreelancerLanguage } from './entities/freelancer-languages.entity';

@UseGuards(JwtAuthGuard)
@Controller('freelancer')
export class FreelancerController {
  constructor(
    private freelancerService: FreelancerService,
    private freelancerEducationService: FreelancerEducationService,
    private freelancerExperienceService: FreelancerExperienceService,
    private freelancerLanguageService: FreelancerLanguageService,
    private freelancerWorkExperienceService: FreelancerWorkExperienceService,
  ) {}

  @Patch()
  update(
    @Body() payload: UpdateFreelancerDto,
    @UserInfo() user: UserMetadata,
  ): Promise<Freelancer> {
    return this.freelancerService.update(user, payload);
  }

  @Get()
  getAll(
    @Query() query: GetAllFreelancerQuery,
  ): Promise<GetAllResponse<Freelancer>> {
    return this.freelancerService.getAll(query);
  }

  @Get('/:id')
  getOne(@Param('id', ParseUUIDPipe) id: string): Promise<Freelancer> {
    return this.freelancerService.getOne(id);
  }

  @Delete('/:id')
  delete(@Param('id', ParseUUIDPipe) id: string): Promise<DeleteResult> {
    return this.freelancerService.delete(id);
  }

  @Post('education')
  addEducation(
    @Body() payload: StoreFreelancerEducationDto,
    @UserInfo() user: UserMetadata,
  ): Promise<FreelancerEducation> {
    return this.freelancerEducationService.store(payload, user);
  }

  @Delete('education/:id')
  deleteEducation(
    @Param('id', ParseUUIDPipe) id: string,
    @UserInfo() user: UserMetadata,
  ): Promise<DeleteResult> {
    return this.freelancerEducationService.delete(id, user);
  }

  @Post('experience')
  addExperience(
    @Body() payload: StoreFreelancerExperienceDto,
    @UserInfo() user: UserMetadata,
  ): Promise<FreelancerExperience> {
    return this.freelancerExperienceService.store(payload, user);
  }

  @Delete('experience/:id')
  deleteExperience(
    @Param('id', ParseUUIDPipe) id: string,
    @UserInfo() user: UserMetadata,
  ): Promise<DeleteResult> {
    return this.freelancerExperienceService.delete(id, user);
  }

  @Post('language')
  addLanguage(
    @Body() payload: StoreFreelancerLanguageDto,
    @UserInfo() user: UserMetadata,
  ): Promise<FreelancerLanguage> {
    return this.freelancerLanguageService.store(payload, user);
  }

  @Delete('language/:id')
  deleteLanguage(
    @Param('id', ParseUUIDPipe) id: string,
    @UserInfo() user: UserMetadata,
  ): Promise<DeleteResult> {
    return this.freelancerLanguageService.delete(id, user);
  }

  @Post('work-experience')
  addWorkExperience(
    @Body() payload: StoreFreelancerWorkExperienceDto,
    @UserInfo() user: UserMetadata,
  ): Promise<FreelancerWorkExperience> {
    return this.freelancerWorkExperienceService.store(payload, user);
  }

  @Delete('work-experience/:id')
  deleteWorkExperience(
    @Param('id', ParseUUIDPipe) id: string,
    @UserInfo() user: UserMetadata,
  ): Promise<DeleteResult> {
    return this.freelancerWorkExperienceService.delete(id, user);
  }
}
