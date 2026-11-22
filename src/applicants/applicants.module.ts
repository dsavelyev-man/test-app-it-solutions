import { Module } from '@nestjs/common';
import { ApplicantsResolver } from './applicants.resolver.js';
import { DbModule } from '../db/db.module.js';
import { ApplicantsService } from './applicants.service.js';

@Module({
  imports: [DbModule],
  providers: [ApplicantsResolver, ApplicantsService],
})
export class ApplicantsModule {}
