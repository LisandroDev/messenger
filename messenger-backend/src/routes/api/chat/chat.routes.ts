import express from 'express';

import { Response, Request } from 'express';

import { authenticateToken } from '@/middlewares/auth/authenticate';

import ChatController from '@/controllers/api/chat/Chat.controller';

const router = express.Router();

router.use(authenticateToken)

router.post('/createMessage', (req: Request, res: Response) =>
  ChatController.createMessage(req, res)
);

router.get('/getMessages/:conversationId', (req: Request, res: Response) =>
ChatController.getMessages(req, res))

router.get('/getConversations',(req: Request, res: Response) =>
ChatController.getConversations(req, res))

export default router