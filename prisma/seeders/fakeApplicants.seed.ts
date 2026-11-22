import { PrismaClient } from '../../src/generated/prisma/client.js';
import { fakerRU } from '@faker-js/faker';

/**
 * Генерит случайных 100 Работников с помощью @faker-js/faker
 */
export const fakeApplicants = async (db: PrismaClient) => {
  for (let i = 0; i < 100; i++) {
    try {
      const linksCount = fakerRU.number.int({ min: 1, max: 5 });
      const skillsCount = fakerRU.number.int({ min: 1, max: 10 });

      await db.applicant.create({
        data: {
          firstName: fakerRU.person.firstName(),
          shortDescription: fakerRU.person.jobDescriptor(),
          links: Array.from(Array(linksCount).keys()).map(() =>
            fakerRU.internet.url(),
          ),
          skills: Array.from(Array(skillsCount).keys()).map(() =>
            fakerRU.person.zodiacSign(),
          ),
        },
      });
    } catch (e) {
      console.error(e);
    }
  }
};
