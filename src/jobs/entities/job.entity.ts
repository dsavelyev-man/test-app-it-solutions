import { Field, Int, ObjectType } from '@nestjs/graphql';
import { CompanyEntity } from '../../companies/entities/company.entity.js';
import { ApplicantEntity } from '../../applicants/entities/applicant.entity.js';

@ObjectType({
  description: 'Истории сотрудничества компании и сотрудника.',
})
export class JobEntity {
  @Field(() => Int, {
    description: 'Id сотрудника.',
  })
  applicantId: number;

  @Field(() => Int, {
    description: 'Id компании.',
  })
  companyId: number;

  @Field({
    description: 'Должность сотрудника.',
  })
  position: string;

  @Field({
    description: 'Дата начала сотрудничиства.',
  })
  startWork: Date;

  @Field({
    description: 'Дата конца сотрудничиства.',
  })
  endWork: Date;

  @Field(() => [String], {
    description: 'Достижения в компании.',
  })
  achievements: string[];
}
