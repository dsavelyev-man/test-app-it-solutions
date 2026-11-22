import DataLoader from 'dataloader';
import { ApplicantEntity } from '../../applicants/entities/applicant.entity.js';
import { DbService } from '../../db/db.service.js';
import { requestConstructor } from '../../common/loaders.js';
import { Prisma } from '../../generated/prisma/client.js';
import { LoaderPagination } from '../../common/pagination.js';

export class ProjectApplicantLoader extends DataLoader<
  LoaderPagination<number, number>,
  ApplicantEntity[]
> {
  constructor(db: DbService) {
    super(async (projects) => {
      const request = requestConstructor<number, number>({
        tableName: Prisma.ModelName.ApplicantToProject,
        idName: 'projectId',
        left: Prisma.ModelName.Applicant,
        leftOn: `"applicantId" = l.id`,
        leftSelect: ['l.*', '"projectId"'],
      });

      const applicants: (ApplicantEntity & { projectId: number })[] =
        await db.$queryRawUnsafe(request.generate(projects));

      const ids = projects.map((project) => project.groupId);

      const projectsApplicants = new Map<number, ApplicantEntity[]>(
        ids.map((id) => [id, []]),
      );

      for (const applicant of applicants) {
        const finalApplicant: ApplicantEntity & { projectId?: number } = {
          ...applicant,
        };
        delete finalApplicant.projectId;
        projectsApplicants.get(applicant.projectId)?.push(finalApplicant);
      }

      return ids.map((id) => projectsApplicants.get(id) || []);
    });
  }
}
