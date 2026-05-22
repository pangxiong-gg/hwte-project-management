import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import * as userService from '../services/userService';

export async function getUsersHandler(req: AuthRequest, res: Response) {
  try {
    const users = await userService.getUsers(req.user!.orgId);
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function getUserHandler(req: AuthRequest, res: Response) {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function createUserHandler(req: AuthRequest, res: Response) {
  try {
    const user = await userService.createUser({ ...req.body, orgId: req.user!.orgId });
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function updateUserHandler(req: AuthRequest, res: Response) {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function deactivateUserHandler(req: AuthRequest, res: Response) {
  try {
    await userService.deactivateUser(req.params.id);
    res.json({ message: 'User deactivated' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function assignRolesHandler(req: AuthRequest, res: Response) {
  try {
    const { roles, scope, scopeId } = req.body;
    await userService.assignRoles(req.params.id, roles, scope, scopeId);
    res.json({ message: 'Roles assigned' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}