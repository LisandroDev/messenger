import { Request, Response, NextFunction } from 'express';

export class SpecificError extends Error {
  isSpecific: boolean;

  constructor(message: string) {
    super(message);
    this.isSpecific = true;
  }
}

export class UnauthorizedError extends SpecificError {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.statusCode = 401;
  }
}
export class BadRequestError extends SpecificError {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.statusCode = 400;
  }
}

export class ExistenceConflictError extends SpecificError {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.statusCode = 409;
  }
}

type specificErrors =
  | UnauthorizedError
  | BadRequestError
  | ExistenceConflictError;

export function specificErrorHandler(
  error: specificErrors,
  req: Request,
  res: Response,
  next: NextFunction
) {

    error.isSpecific ? res.status(error.statusCode).send(error.message) : next(error);
}
