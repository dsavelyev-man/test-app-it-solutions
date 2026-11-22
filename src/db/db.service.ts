import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
/**
 * Решил вместо sqlite для тестового pg юзать так как типов нехватает
 */
import { PrismaPg } from '@prisma/adapter-pg';
import { Prisma, PrismaClient } from '../generated/prisma/client.js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DbService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(configService: ConfigService) {
    const adapter = new PrismaPg({
      connectionString:
        configService.get('DATABASE_URL') ||
        `postgresql://${configService.get('POSTGRES_USER')}:${configService.get('POSTGRES_PASSWORD')}@${configService.get('POSTGRES_HOST')}:${configService.get('POSTGRES_PORT')}/${configService.get('POSTGRES_DB')}`,
    });
    super({
      adapter,
      log: ['query', 'info', 'warn', 'error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
