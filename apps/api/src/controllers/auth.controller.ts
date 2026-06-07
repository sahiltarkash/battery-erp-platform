import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../middleware/error.middleware';
import {
  loginUser,
  registerUser,
  refreshAccessToken,
  requestPasswordReset,
  resetPassword,
} from '../services/auth.service';

function ensureBody<T>(req: Request): T {
  if (!req.body) {
    throw new HttpError(400, 'Request body is required');
  }
  return req.body as T;
}

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const body = ensureBody<{ firstName: string; lastName: string; email: string; password: string }>(req);
      const user = await registerUser(body);
      return res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const body = ensureBody<{ email: string; password: string }>(req);
      const result = await loginUser(body.email, body.password);
      return res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const body = ensureBody<{ refreshToken: string }>(req);
      const result = await refreshAccessToken(body.refreshToken);
      return res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const body = ensureBody<{ email: string }>(req);
      const result = await requestPasswordReset(body.email);
      return res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const body = ensureBody<{ token: string; password: string }>(req);
      const result = await resetPassword(body.token, body.password);
      return res.json(result);
    } catch (error) {
      next(error);
    }
  },
};
