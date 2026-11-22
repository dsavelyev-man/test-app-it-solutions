import { Args, Int, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Context, Query } from '@nestjs/graphql';
import { Applicant } from '../generated/prisma/client.js';
import { ApplicantsService } from './applicants.service.js';
import { JobEntity } from '../jobs/entities/job.entity.js';
import type { GraphQLContext } from '../common/graphql.js';
import { ApplicantEntity } from './entities/applicant.entity.js';
import { PaginationArgs } from '../common/pagination.js';

@Resolver(() => ApplicantEntity)
export class ApplicantsResolver {
  constructor(private applicantsService: ApplicantsService) {}

  @Query(() => [ApplicantEntity], {
    description: 'Пагинированный список кандитатов.',
  })
  applicants(@Args() pagination: PaginationArgs): Promise<Applicant[]> {
    return this.applicantsService.findMany(pagination);
  }

  @Query(() => ApplicantEntity, {
    description: 'Получение кандидата',
  })
  applicant(@Args('id', { type: () => Int }) id: number): Promise<Applicant> {
    return this.applicantsService.getById(id);
  }

  @ResolveField(() => [JobEntity], {
    nullable: true,
    description: 'Список где работал кандидат',
  })
  jobs(
    @Parent() applicant: ApplicantEntity,
    @Args() pagination: PaginationArgs,
    @Context() ctx: GraphQLContext,
  ): Promise<JobEntity[]> {
    return ctx.dataLoaders.applicant.job.load({
      id: applicant.id,
      groupId: applicant.id,
      pagination,
    });
  }
}
