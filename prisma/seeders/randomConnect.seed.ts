import { fakerRU } from '@faker-js/faker';
import { PrismaClient } from '../../src/generated/prisma/client.js';

/**
 * Генерит связь между работниками и компаний c @faker-js/faker
 */
export const randomConnect = async (db: PrismaClient) => {
  for (let i = 0; i < 100; i++) {
    try {
      const applicantCount = await db.applicant.count();
      const companyCount = await db.company.count();
      const applicantRandom = fakerRU.number.int({
        min: 1,
        max: applicantCount,
      });
      const companyRandom = fakerRU.number.int({ min: 1, max: companyCount });

      const applicant = await db.applicant.findFirst({
        where: {
          id: applicantRandom,
        },
      });
      if (!applicant) continue;
      const company = await db.company.findFirst({
        where: {
          id: companyRandom,
        },
      });
      if (!company) continue;

      const endWork = fakerRU.date.recent();
      const startWork = fakerRU.date.between({
        from: endWork.setFullYear(endWork.getFullYear() - 1),
        to: endWork,
      });

      await db.job.create({
        data: {
          applicantId: applicant.id,
          companyId: company.id,
          position: fakerRU.person.jobTitle(),
          startWork,
          endWork,
          achievements: [],
        },
      });
    } catch (e) {
      console.error(e);
    }
  }
};
