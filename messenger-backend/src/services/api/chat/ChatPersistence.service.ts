import prisma from '@/database/client';
import {
  BadRequestError,
  UnauthorizedError,
} from '@/middlewares/errors/specific-handler';
import { Conversation, Message, User } from '@prisma/client';
import { Request, Response } from 'express';
import { MessageWithSender } from '@/types/custom';

export class ChatPersistenceService {
  public async saveMessageOnNewConversation(req: Request, res: Response) {
    const fromId = Number(req.userId);
    const { toEmail, messageBody } = req.body;

    const userToSend = await prisma.user.findUnique({
      where: { email: toEmail },
      select: { id: true },
    });

    if (!userToSend) {
      throw new Error('This user does not exist!');
    }

    const toId = userToSend.id;

    const existentConversation = await this.getConversation(fromId, toId);

    const conversation =
      existentConversation || (await this.createConversation(fromId, toId));

    if (!existentConversation) {
      await this.updateUsers(conversation.id, fromId, toId);
    }

    const newMessage = await this.createMessage(
      fromId,
      messageBody,
      conversation.id
    );

    return newMessage;
  }

  public async saveMessageOnExistentConversation(req: Request, res: Response) {
    const { messageBody, conversationId } = req.body;
    const fromId = Number(req.userId);
    const existentConversation = await prisma.conversation.findFirst({
      where: { id: Number(conversationId), userIds: { has: fromId } },
    });

    if (!existentConversation) {
      throw new BadRequestError('Conversation does not exist');
    }

    const newMessage = await this.createMessage(
      fromId,
      messageBody,
      existentConversation.id
    );

    return newMessage;
  }

  public async getInformationOfConversation(
    req: Request,
    res: Response
  ): Promise<{ name: string; avatarUrl: string }> {
    const { conversationId } = req.params;
    const userId = Number(req.userId);

    const conversation = await prisma.conversation.findUnique({
      where: { id: Number(conversationId) },
      include: { users: true },
    });

    const friend = conversation?.users.find((user) => user.id !== userId);
    if (!friend) {
      throw new BadRequestError('Friend information cant be find');
    }
    console.log(friend);
    return { name: friend.name, avatarUrl: '' };
  }

  public async getConversations(userId: User['id']): Promise<Conversation[]> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { conversations: true },
    });

    if (!user) {
      throw new Error('User cant be found');
    }

    return user?.conversations;
  }

  public async getMessages(
    req: Request,
    res: Response
  ): Promise<Array<MessageWithSender>> {
    const { conversationId } = req.params;
    const userId = Number(req.userId);

    if (!userId) {
      throw new UnauthorizedError('Unauthorized');
    }
    const conversation = await prisma.conversation.findFirst({
      where: { id: Number(conversationId), userIds: { has: userId } },
      include: { messages: true },
    });

    if (!conversation) {
      throw new UnauthorizedError('Unauthorized');
    }

    type MessageWithSender = Message & { sender: boolean };
    const conversationResponse: Array<MessageWithSender> = [];

    conversation.messages.map((message) => {
      message.senderId === userId
        ? conversationResponse.push({ ...message, sender: true })
        : conversationResponse.push({ ...message, sender: false });
    });

    return conversationResponse;
  }

  private async getConversation(
    senderId: User['id'],
    receiverId: User['id']
  ): Promise<Conversation | null> {
    const conversation = await prisma.conversation.findFirst({
      where: { userIds: { hasEvery: [senderId, receiverId] } },
    });
    return conversation || null;
  }

  private async createConversation(
    senderId: User['id'],
    receiverId: User['id']
  ): Promise<Conversation> {
    const newConversation = await prisma.conversation.create({
      data: { userIds: [senderId, receiverId], isGroup: false },
    });

    return newConversation;
  }

  private async createMessage(
    senderId: User['id'],
    messageBody: string,
    conversationId: Conversation['id']
  ): Promise<Message> {
    const newMessage = await prisma.message.create({
      data: {
        conversationId: conversationId,
        senderId: senderId,
        body: messageBody,
      },
    });
    return newMessage;
  }

  private async updateUsers(
    conversationId: Conversation['id'],
    fromId: User['id'],
    toId: User['id']
  ): Promise<User> {
    // Update Sender User
    const updateSenderUser = await prisma.user.update({
      where: { id: fromId },
      data: { conversations: { connect: { id: conversationId } } },
      include: { conversations: true },
    });

    // Update Receiver User
    await prisma.user.update({
      where: { id: toId },
      data: { conversations: { connect: { id: conversationId } } },
      include: { conversations: true },
    });

    return updateSenderUser;
  }
}

export default new ChatPersistenceService();
