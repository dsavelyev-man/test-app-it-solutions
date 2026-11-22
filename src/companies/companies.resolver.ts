import {
  Args,
  Context,
  Int,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CompaniesService } from './companies.service.js';
import { CompanyEntity } from './entities/company.entity.js';
import { JobEntity } from '../jobs/entities/job.entity.js';
import type { GraphQLContext } from '../common/graphql.js';
import { PaginationArgs } from '../common/pagination.js';

@Resolver(() => CompanyEntity)
export class CompaniesResolver {
  constructor(private companiesService: CompaniesService) {}

  @Query(() => [CompanyEntity], {
    description: 'Пагинированный список компаний.',
  })
  companies(@Args() pagination: PaginationArgs): Promise<CompanyEntity[]> {
    return this.companiesService.findMany(pagination);
  }

  @Query(() => CompanyEntity, {
    description: 'Получение компании по id',
  })
  company(@Args('id', { type: () => Int }) id: number): Promise<CompanyEntity> {
    return this.companiesService.getById(id);
  }

  @ResolveField(() => [JobEntity], {
    nullable: true,
    description: 'Получение списка истории работы сотрудников.',
  })
  jobs(
    @Parent() company: CompanyEntity,
    @Args() pagination: PaginationArgs,
    @Context() ctx: GraphQLContext,
  ): Promise<JobEntity[]> {
    return ctx.dataLoaders.company.job.load({
      id: company.id,
      pagination,
      groupId: company.id,
    });
  }
}
