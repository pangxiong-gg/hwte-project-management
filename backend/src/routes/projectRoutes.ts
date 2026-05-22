import { Router } from 'express';
import { authMiddleware, requireRole } from '../middlewares/auth';
import * as projectController from '../controllers/projectController';

const router = Router();

router.use(authMiddleware);

router.get('/', projectController.getProjectsHandler);
router.get('/:id', projectController.getProjectHandler);
router.post('/', requireRole('PMO_ADMIN', 'DIRECTOR', 'PM'), projectController.createProjectHandler);
router.put('/:id', requireRole('PMO_ADMIN', 'DIRECTOR', 'PM'), projectController.updateProjectHandler);
router.post('/:id/team', requireRole('PMO_ADMIN', 'DIRECTOR', 'PM'), projectController.addTeamHandler);
router.post('/:id/milestones', requireRole('PMO_ADMIN', 'DIRECTOR', 'PM'), projectController.createMilestoneHandler);
router.post('/:id/feasibility', requireRole('PMO_ADMIN', 'DIRECTOR', 'PM'), projectController.createFeasibilityHandler);
router.post('/:id/charter', requireRole('PMO_ADMIN', 'DIRECTOR', 'PM'), projectController.createCharterHandler);

export default router;