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

/**
 * Генерирует группу запросов с offset limit для dataloader
 * includde используется для модификации многих ко многим
 * @param props Базовая информация о запросе
 * @returns
 */
export const requestConstructor = <T, G>(props: {
  tableName: keyof typeof Prisma.ModelName;
  idName: string;
  left?: keyof typeof Prisma.ModelName;
  leftOn?: string;
  leftSelect?: string[];
}) => {
  return {
    requestBase(data: Readonly<LoaderPagination<T, G>>) {
      //Защита от неожиданный sql иньекций вообще по хорошему какой нибуть knex юзать для таких историй самописных
      if (!isNumber(data.pagination.limit) || !isNumber(data.pagination.page)) {
        throw new GraphQLError(ERRORS.INVALID);
      }

      let formatedPagination = paginationFormat(data.pagination);

      return !props.left && !props.leftOn && !props.leftSelect
        ? `(select * from "${props.tableName}" where "${props.idName}" = ${data.id} order by "${props.idName}" offset ${formatedPagination.skip} limit ${formatedPagination.take})\n`
        : `(select ${props.leftSelect?.join(', ')} from "${props.tableName}" left join "${props.left}" as l on ${props.leftOn} where "${props.idName}" = ${data.id} order by "${props.idName}" offset ${formatedPagination.skip} limit ${formatedPagination.take}) \n`;
    },
    generate(data: Readonly<LoaderPagination<T, G>[]>): string {
      let request = ``;

      for (const [i, props] of data.entries()) {
        if (i !== 0) {
          request += 'union all ';
        }
        request += this.requestBase(props);
      }

      return request;
    },
  };
};

export class DataLoaders {
  applicant: {
    job: ApplicantJobLoader;
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
