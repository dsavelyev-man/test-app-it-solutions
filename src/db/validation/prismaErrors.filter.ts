import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { prismaErrors } from './prismaErrors.js';
import { Prisma } from '../../generated/prisma/client.js';
import { GraphQLError } from 'graphql';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaErrorsFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, _host: ArgumentsHost) {
    const code = exception.code as keyof typeof prismaErrors;
    const prismaResult = prismaErrors[code];

    const error = prismaResult || prismaErrors.default;

    console.error(exception);
    throw new GraphQLError(error, {
      extensions: {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      },
    });
  }
}
