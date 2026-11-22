import { BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { ERRORS } from './errors.js';

export const classValidatorErrors = {
  isLength: ERRORS.INVALID_LENGTH,
  isNotEmpty: ERRORS.EMPTY,
  isString: ERRORS.MUST_BE_STRING,
  isInt: ERRORS.INVALID,
  unknown: ERRORS.UNKNOWN_ERROR,
};

const validatorFactory = (errors: ValidationError[]) => {
  const result = errors.map((error) => ({
    property: error.property,
    original: error.constraints,
    message: error.constraints
      ? (() => {
          const e = Object.keys(error.constraints).map(
            (key) =>
              classValidatorErrors[key as keyof typeof classValidatorErrors] ||
              classValidatorErrors.unknown,
          );
          return e;
        })()
      : undefined,
  }));

  return new BadRequestException(result);
};

export default validatorFactory;
