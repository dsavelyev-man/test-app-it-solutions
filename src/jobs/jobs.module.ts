import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service.js';
import { JobsResolver } from './jobs.resolver.js';

@Module({
  providers: [JobsService, JobsResolver],
})
export class JobsModule {}
