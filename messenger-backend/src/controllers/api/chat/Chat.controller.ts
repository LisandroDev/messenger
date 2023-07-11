import {
  BadRequestError,
  UnauthorizedError,
} from '@/middlewares/errors/specific-handler';
import { io, connectedUsers } from '@/index';

import { Request, Response } from 'express';
import ChatPersistenceService from '@/services/api/chat/ChatPersistence.service';
import ChatSocketService from '@/services/api/chat/ChatSocket.service';

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

  public async createConversation(
    req: Request,
    res: Response
  ): Promise<Response> {
    if (!req.userId) {
      throw new UnauthorizedError('Unauthorized');
    }

    const newConversation = await ChatPersistenceService.createNewConversation(
      req,
      res
    );

    return res.json(newConversation);
  }

  public async getMessages(req: Request, res: Response): Promise<Response> {
    const { conversationId } = req.params;

    if (!conversationId) {
      throw new BadRequestError('Conversation id was not provided');
    }

    if (!req.userId) {
      throw new UnauthorizedError('Unauthorized');
    }

    const socket = connectedUsers.get(Number(req.userId));
    if (socket) {
      // Socket with the specified userId found
      socket.join(conversationId);
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
    try {
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

      const isFriendOnline = await ChatSocketService.isFriendOnline(
        information.friendId
      );

      return res.json({ ...information, online: isFriendOnline });
    } catch (error) {
      console.error(error);
      return res.json({ error: '500' });
    }
  }
}

export default new ChatController();
