import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';
import { HttpError } from './error.middleware';

export function validateDto(schema: ZodSchema<any>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errorMessage = result.error.errors
        .map((issue) => `${issue.path.join('.')} ${issue.message}`)
        .join(', ');
      return next(new HttpError(400, errorMessage));
    }
    req.body = result.data;
    return next();
  };
}
