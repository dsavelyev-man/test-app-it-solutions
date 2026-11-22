import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service.js';
import { PaginationArgs, paginationFormat } from '../common/pagination.js';

@Injectable()
export class ApplicantsService {
  constructor(private db: DbService) {}

  findMany(pagination: PaginationArgs) {
    return this.db.applicant.findMany({
      orderBy: {
        id: 'desc',
      },
      ...paginationFormat(pagination),
    });
  }

  getById(id: number) {
    return this.db.applicant.findFirstOrThrow({ where: { id } });
  }

  async getJob(applicantId: number) {
    return this.db.job.findFirst({
      where: { applicantId },
    });
  }
}
