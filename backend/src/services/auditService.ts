import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function logAction(data: {
  entityType: string;
  entityId: string;
  action: string;
  oldValue?: object;
  newValue?: object;
  operatorId: string;
  operatorIp?: string;
  orgId: string;
}) {
  return prisma.auditLog.create({
    data: {
      entityType: data.entityType,
      entityId: data.entityId,
      action: data.action,
      oldValue: data.oldValue ? JSON.stringify(data.oldValue) : null,
      newValue: data.newValue ? JSON.stringify(data.newValue) : null,
      operatorId: data.operatorId,
      operatorIp: data.operatorIp,
      orgId: data.orgId
    }
  });
}

export async function getAuditLogs(orgId: string, entityType?: string, entityId?: string) {
  return prisma.auditLog.findMany({
    where: {
      orgId,
      entityType: entityType || undefined,
      entityId: entityId || undefined
    },
    include: { operator: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: 'desc' },
    take: 100
  });
}