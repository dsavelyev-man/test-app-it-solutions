import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service.js';
import { CompaniesResolver } from './companies.resolver.js';

@Module({
  providers: [CompaniesService, CompaniesResolver],
})
export class CompaniesModule {}
