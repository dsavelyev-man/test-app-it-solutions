import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service.js';
import { PaginationArgs, paginationFormat } from '../common/pagination.js';

@Injectable()
export class CompaniesService {
  constructor(private db: DbService) {}

  findMany(pagination: PaginationArgs) {
    return this.db.company.findMany({
      orderBy: {
        id: 'desc',
      },
      ...paginationFormat(pagination),
    });
  }

  getById(id: number) {
    return this.db.company.findFirstOrThrow({ where: { id } });
  }
}
