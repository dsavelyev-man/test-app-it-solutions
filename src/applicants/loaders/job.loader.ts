import DataLoader from 'dataloader';
import { JobEntity } from '../../jobs/entities/job.entity.js';
import { DbService } from '../../db/db.service.js';
import { requestConstructor } from '../../common/loaders.js';
import { Prisma } from '../../generated/prisma/client.js';
import { LoaderPagination } from '../../common/pagination.js';

export class ApplicantJobLoader extends DataLoader<
  LoaderPagination<number, number>,
  JobEntity[]
> {
  constructor(db: DbService) {
    super(async (applicants) => {
      const request = requestConstructor<number, number>({
        tableName: Prisma.ModelName.Job,
        idName: 'applicantId',
      });

      const jobs: JobEntity[] = await db.$queryRawUnsafe(
        request.generate(applicants),
      );

      const ids = applicants.map((applicant) => applicant.groupId);

      const applicantsJobs = new Map<number, JobEntity[]>(
        ids.map((id) => [id, []]),
      );

      for (const job of jobs) {
        applicantsJobs.get(job.applicantId)?.push(job);
      }

      return ids.map((id) => applicantsJobs.get(id) || []);
    });
  }
}
