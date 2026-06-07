import { prisma } from '../prisma/client';

const defaultRoles = ['ADMIN', 'MANAGER', 'TECHNICIAN', 'CUSTOMER'] as const;

export async function ensureDefaultRoles() {
  await Promise.all(
    defaultRoles.map((name) =>
      prisma.role.upsert({
        where: { name },
        update: {},
        create: { name, description: `${name} role` },
      }),
    ),
  );
}

export async function getRoleByName(name: string) {
  return prisma.role.findUnique({ where: { name } });
}
