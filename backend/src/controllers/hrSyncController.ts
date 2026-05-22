import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import * as hrSyncService from '../services/hrSyncService';

export async function syncFromCSVHandler(req: AuthRequest, res: Response) {
  try {
    const filePath = req.body.filePath;
    if (!filePath) {
      return res.status(400).json({ error: 'filePath is required' });
    }
    const results = await hrSyncService.syncFromCSV(filePath);
    res.json(results);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function getSyncLogsHandler(req: AuthRequest, res: Response) {
  try {
    const logs = await hrSyncService.getSyncLogs();
    res.json(logs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}