import DataLoader from 'dataloader';
import { DbService } from '../../db/db.service.js';
import { JobEntity } from '../../jobs/entities/job.entity.js';
import { Prisma } from '../../generated/prisma/client.js';
import {
  LoaderPagination,
  PaginationArgs,
  paginationFormat,
} from '../../common/pagination.js';
import { requestConstructor } from '../../common/loaders.js';

export class CompanyJobLoader extends DataLoader<
  LoaderPagination<number, number>,
  JobEntity[]
> {
  constructor(db: DbService) {
    //@ts-ignore
    super(async (companies) => {
      const request = requestConstructor<number, number>({
        tableName: Prisma.ModelName.Job,
        idName: 'companyId',
      });

      const jobs: JobEntity[] = await db.$queryRawUnsafe(
        request.generate(companies),
      );

      const ids = companies.map((company) => company.groupId);

      const companiesJobs = new Map<number, JobEntity[]>(
        ids.map((id) => [id, []]),
      );

      for (const job of jobs) {
        companiesJobs.get(job.companyId)?.push(job);
      }

      return ids.map((id) => companiesJobs.get(id) || []);
    });
  }
}
