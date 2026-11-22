import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsInt, Max, Min } from 'class-validator';

@ArgsType()
export class PaginationArgs {
  @Field(() => Int, {
    defaultValue: 1,
    description: 'Страница которую надо получить',
  })
  @IsInt()
  @Min(1)
  page: number;

  @Field(() => Int, { defaultValue: 20, description: 'Лимит на страницу' })
  @Min(1)
  @IsInt()
  @Max(100)
  limit: number;
}

/**
 *
 * @param id <T>
 * @param pagination PaginationArgs
 * @param groupId <G>
 */
export class LoaderPagination<T, G> {
  id: T;
  pagination: PaginationArgs;
  groupId: G;
}

export const paginationFormat = (pagination: PaginationArgs) => {
  const pageInt = pagination.page ? pagination.page : 1;
  const page = pageInt === 0 ? 0 : isNaN(pageInt) ? 0 : pageInt - 1;
  const take = pagination.limit ? Math.min(pagination.limit, 100) || 20 : 20;
  return {
    skip: take * page,
    take,
  };
};
