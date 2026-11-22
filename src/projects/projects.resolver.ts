import {
  Args,
  Context,
  Int,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { ProjectEntity } from './entity/project.entity.js';
import { ProjectsService } from './projects.service.js';
import { ApplicantEntity } from '../applicants/entities/applicant.entity.js';
import type { GraphQLContext } from '../common/graphql.js';
import { PaginationArgs } from '../common/pagination.js';

@Resolver(() => ProjectEntity)
export class ProjectsResolver {
  constructor(private projectsService: ProjectsService) {}

  @Query(() => [ProjectEntity], {
    description: 'Пагинированный список проектов.',
  })
  projects(@Args() pagination: PaginationArgs) {
    return this.projectsService.findMany(pagination);
  }

  @Query(() => ProjectEntity, {
    description: 'Получение проекта по id.',
  })
  project(@Args('id', { type: () => Int }) id: number) {
    return this.projectsService.getById(id);
  }

  @ResolveField(() => [ApplicantEntity], {
    description: 'Работники связанные с проектом.',
  })
  applicants(
    @Parent() project: ProjectEntity,
    @Args() pagination: PaginationArgs,
    @Context() ctx: GraphQLContext,
  ) {
    return ctx.dataLoaders.project.applicant.load({
      id: project.id,
      pagination,
      groupId: project.id,
    });
  }
}
