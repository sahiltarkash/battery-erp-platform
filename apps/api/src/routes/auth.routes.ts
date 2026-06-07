import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validateDto } from '../middleware/validate.middleware';
import {
  forgotPasswordSchema,
  loginSchema,
  refreshTokenSchema,
  registerSchema,
  resetPasswordSchema,
} from '../dto/auth.dto';

export const authRouter = Router();

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Register a new customer account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterDto'
 *     responses:
 *       201:
 *         description: User registered successfully
 */
authRouter.post('/register', validateDto(registerSchema), authController.register);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Authenticate user and return JWT tokens
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginDto'
 *     responses:
 *       200:
 *         description: User authenticated successfully
 */
authRouter.post('/login', validateDto(loginSchema), authController.login);

/**
 * @openapi
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token using a refresh token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshTokenDto'
 *     responses:
 *       200:
 *         description: New access token issued
 */
authRouter.post('/refresh', validateDto(refreshTokenSchema), authController.refresh);

/**
 * @openapi
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request a password reset token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPasswordDto'
 *     responses:
 *       200:
 *         description: Password reset token generated
 */
authRouter.post('/forgot-password', validateDto(forgotPasswordSchema), authController.forgotPassword);

/**
 * @openapi
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset account password using a reset token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordDto'
 *     responses:
 *       200:
 *         description: Password updated successfully
 */
authRouter.post('/reset-password', validateDto(resetPasswordSchema), authController.resetPassword);
