import DataLoader from 'dataloader';
import { JobEntity } from '../../jobs/entities/job.entity.js';
import { DbService } from '../../db/db.service.js';
import { requestConstructor } from '../../common/loaders.js';
import { Prisma, Project } from '../../generated/prisma/client.js';
import { LoaderPagination } from '../../common/pagination.js';
import { ApplicantEntity } from '../entities/applicant.entity.js';
import { ProjectEntity } from '../../projects/entity/project.entity.js';

export class ApplicantProjectLoader extends DataLoader<
  LoaderPagination<number, number>,
  ProjectEntity[]
> {
  constructor(db: DbService) {
    super(async (applicants) => {
      const request = requestConstructor<number, number>({
        tableName: Prisma.ModelName.ApplicantToProject,
        idName: 'applicantId',
        orderBy: 'id',
        left: Prisma.ModelName.Project,
        leftOn: `"projectId" = l.id`,
        select: ['l.*', '"applicantId"'],
      });

      const projects: (ProjectEntity & {
        index: number;
        applicantId: number;
      })[] = await db.$queryRawUnsafe(request.generate(applicants));

      const ids = request.getArrayByIndex();

      const applicantsProjects = new Map<number, ProjectEntity[]>(
        ids.map((id) => [id, []]),
      );

      for (const project of projects) {
        applicantsProjects.get(project.index)?.push(project);
      }

      return ids.map((id) => applicantsProjects.get(id) || []);
    });
  }
}
