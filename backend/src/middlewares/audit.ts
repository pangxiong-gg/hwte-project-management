import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import * as auditService from '../services/auditService';

export function auditLog(entityType: string) {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    const originalJson = res.json.bind(res);

    res.json = function(body: any) {
      if (req.user && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
        auditService.logAction({
          entityType,
          entityId: req.params.id || body?.id || 'unknown',
          action: req.method === 'POST' ? 'CREATE' : req.method === 'DELETE' ? 'DELETE' : 'UPDATE',
          operatorId: req.user.userId,
          operatorIp: req.ip,
          orgId: req.user.orgId,
          newValue: body
        }).catch(console.error);
      }
      return originalJson(body);
    };

    next();
  };
}