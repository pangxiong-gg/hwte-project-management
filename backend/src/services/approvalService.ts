import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface ApprovalStep {
  approverRole: string;
  order: number;
}

export async function createApprovalWorkflow(data: {
  name: string;
  entityType: string;
  steps: ApprovalStep[];
}) {
  return prisma.approvalWorkflow.create({
    data: {
      name: data.name,
      entityType: data.entityType,
      steps: JSON.stringify(data.steps)
    }
  });
}

export async function createApproval(data: {
  workflowId: string;
  entityType: string;
  entityId: string;
  projectId?: string;
}) {
  return prisma.approval.create({
    data: {
      workflowId: data.workflowId,
      entityType: data.entityType,
      entityId: data.entityId,
      projectId: data.projectId,
      status: 'PENDING',
      currentStep: 0
    },
    include: {
      workflow: true,
      records: { include: { approver: true } }
    }
  });
}

export async function submitApproval(approvalId: string, approverId: string, decision: string, comments?: string) {
  const approval = await prisma.approval.findUnique({
    where: { id: approvalId },
    include: { workflow: true }
  });

  if (!approval || approval.status !== 'PENDING') {
    throw new Error('Approval not available');
  }

  const steps = JSON.parse(approval.workflow.steps) as ApprovalStep[];
  const currentStepData = steps[approval.currentStep];

  // Record approval
  await prisma.approvalRecord.create({
    data: {
      approvalId,
      step: approval.currentStep,
      approverId,
      decision,
      comments
    }
  });

  if (decision === 'REJECTED') {
    await prisma.approval.update({
      where: { id: approvalId },
      data: { status: 'REJECTED' }
    });
  } else if (approval.currentStep === steps.length - 1) {
    // Last step - approved
    await prisma.approval.update({
      where: { id: approvalId },
      data: { status: 'APPROVED' }
    });
  } else {
    // Move to next step
    await prisma.approval.update({
      where: { id: approvalId },
      data: { currentStep: approval.currentStep + 1 }
    });
  }

  return prisma.approval.findUnique({
    where: { id: approvalId },
    include: { records: { include: { approver: true } } }
  });
}

export async function getApprovals(orgId: string, status?: string) {
  return prisma.approval.findMany({
    where: status ? { status } : undefined,
    include: {
      workflow: true,
      records: { include: { approver: true } }
    }
  });
}