import { fakerRU } from '@faker-js/faker';
import { PrismaClient } from '../../src/generated/prisma/client.js';

/**
 * Генерит случайных 10 компаний с помощью @faker-js/faker
 */
export const fakeCompanies = async (db: PrismaClient) => {
  for (let i = 0; i < 100; i++) {
    try {
      await db.company.create({
        data: {
          name: fakerRU.company.name(),
        },
      });
    } catch (e) {
      console.error(e);
    }
  }
};
