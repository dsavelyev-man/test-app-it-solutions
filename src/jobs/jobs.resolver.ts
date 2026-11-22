import {
  Args,
  Context,
  Int,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { JobsService } from './jobs.service.js';
import { JobEntity } from './entities/job.entity.js';
import type { GraphQLContext } from '../common/graphql.js';
import { CompanyEntity } from '../companies/entities/company.entity.js';
import { ApplicantEntity } from '../applicants/entities/applicant.entity.js';
import { PaginationArgs } from '../common/pagination.js';

@Resolver(() => JobEntity)
export class JobsResolver {
  constructor(private jobsService: JobsService) {}

  @Query(() => [JobEntity], {
    description: 'Пагинированный список истории работы.',
  })
  async jobs(@Args() pagination: PaginationArgs): Promise<JobEntity[]> {
    return await this.jobsService.findMany(pagination);
  }

  @Query(() => [JobEntity], {
    description:
      'Получение определенных историй работы по id работника или по id компании. Пагинированный.',
  })
  job(
    @Args() pagination: PaginationArgs,
    @Args('applicantId', { type: () => Int, nullable: true })
    applicantId?: number,
    @Args('companyId', { type: () => Int, nullable: true })
    companyId?: number,
  ): Promise<JobEntity[]> {
    return this.jobsService.getById({
      applicantId,
      companyId,
      pagination,
    });
  }

  @ResolveField(() => ApplicantEntity, {
    nullable: true,
    description: 'Сотрудник компании',
  })
  applicant(
    @Parent() job: JobEntity,
    @Context() ctx: GraphQLContext,
  ): Promise<ApplicantEntity | null> {
    return ctx.dataLoaders.job.applicant.load(job.applicantId);
  }

  @ResolveField(() => CompanyEntity, {
    nullable: true,
    description: 'Компания на которую работали.',
  })
  company(
    @Parent() job: JobEntity,
    @Context() ctx: GraphQLContext,
  ): Promise<CompanyEntity | null> {
    return ctx.dataLoaders.job.company.load(job.companyId);
  }
}
