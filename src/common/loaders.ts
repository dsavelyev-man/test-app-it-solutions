import { isNumber } from 'class-validator';
import { ApplicantJobLoader } from '../applicants/loaders/job.loader.js';
import { CompanyJobLoader } from '../companies/loaders/job.loader.js';
import { DbService } from '../db/db.service.js';
import { Prisma } from '../generated/prisma/client.js';
import { JobApplicantLoader } from '../jobs/loaders/applicant.loader.js';
import { JobCompanyLoader } from '../jobs/loaders/company.loader.js';
import { ProjectApplicantLoader } from '../projects/loaders/applicant.loader.js';
import { LoaderPagination, paginationFormat } from './pagination.js';
import { GraphQLError } from 'graphql';
import { ERRORS } from './errors.js';
import { ApplicantProjectLoader } from '../applicants/loaders/projects.loader.js';

/**
 * Генерирует группу запросов с offset limit для dataloader
 * includde используется для модификации многих ко многим
 * https://github.com/graphql/dataloader/issues/71
 * @param props Базовая информация о запросе
 * @returns
 */
export const requestConstructor = <T, G>(props: {
  tableName: keyof typeof Prisma.ModelName;
  idName: string;
  orderBy?: string;
  left?: keyof typeof Prisma.ModelName;
  leftOn?: string;
  select: string[];
}) => {
  let index = 0;
  return {
    requestBase(data: Readonly<LoaderPagination<T, G>> & { index: number }) {
      //Защита от неожиданный sql иньекций вообще по хорошему какой нибуть knex юзать для таких историй самописных
      if (!isNumber(data.pagination.limit) || !isNumber(data.pagination.page)) {
        throw new GraphQLError(ERRORS.INVALID);
      }

      let formatedPagination = paginationFormat(data.pagination);

      const select = [...props.select];
      select.push(`${data.index} as index`);

      return !props.left && !props.leftOn
        ? `(select ${select?.join(', ')} from "${props.tableName}" where "${props.idName}" = ${data.id} order by "${props.orderBy || props.idName}" offset ${formatedPagination.skip} limit ${formatedPagination.take})\n`
        : `(select ${select?.join(', ')} from "${props.tableName}" left join "${props.left}" as l on ${props.leftOn} where "${props.idName}" = ${data.id} order by "${props.orderBy || props.idName}" offset ${formatedPagination.skip} limit ${formatedPagination.take}) \n`;
    },
    generate(data: Readonly<LoaderPagination<T, G>[]>): string {
      let request = [];

      for (const [i, props] of data.entries()) {
        if (i !== 0) {
          request.push('union all ');
        }

        request.push(
          this.requestBase({
            ...props,
            index,
          }),
        );
        index++;
      }

      return request.join('');
    },
    getIndex() {
      return index;
    },
    getArrayByIndex() {
      return Array.from(Array(index).keys());
    },
  };
};

export class DataLoaders {
  applicant: {
    job: ApplicantJobLoader;
    project: ApplicantProjectLoader;
  };
  job: {
    applicant: JobApplicantLoader;
    company: JobCompanyLoader;
  };
  company: {
    job: CompanyJobLoader;
  };
  project: {
    applicant: ProjectApplicantLoader;
  };

  constructor(db: DbService) {
    this.applicant = {
      job: new ApplicantJobLoader(db),
      project: new ApplicantProjectLoader(db),
    };
    this.job = {
      applicant: new JobApplicantLoader(db),
      company: new JobCompanyLoader(db),
    };
    this.company = {
      job: new CompanyJobLoader(db),
    };
    this.project = {
      applicant: new ProjectApplicantLoader(db),
    };
  }
}
