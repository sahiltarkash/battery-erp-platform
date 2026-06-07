import { prisma } from '../prisma/client';

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    include: { userRoles: { include: { role: true } } },
  });
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: { userRoles: { include: { role: true } } },
  });
}

export async function createUser(data: {
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
}) {
  return prisma.user.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      passwordHash: data.passwordHash,
    },
  });
}

export async function assignRoleToUser(userId: string, roleId: string) {
  return prisma.userRole.create({
    data: { userId, roleId },
  });
}

export async function revokeRefreshTokens(userId: string) {
  return prisma.refreshToken.updateMany({
    where: { userId, revokedAt: null, deletedAt: null },
    data: { revokedAt: new Date() },
  });
}
