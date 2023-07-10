// Import @ Alias for ./src

require('module-alias/register');
require('express-async-errors');

import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { Server, Socket } from 'socket.io';
import http from 'http';

// Import Routes
import AuthRoutes from '@/routes/api/auth/auth.routes';
import HomeRoutes from '@/routes/home/home.routes';
import ChatRoutes from '@/routes/api/chat/chat.routes';

// Import Middlewares
import { errorHandler } from '@/middlewares/errors/error-handler';
import { specificErrorHandler } from '@/middlewares/errors/specific-handler';
import { authenticateSocketToken } from './middlewares/socket/authenticateSocketToken';
import { CustomSocket } from './types/custom';

// Config
dotenv.config();
const port = process.env.PORT || 3002;
const app: Express = express();
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_SERVER, credentials: true }));

// Routes /api
app.use('/api/auth', AuthRoutes);
app.use('/api/chat', ChatRoutes);

// Routes /home

app.use('/home', HomeRoutes);

// Errors Middlewares


const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: 'http://localhost:3000', credentials: true },
});


// Add user id to socket
io.use(authenticateSocketToken);

app.use(specificErrorHandler);
app.use(errorHandler);

// Connection to socket
const connectedUsers = new Map<number, CustomSocket>();

io.on('connection', (socket: CustomSocket) => {
  const userId = socket.userId;
  if (userId) {
    connectedUsers.set(Number(userId), socket); // Map the socket to the userId
  }
  console.log('A new socket connection is established:', socket.id);
  socket.on('message', (data: any) => {
    console.log('Received message:', data);
    // Handle the message or emit a response
    socket.emit('response', 'Message received');
  });

  socket.on('disconnect', () => {
    connectedUsers.delete(Number(userId))
    console.log('Socket disconnected:', socket.id);
  });
});

server.listen(port, () => {
  console.log(`[server]: Server is running at https://localhost:${port}`);
});

export { io, connectedUsers }
