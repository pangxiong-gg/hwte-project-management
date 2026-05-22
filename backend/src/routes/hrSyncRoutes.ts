import { Router } from 'express';
import { authMiddleware, requireRole } from '../middlewares/auth';
import * as hrSyncController from '../controllers/hrSyncController';

const router = Router();

router.use(authMiddleware);

router.post('/sync', requireRole('PMO_ADMIN'), hrSyncController.syncFromCSVHandler);
router.get('/logs', requireRole('PMO_ADMIN', 'DIRECTOR'), hrSyncController.getSyncLogsHandler);

export default router;