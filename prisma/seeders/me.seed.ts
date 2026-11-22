import { PrismaClient } from '../../src/generated/prisma/client.js';

/**
 * Создает в бд информацию обо мне
 */
export const me = async (db: PrismaClient) => {
  await db.$transaction(async (tx) => {
    const exist = await tx.applicant.findFirst({
      where: {
        id: 1,
      },
    });
    if (exist) {
      console.log('Daniil exist in database');
      return;
    }
    const applicant = await tx.applicant.create({
      data: {
        id: 1,
        firstName: 'Даниил',
        shortDescription:
          'Backend разработчик пришедший из фронтенда с желанием изучать работу с большими обьемами данных для эффективной обработки и devops технологий',
        links: ['https://github.com/dsavelyev-man', 'https://t.me/dsavelyev'],
        skills: [
          'docker',
          'react',
          'nodejs',
          'nestjs',
          'typescript',
          'nextjs',
          'git',
          'gitlab CI',
        ],
      },
    });
    const company1 = await tx.company.create({
      data: {
        name: 'Altrp',
      },
    });

    await tx.job.create({
      data: {
        applicantId: applicant.id,
        companyId: company1.id,
        position: 'Fullstack',
        startWork: new Date('06.01.2021').toISOString(),
        endWork: new Date('08.01.2022').toISOString(),
        achievements: [
          `
          Занимался с коллегой переносом php версии на nodejs
        `,
          `
          Написал конструктор контроллеров(полей типа тех что в редакторе Elementor) 
          для виджетов(Разные компоненты на сайте)
        `,
        ],
      },
    });

    const company2 = await tx.company.create({
      data: {
        name: 'Tltpro',
      },
    });

    await tx.job.create({
      data: {
        applicantId: applicant.id,
        companyId: company2.id,
        position: 'Fullstack разработчик',
        startWork: new Date('01.01.2023').toISOString(),
        endWork: new Date('11.01.2026').toISOString(),
        achievements: [
          `
          Разработал удобную систему ошибок используемую везде(даже на этом проекте)
        `,
          `
          Изучил протокл ocpp который используется на всех зарядных станциях для машин
        `,
        ],
      },
    });

    const company3 = await tx.company.create({
      data: {
        name: 'Gobus',
      },
    });

    await tx.job.create({
      data: {
        applicantId: applicant.id,
        companyId: company3.id,
        position: 'Backend-разработчик',
        startWork: new Date('01.01.2025').toISOString(),
        endWork: new Date('11.01.2026').toISOString(),
        achievements: [
          `
          оптимизация действующего продукта с sequelize. убраны все N+1
        `,
          `
          перенос системы с формата запроса с других систем на формат парсеров
        `,
          `
          Заставил всю команду перейти на gitlab CD вместо ручного обновления(я с ними если что останусь на связи)
        `,
        ],
      },
    });

    const projects = await Promise.all([
      tx.project.create({
        data: {
          name: 'Altrp',
          link: 'https://github.com/GTFB/Altrp3',
        },
      }),
      tx.project.create({
        data: {
          name: 'tarkov.help',
          link: 'https://tarkov.help',
        },
      }),
      tx.project.create({
        data: {
          name: 'Кварцверке Ульяновск',
          link: 'https://qw-russia.ru',
        },
      }),
      tx.project.create({
        data: {
          name: '2chrg',
          link: 'https://2chrg.com',
        },
      }),
      tx.project.create({
        data: {
          name: 'Wg',
          link: 'https://github.com/dsavelyev-man/wg',
        },
      }),
    ]);

    const projectsToApplicant = [];

    for (const project of projects) {
      projectsToApplicant.push({
        applicantId: applicant.id,
        projectId: project.id,
      });
    }

    await tx.applicantToProject.createMany({
      data: projectsToApplicant,
    });
  });
};
