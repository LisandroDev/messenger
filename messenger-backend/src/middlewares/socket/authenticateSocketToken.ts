import { Server, Socket } from 'socket.io';
import { UnauthorizedError } from '../errors/specific-handler';
import TokenManager from '@/utils/token.utils';

// Define a custom interface by extending the Socket interface
interface CustomSocket extends Socket {
  userId?: string;
}

// Middleware function
export function authenticateSocketToken(socket: CustomSocket, next: (err?: Error) => void) {
  const authHeader = socket.handshake.headers['authorization'];
  const cookie = socket.handshake.headers['cookie']?.split('jwt_token=')[1];
  const token = authHeader && authHeader.split(' ')[1];

  if (!cookie) {
    return next(new UnauthorizedError('Unauthorized'));
  }

  const tokenAuthenticated = TokenManager.authenticateToken(cookie);

  if (tokenAuthenticated) {
    socket.userId = tokenAuthenticated.userId;
  }

  next();
}