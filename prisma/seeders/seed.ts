/**
 * @fileoverview
 * tsx' ./prisma/seeders/seed.ts {функции какие надо выполнить}
 * либо
 * npx prisma db seed {функции какие надо выполнить}
 *
 * доступные функции и аргументы
 * me
 * fakeApplicants
 * fakeCompanies
 * randomConnect
 * fakeProjects
 */

import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../src/generated/prisma/client.js';
import { me } from './me.seed.js';
import { fakeApplicants } from './fakeApplicants.seed.js';
import { fakeCompanies } from './fakeCompanies.seed.js';
import { randomConnect } from './randomConnect.seed.js';
import { fakeProjects } from './fakeProjects.seed.js';
import { projectsToApplicants } from './projectsToApplicants.seed.js';

const availableFunctions: {
  [key in string]: (prisma: PrismaClient) => Promise<void> | undefined;
} = {
  me,
  fakeApplicants,
  fakeCompanies,
  randomConnect,
  fakeProjects,
  projectsToApplicants,
};

const connectionString =
  process.env['DATABASE_URL'] ||
  `postgresql://${process.env['POSTGRES_USER']}:${process.env['POSTGRES_PASSWORD']}@${process.env['POSTGRES_HOST']}:${process.env['POSTGRES_PORT']}/${process.env['POSTGRES_DB']}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const main = async () => {
  for (const val of process.argv) {
    if (availableFunctions[val]) {
      await availableFunctions[val](prisma);
    }
  }
};

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
