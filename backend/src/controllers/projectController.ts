import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import * as projectService from '../services/projectService';

export async function createProjectHandler(req: AuthRequest, res: Response) {
  try {
    const project = await projectService.createProject({ ...req.body, orgId: req.user!.orgId });
    res.json(project);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function getProjectsHandler(req: AuthRequest, res: Response) {
  try {
    const projects = await projectService.getProjects(req.user!.orgId, req.query.status as string);
    res.json(projects);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function getProjectHandler(req: AuthRequest, res: Response) {
  try {
    const project = await projectService.getProjectById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function updateProjectHandler(req: AuthRequest, res: Response) {
  try {
    const project = await projectService.updateProject(req.params.id, req.body);
    res.json(project);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function addTeamHandler(req: AuthRequest, res: Response) {
  try {
    const { userId, role } = req.body;
    const team = await projectService.addProjectTeam(req.params.id, userId, role);
    res.json(team);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function createMilestoneHandler(req: AuthRequest, res: Response) {
  try {
    const milestone = await projectService.createMilestone({ ...req.body, projectId: req.params.id });
    res.json(milestone);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function createFeasibilityHandler(req: AuthRequest, res: Response) {
  try {
    const feasibility = await projectService.createFeasibility(req.params.id);
    res.json(feasibility);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function createCharterHandler(req: AuthRequest, res: Response) {
  try {
    const charter = await projectService.createCharter(req.params.id, req.body);
    res.json(charter);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}