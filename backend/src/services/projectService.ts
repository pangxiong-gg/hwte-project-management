import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createProject(data: {
  name: string;
  code: string;
  type: string;
  description?: string;
  businessBackground?: string;
  coreGoals?: string;
  budget?: number;
  startDate?: Date;
  endDate?: Date;
  stakeholders?: string[];
  orgId: string;
}) {
  return prisma.project.create({
    data: {
      name: data.name,
      code: data.code,
      type: data.type,
      status: 'DRAFT',
      description: data.description,
      businessBackground: data.businessBackground,
      coreGoals: data.coreGoals,
      budget: data.budget,
      startDate: data.startDate,
      endDate: data.endDate,
      stakeholders: JSON.stringify(data.stakeholders || []),
      orgId: data.orgId
    }
  });
}

export async function getProjects(orgId: string, status?: string) {
  return prisma.project.findMany({
    where: {
      orgId,
      deletedAt: null,
      status: status || undefined
    },
    include: {
      projectManager: { select: { id: true, name: true, email: true } },
      teams: { include: { user: { select: { id: true, name: true } } } },
      milestones: true,
      _count: { select: { requirements: true, tasks: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
}

export async function getProjectById(id: string) {
  return prisma.project.findUnique({
    where: { id },
    include: {
      projectManager: { select: { id: true, name: true, email: true } },
      teams: { include: { user: true } },
      milestones: true,
      feasibility: true,
      charter: true,
      requirements: true,
      tasks: true,
      documents: true,
      approvals: { include: { workflow: true, records: { include: { approver: true } } } }
    }
  });
}

export async function updateProject(id: string, data: Partial<{
  name: string;
  description: string;
  budget: number;
  startDate: Date;
  endDate: Date;
  pmId: string;
  status: string;
}>) {
  return prisma.project.update({
    where: { id },
    data
  });
}

export async function addProjectTeam(projectId: string, userId: string, role: string) {
  return prisma.projectTeam.create({
    data: { projectId, userId, role }
  });
}

export async function createMilestone(data: { projectId: string; name: string; dueDate: Date; deliverables?: string[] }) {
  return prisma.milestone.create({
    data: {
      projectId: data.projectId,
      name: data.name,
      dueDate: data.dueDate,
      deliverables: JSON.stringify(data.deliverables || []),
      status: 'PENDING'
    }
  });
}

export async function createFeasibility(projectId: string) {
  return prisma.feasibility.create({
    data: {
      projectId,
      status: 'IN_PROGRESS'
    }
  });
}

export async function createCharter(projectId: string, data: {
  charterDoc?: string;
  requirementBaseline?: object;
  scheduleBaseline?: object;
  costBaseline?: number;
}) {
  return prisma.projectCharter.create({
    data: {
      projectId,
      charterDoc: data.charterDoc,
      requirementBaseline: JSON.stringify(data.requirementBaseline),
      scheduleBaseline: JSON.stringify(data.scheduleBaseline),
      costBaseline: data.costBaseline,
      status: 'DRAFT'
    }
  });
}