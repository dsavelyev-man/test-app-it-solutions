import { fakerRU } from '@faker-js/faker';
import { PrismaClient } from '../../src/generated/prisma/client.js';

export const projectsToApplicants = async (db: PrismaClient) => {
  for (let i = 0; i < 100; i++) {
    try {
      const applicantCount = await db.applicant.count();
      const projectCount = await db.project.count();
      const applicantRandom = fakerRU.number.int({
        min: 1,
        max: applicantCount,
      });
      const projectRandom = fakerRU.number.int({ min: 1, max: projectCount });

      const applicant = await db.applicant.findFirst({
        where: {
          id: applicantRandom,
        },
      });
      if (!applicant) continue;
      const project = await db.project.findFirst({
        where: {
          id: projectRandom,
        },
      });
      if (!project) continue;

      await db.applicantToProject.create({
        data: {
          applicantId: applicant.id,
          projectId: project.id,
        },
      });
    } catch (e) {
      console.error(e);
    }
  }
};
