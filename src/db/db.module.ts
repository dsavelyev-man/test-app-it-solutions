import { Global, Module } from '@nestjs/common';
import { DbService } from './db.service.js';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [DbService],
  exports: [DbService],
})
export class DbModule {}
