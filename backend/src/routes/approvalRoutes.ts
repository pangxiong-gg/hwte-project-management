import { Router } from 'express';
import { authMiddleware, requireRole } from '../middlewares/auth';
import * as approvalController from '../controllers/approvalController';

const router = Router();

router.use(authMiddleware);

router.get('/', approvalController.getApprovalsHandler);
router.post('/workflows', requireRole('PMO_ADMIN'), approvalController.createWorkflowHandler);
router.post('/', approvalController.createApprovalHandler);
router.post('/:id/submit', approvalController.submitApprovalHandler);

export default router;