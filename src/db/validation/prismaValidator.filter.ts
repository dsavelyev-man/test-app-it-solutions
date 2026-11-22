import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '../../generated/prisma/client.js';
import { GraphQLError } from 'graphql';
import { ERRORS } from '../../common/errors.js';

@Catch(Prisma.PrismaClientValidationError)
export class PrismaValidatorFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientValidationError, _host: ArgumentsHost) {
    console.error(exception);
    throw new GraphQLError(ERRORS.BAD_USER_INPUT, {
      extensions: {
        code: HttpStatus.BAD_GATEWAY,
        statusCode: HttpStatus.BAD_GATEWAY,
      },
    });
  }
}
