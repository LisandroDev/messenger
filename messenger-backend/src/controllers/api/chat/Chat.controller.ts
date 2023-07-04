import {
  BadRequestError,
  UnauthorizedError,
} from '@/middlewares/errors/specific-handler';

import { Request, Response } from 'express';
import ChatPersistenceService from '@/services/api/chat/ChatPersistence.service';

export class ChatController {
  public async createMessage(req: Request, res: Response): Promise<Response> {
    const { conversationId } = req.body;
    if (!req.userId) {
      throw new UnauthorizedError('Unauthorized');
    }
    if (conversationId) {
      const messageOnExistentConversation =
        await ChatPersistenceService.saveMessageOnExistentConversation(
          req,
          res
        );
      return res.json(messageOnExistentConversation);
    } else {
      const messageNewConversation =
        await ChatPersistenceService.saveMessageOnNewConversation(req, res);
      return res.json(messageNewConversation);
    }
  }

  public async getMessages(req: Request, res: Response): Promise<Response> {
    const { conversationId } = req.params;

    if (!conversationId) {
      throw new BadRequestError('Conversation id was not provided');
    }

    const messages = await ChatPersistenceService.getMessages(req, res);
    return res.json({ messages: messages });
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

    return res.json({ conversations: conversations });
  }

  public async getInformationOfConversation(
    req: Request,
    res: Response
  ): Promise<Response> {
    const { conversationId } = req.params;

    if (!conversationId) {
      throw new BadRequestError('Conversation id was not provided');
    }

    const userId = Number(req.userId);
    if (!userId) {
      throw new UnauthorizedError('Unauthorized');
    }

    const information =
      await ChatPersistenceService.getInformationOfConversation(req, res);

    return res.json(information);
  }
}

export default new ChatController();
