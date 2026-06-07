import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { authorizeRoles } from '../guards/role.guard';

export const userRouter = Router();

/**
 * @openapi
 * /api/users/profile:
 *   get:
 *     summary: Get current authenticated user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Authenticated user profile
 */
userRouter.get('/profile', requireAuth, (req, res) => {
  const authReq = req as any;
  return res.json({
    id: authReq.user.id,
    email: authReq.user.email,
    roles: authReq.user.roles,
  });
});

/**
 * @openapi
 * /api/users/admin:
 *   get:
 *     summary: Admin-only endpoint
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Only accessible by an ADMIN user
 */
userRouter.get('/admin', requireAuth, authorizeRoles('ADMIN'), (_req, res) => {
  return res.json({ message: 'Admin access granted' });
});
