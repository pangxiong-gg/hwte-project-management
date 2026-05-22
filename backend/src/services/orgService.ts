import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getOrganization(orgId: string) {
  return prisma.organization.findUnique({
    where: { id: orgId },
    include: {
      divisions: {
        where: { deletedAt: null },
        include: {
          children: { where: { deletedAt: null } },
          departments: {
            where: { deletedAt: null },
            include: {
              teams: { where: { deletedAt: null } }
            }
          }
        }
      }
    }
  });
}

export async function createOrganization(data: { name: string; code: string }) {
  return prisma.organization.create({
    data: {
      name: data.name,
      code: data.code
    }
  });
}

export async function createDivision(data: { name: string; code: string; orgId: string; parentId?: string }) {
  return prisma.division.create({
    data: {
      name: data.name,
      code: data.code,
      orgId: data.orgId,
      parentId: data.parentId
    }
  });
}

export async function createDepartment(data: { name: string; code: string; divisionId: string }) {
  return prisma.department.create({
    data: {
      name: data.name,
      code: data.code,
      divisionId: data.divisionId
    }
  });
}

export async function createTeam(data: { name: string; code: string; departmentId: string }) {
  return prisma.team.create({
    data: {
      name: data.name,
      code: data.code,
      departmentId: data.departmentId
    }
  });
}