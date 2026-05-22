import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import * as orgService from '../services/orgService';

export async function getOrgHandler(req: AuthRequest, res: Response) {
  try {
    const org = await orgService.getOrganization(req.user!.orgId);
    res.json(org);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function createOrgHandler(req: AuthRequest, res: Response) {
  try {
    const org = await orgService.createOrganization(req.body);
    res.json(org);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function createDivisionHandler(req: AuthRequest, res: Response) {
  try {
    const division = await orgService.createDivision({ ...req.body, orgId: req.user!.orgId });
    res.json(division);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function createDepartmentHandler(req: AuthRequest, res: Response) {
  try {
    const dept = await orgService.createDepartment(req.body);
    res.json(dept);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function createTeamHandler(req: AuthRequest, res: Response) {
  try {
    const team = await orgService.createTeam(req.body);
    res.json(team);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}