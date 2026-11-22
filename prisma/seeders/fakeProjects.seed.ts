import { fakerRU } from '@faker-js/faker';
import { PrismaClient } from '../../src/generated/prisma/client.js';

export const fakeProjects = async (db: PrismaClient) => {
  for (let i = 0; i < 100; i++) {
    try {
      await db.project.create({
        data: {
          name: fakerRU.internet.domainWord(),
          link: fakerRU.internet.url(),
        },
      });
    } catch (e) {
      console.error(e);
    }
  }
};
