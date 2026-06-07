import { NextFunction, Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { HttpError } from '../middleware/error.middleware';

export function authorizeRoles(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthRequest;
    const roles = authReq.user?.roles ?? [];
    const isAuthorized = roles.some((role) => allowedRoles.includes(role));

    if (!isAuthorized) {
      return next(new HttpError(403, 'Insufficient permissions'));
    }

    return next();
  };
}
