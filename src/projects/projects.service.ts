import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service.js';
import { PaginationArgs, paginationFormat } from '../common/pagination.js';

@Injectable()
export class ProjectsService {
  constructor(private db: DbService) {}

  findMany(pagination: PaginationArgs) {
    return this.db.project.findMany({
      orderBy: {
        id: 'desc',
      },
      ...paginationFormat(pagination),
    });
  }

  getById(id: number) {
    return this.db.project.findFirstOrThrow({
      where: {
        id,
      },
    });
  }
}
