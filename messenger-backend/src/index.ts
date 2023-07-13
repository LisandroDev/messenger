// Import @ Alias for ./src

require('module-alias/register');
require('express-async-errors');

import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { Server, Socket } from 'socket.io';
import http from 'http';
import next from 'next';
import ChatSocketService from './services/api/chat/ChatSocket.service';

// Import Routes
import AuthRoutes from '@/routes/api/auth/auth.routes';
import HomeRoutes from '@/routes/home/home.routes';
import ChatRoutes from '@/routes/api/chat/chat.routes';

// Import Middlewares
import { errorHandler } from '@/middlewares/errors/error-handler';
import { specificErrorHandler } from '@/middlewares/errors/specific-handler';
import { authenticateSocketToken } from './middlewares/socket/authenticateSocketToken';
import { CustomSocket } from './types/custom';
import { authenticateToken } from './middlewares/auth/authenticate';

// Config
dotenv.config();
const port = process.env.PORT || 3016;
const app: Express = express();
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_SERVER, credentials: true }));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_SERVER, credentials: true },
});

// Add user id to socket
io.use(authenticateSocketToken);

// Errors Middlewares
app.use(specificErrorHandler);
app.use(errorHandler);

const dev = process.env.NODE_ENV === 'production';
const nextApp = next({ dev: false });
const handle = nextApp.getRequestHandler();

// Connection to socket
const connectedUsers = new Map<number, CustomSocket>();

// Routes /api
app.use('/api/auth', AuthRoutes);
app.use('/api/chat', ChatRoutes);

// Routes /home

io.on('connection', (socket: CustomSocket) => {
  const userId = socket.userId;
  if (userId) {
    connectedUsers.set(Number(userId), socket);
    ChatSocketService.emitRefreshOfOnlineStatus(Number(userId), true);
  }
  console.log('A new socket connection is established:', socket.id);
  socket.on('message', (data: any) => {
    console.log('Received message:', data);
    // Handle the message or emit a response
    socket.emit('response', 'Message received');
  });

  socket.on('disconnect', () => {
    connectedUsers.delete(Number(userId));
    ChatSocketService.emitRefreshOfOnlineStatus(Number(userId), false);
    console.log('Socket disconnected:', socket.id);
  });
});

nextApp.prepare().then(() => {
  // Serve Next.js frontend

  app.get('/', (req, res) => {
    return handle(req, res);
  });

  app.get('/home', authenticateToken, (req, res) => {
    return handle(req, res);
  });

  app.use('/home', HomeRoutes);

  app.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, () => {
    console.log(`[server]: Server is running at https://localhost:${port}`);
  });
});

export { io, connectedUsers };
