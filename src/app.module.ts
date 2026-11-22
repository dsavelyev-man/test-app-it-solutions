import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule } from '@nestjs/config';
import { ApplicantsModule } from './applicants/applicants.module.js';
import { DirectiveLocation, GraphQLDirective } from 'graphql';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { CompaniesModule } from './companies/companies.module.js';
import { JobsModule } from './jobs/jobs.module.js';
import { DbService } from './db/db.service.js';
import { DbModule } from './db/db.module.js';
import { DataLoaders } from './common/loaders.js';
import { ProjectsModule } from './projects/projects.module.js';

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [DbModule],
      inject: [DbService],
      useFactory: (db: DbService): ApolloDriverConfig => ({
        installSubscriptionHandlers: true,
        autoSchemaFile: true,
        sortSchema: true,
        graphiql: false,
        plugins: [ApolloServerPluginLandingPageLocalDefault()],
        context: () => {
          return { dataLoaders: new DataLoaders(db) };
        },
        buildSchemaOptions: {
          directives: [
            new GraphQLDirective({
              name: 'upper',
              locations: [DirectiveLocation.FIELD_DEFINITION],
            }),
          ],
        },
      }),
    }),
    ConfigModule.forRoot({
      /**
       * Не вижу причин ограничивать плюс в некоторых случаях когда нужны env они могут недоступны
       */
      isGlobal: true,
      /**
       * !TODO допилить
       */
      validate: (config) => {
        return config;
      },
    }),
    ApplicantsModule,
    CompaniesModule,
    JobsModule,
    ProjectsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
