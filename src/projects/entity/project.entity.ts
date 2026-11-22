import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({
  description: 'Проект.',
})
export class ProjectEntity {
  @Field(() => Int)
  id: number;

  @Field({
    description: 'Название проекта.',
  })
  name: string;

  @Field({
    description: 'Ссылка на проект.',
  })
  link: string;
}
