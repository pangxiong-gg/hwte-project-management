import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function getUsers(orgId: string) {
  return prisma.user.findMany({
    where: { orgId, deletedAt: null },
    include: {
      roles: { include: { role: true } },
      division: true,
      team: true
    }
  });
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      roles: { include: { role: true } },
      division: true,
      team: true
    }
  });
}

export async function createUser(data: {
  email: string;
  name: string;
  password: string;
  orgId: string;
  divisionId?: string;
  teamId?: string;
  roles: string[];
}) {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  return prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      password: hashedPassword,
      orgId: data.orgId,
      divisionId: data.divisionId,
      teamId: data.teamId,
      roles: {
        create: data.roles.map(roleName => ({
          role: { connect: { name: roleName } },
          scope: 'ORG',
          scopeId: data.orgId
        }))
      }
    },
    include: {
      roles: { include: { role: true } }
    }
  });
}

export async function updateUser(id: string, data: Partial<{ name: string; divisionId: string; teamId: string }>) {
  return prisma.user.update({
    where: { id },
    data
  });
}

export async function deactivateUser(id: string) {
  return prisma.user.update({
    where: { id },
    data: { deletedAt: new Date() }
  });
}

export async function assignRoles(userId: string, roles: string[], scope: string, scopeId?: string) {
  // Delete existing roles
  await prisma.userRole.deleteMany({ where: { userId } });

  // Create new roles
  return prisma.userRole.createMany({
    data: roles.map(roleName => ({
      userId,
      role: { connect: { name: roleName } },
      scope,
      scopeId: scopeId || null
    }))
  });
}