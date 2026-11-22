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
    super(async (companies) => {
      const request = requestConstructor<number, number>({
        tableName: Prisma.ModelName.Job,
        orderBy: 'id',
        idName: 'companyId',
        select: ['*'],
      });

      const jobs: (JobEntity & { index: number })[] = await db.$queryRawUnsafe(
        request.generate(companies),
      );

      const ids = request.getArrayByIndex();

      const companiesJobs = new Map<number, JobEntity[]>(
        ids.map((id) => [id, []]),
      );

      for (const job of jobs) {
        companiesJobs.get(job.index)?.push(job);
      }

      return ids.map((id) => companiesJobs.get(id) || []);
    });
  }
}
