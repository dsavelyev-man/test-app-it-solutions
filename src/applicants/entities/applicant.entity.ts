import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({
  description: 'Работник.',
})
export class ApplicantEntity {
  @Field(() => Int)
  id: number;

  @Field({
    description: 'Имя.',
  })
  firstName: string;

  @Field({
    description: 'Короткое описание работника.',
  })
  shortDescription: string;

  @Field(() => [String], {
    description: 'Ссылки для github и другие ресурсы.',
  })
  links: string[];

  @Field(() => [String], {
    description: 'Навыки.',
  })
  skills: string[];
}
