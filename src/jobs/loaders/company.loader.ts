import DataLoader from 'dataloader';
import { CompanyEntity } from '../../companies/entities/company.entity.js';
import { DbService } from '../../db/db.service.js';

export class JobCompanyLoader extends DataLoader<number, CompanyEntity | null> {
  constructor(db: DbService) {
    super(async (companyIds) => {
      const ids = [...new Set(companyIds)];

      const companies = await db.company.findMany({
        where: { id: { in: ids } },
        orderBy: { id: 'asc' },
      });

      const jobsCompanies = new Map<number, CompanyEntity | null>(
        ids.map((id) => [id, null]),
      );

      for (const company of companies) {
        jobsCompanies.set(company.id, company);
      }

      return companyIds.map((id) => jobsCompanies.get(id) || null);
    });
  }
}
