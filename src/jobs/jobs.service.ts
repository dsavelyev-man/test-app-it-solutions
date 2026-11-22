import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service.js';
import { PaginationArgs, paginationFormat } from '../common/pagination.js';

@Injectable()
export class JobsService {
  constructor(private db: DbService) {}

  findMany(pagination: PaginationArgs) {
    return this.db.job.findMany({
      orderBy: {
        id: 'desc',
      },
      ...paginationFormat(pagination),
    });
  }

  getById({
    applicantId,
    companyId,
    pagination,
  }: {
    applicantId?: number;
    companyId?: number;
    pagination: PaginationArgs;
  }) {
    return this.db.job.findMany({
      where: {
        applicantId,
        companyId,
      },
      orderBy: {
        id: 'desc',
      },
      ...paginationFormat(pagination),
    });
  }
}
