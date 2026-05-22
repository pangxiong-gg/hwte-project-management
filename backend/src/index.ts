import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import authRoutes from './routes/authRoutes';
import orgRoutes from './routes/orgRoutes';
import userRoutes from './routes/userRoutes';
import hrSyncRoutes from './routes/hrSyncRoutes';
import approvalRoutes from './routes/approvalRoutes';
import projectRoutes from './routes/projectRoutes';

const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: { origin: 'http://localhost:5173', methods: ['GET', 'POST'] }
});

// Middleware
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/organizations', orgRoutes);
app.use('/api/users', userRoutes);
app.use('/api/hr-sync', hrSyncRoutes);
app.use('/api/approvals', approvalRoutes);
app.use('/api/projects', projectRoutes);

// Socket.io for real-time notifications
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join-org', (orgId: string) => {
    socket.join(`org-${orgId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { io };