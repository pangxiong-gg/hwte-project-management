import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import * as approvalService from '../services/approvalService';

export async function createWorkflowHandler(req: AuthRequest, res: Response) {
  try {
    const workflow = await approvalService.createApprovalWorkflow(req.body);
    res.json(workflow);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function createApprovalHandler(req: AuthRequest, res: Response) {
  try {
    const approval = await approvalService.createApproval(req.body);
    res.json(approval);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function submitApprovalHandler(req: AuthRequest, res: Response) {
  try {
    const { decision, comments } = req.body;
    const approval = await approvalService.submitApproval(
      req.params.id,
      req.user!.userId,
      decision,
      comments
    );
    res.json(approval);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function getApprovalsHandler(req: AuthRequest, res: Response) {
  try {
    const approvals = await approvalService.getApprovals(req.user!.orgId, req.query.status as string);
    res.json(approvals);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}