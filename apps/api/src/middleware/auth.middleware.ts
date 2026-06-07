import { NextFunction, Request, Response } from 'express';
import { verifyJwt } from '../utils/jwt.util';
import { prisma } from '../prisma/client';
import { HttpError } from './error.middleware';

export interface AuthRequest extends Request {
  user: {
    id: string;
    email: string;
    roles: string[];
  };
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      throw new HttpError(401, 'Authentication token required');
    }

    const token = header.replace('Bearer ', '').trim();
    const payload = verifyJwt(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      include: { userRoles: { include: { role: true } } },
    });

    if (!user || !user.isActive || user.deletedAt) {
      throw new HttpError(401, 'Invalid authentication token');
    }

    const authReq = req as AuthRequest;
    authReq.user = {
      id: user.id,
      email: user.email,
      roles: user.userRoles.map((userRole: any) => userRole.role.name),
    };

    return next();
  } catch (error) {
    return next(error);
  }
}
