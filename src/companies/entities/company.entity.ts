import { Field, Int, ObjectType } from '@nestjs/graphql';
import { JobEntity } from '../../jobs/entities/job.entity.js';

@ObjectType()
export class CompanyEntity {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;
}
