import DataLoader from 'dataloader';
import { ApplicantEntity } from '../../applicants/entities/applicant.entity.js';
import { DbService } from '../../db/db.service.js';

export class JobApplicantLoader extends DataLoader<
  number,
  ApplicantEntity | null
> {
  constructor(db: DbService) {
    super(async (applicantIds) => {
      const ids = [...new Set(applicantIds)];

      const applicants = await db.applicant.findMany({
        where: { id: { in: ids } },
        orderBy: { id: 'asc' },
      });

      const jobsApplicants = new Map<number, ApplicantEntity | null>(
        ids.map((id) => [id, null]),
      );

      for (const applicant of applicants) {
        jobsApplicants.set(applicant.id, applicant);
      }

      return applicantIds.map((id) => jobsApplicants.get(id) || null);
    });
  }
}
