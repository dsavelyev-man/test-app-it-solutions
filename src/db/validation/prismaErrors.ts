import { ERRORS } from '../../common/errors.js';

export const prismaErrors = {
  P2025: ERRORS.NOT_FOUND,
  P2002: ERRORS.CONFLICT,
  default: ERRORS.UNKNOWN_ERROR,
};
