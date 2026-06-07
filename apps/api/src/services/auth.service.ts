import crypto from 'crypto';
import { addDays } from '../utils/date.util';
import { comparePassword, hashPassword } from '../utils/hash.util';
import { signJwt } from '../utils/jwt.util';
import { getRoleByName } from './role.service';
import { getUserByEmail, createUser, assignRoleToUser, revokeRefreshTokens } from './user.service';
import { prisma } from '../prisma/client';
import { HttpError } from '../middleware/error.middleware';

const REFRESH_TOKEN_DAYS = 30;
const PASSWORD_RESET_HOURS = 1;

function buildUserRoles(user: { userRoles: Array<{ role: { name: string } }> }) {
  return user.userRoles.map((userRole) => userRole.role.name);
}

export async function registerUser(data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) {
  const existing = await getUserByEmail(data.email);
  if (existing) {
    throw new HttpError(409, 'Email already in use');
  }

  const passwordHash = await hashPassword(data.password);
  const user = await createUser({
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    passwordHash,
  });

  const role = await getRoleByName('CUSTOMER');
  if (!role) {
    throw new HttpError(500, 'Default customer role not configured');
  }

  await assignRoleToUser(user.id, role.id);
  return { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName };
}

export async function loginUser(email: string, password: string) {
  const user = await getUserByEmail(email);
  if (!user || !user.isActive || user.deletedAt) {
    throw new HttpError(401, 'Invalid credentials');
  }

  const passwordMatches = await comparePassword(password, user.passwordHash);
  if (!passwordMatches) {
    throw new HttpError(401, 'Invalid credentials');
  }

  const roles = buildUserRoles(user);
  const accessToken = signJwt({ sub: user.id, email: user.email, roles });
  const refreshToken = crypto.randomBytes(48).toString('hex');
  const expiresAt = addDays(REFRESH_TOKEN_DAYS);

  await prisma.refreshToken.create({
    data: { token: refreshToken, userId: user.id, expiresAt },
  });

  return { accessToken, refreshToken, user: { id: user.id, email: user.email, roles } };
}

export async function refreshAccessToken(refreshToken: string) {
  const tokenRecord = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: { user: { include: { userRoles: { include: { role: true } } } } },
  });

  if (!tokenRecord || tokenRecord.revokedAt || tokenRecord.deletedAt || tokenRecord.expiresAt < new Date()) {
    throw new HttpError(401, 'Refresh token expired or invalid');
  }

  const roles = buildUserRoles(tokenRecord.user);
  const accessToken = signJwt({ sub: tokenRecord.user.id, email: tokenRecord.user.email, roles });
  return { accessToken, refreshToken };
}

export async function requestPasswordReset(email: string) {
  const user = await getUserByEmail(email);
  const resetToken = crypto.randomBytes(36).toString('hex');
  const expiresAt = addDays(0, PASSWORD_RESET_HOURS);

  if (user) {
    await prisma.passwordResetToken.create({
      data: { token: resetToken, userId: user.id, expiresAt },
    });
  }

  return { message: 'If the email exists, a reset token has been generated.', resetToken: user ? resetToken : undefined };
}

export async function resetPassword(token: string, password: string) {
  const record = await prisma.passwordResetToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!record || record.usedAt || record.expiresAt < new Date() || !record.user || record.user.deletedAt) {
    throw new HttpError(400, 'Invalid or expired reset token');
  }

  const passwordHash = await hashPassword(password);
  await prisma.user.update({
    where: { id: record.userId },
    data: { passwordHash },
  });
  await prisma.passwordResetToken.update({
    where: { id: record.id },
    data: { usedAt: new Date() },
  });
  await revokeRefreshTokens(record.userId);
  return { message: 'Password has been reset successfully' };
}
