import { Router } from 'express';
import { authMiddleware, requireRole } from '../middlewares/auth';
import * as userController from '../controllers/userController';

const router = Router();

router.use(authMiddleware);

router.get('/', requireRole('PMO_ADMIN', 'DIRECTOR', 'PM'), userController.getUsersHandler);
router.get('/:id', userController.getUserHandler);
router.post('/', requireRole('PMO_ADMIN'), userController.createUserHandler);
router.put('/:id', requireRole('PMO_ADMIN'), userController.updateUserHandler);
router.delete('/:id', requireRole('PMO_ADMIN'), userController.deactivateUserHandler);
router.post('/:id/roles', requireRole('PMO_ADMIN'), userController.assignRolesHandler);

export default router;