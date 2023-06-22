import prisma from '@/database/client';
import {
  ExistenceConflictError,
  UnauthorizedError,
} from '@/middlewares/errors/specific-handler';

import { Request, Response } from 'express';
import ChatPersistenceService from '@/services/api/chat/ChatPersistence.service';

export class ChatController {
  public async createMessage(req: Request, res: Response): Promise<Response> {
    if (!req.userId) {
      throw new UnauthorizedError('Unauthorized');
    }

    const message = await ChatPersistenceService.saveMessage(req, res);

    return res.json(message);
  }

  public async getMessages(req: Request, res: Response): Promise<Response> {
    const sender = await ChatPersistenceService.getMessages(req, res);
    return res.json(sender);
  }

  public async getConversations(
    req: Request,
    res: Response
  ): Promise<Response> {
    const userId = Number(req.userId);
    if (!userId) {
      throw new UnauthorizedError('Unauthorized');
    }
    const conversations = await ChatPersistenceService.getConversations(userId);

    return res.json(conversations)

  }
}

export default new ChatController();
