import { Router } from 'express';
import { authMiddleware, requireRole } from '../middlewares/auth';
import * as orgController from '../controllers/orgController';

const router = Router();

router.use(authMiddleware);

router.get('/', orgController.getOrgHandler);
router.post('/', requireRole('PMO_ADMIN'), orgController.createOrgHandler);
router.post('/divisions', requireRole('PMO_ADMIN'), orgController.createDivisionHandler);
router.post('/departments', requireRole('PMO_ADMIN'), orgController.createDepartmentHandler);
router.post('/teams', requireRole('PMO_ADMIN'), orgController.createTeamHandler);

export default router;