import prisma from '@/database/client';
import { Conversation, Message, User } from '@prisma/client';
import { Request, Response } from 'express';

export class ChatPersistenceService {
  public async saveMessage(req: Request, res: Response) {
    const senderId = Number(req.userId);
    const { receiverId, messageBody } = req.body;

    const isNewConversation = await this.isNewConversation(
      senderId,
      receiverId
    );

    const newConversation =
      isNewConversation ||
      (await this.createConversation(senderId, receiverId));

    const newMessage = await this.createMessage(
      senderId,
      messageBody,
      newConversation.id
    );

    const updateUser = await this.updateUser(newConversation.id, senderId);

    return newMessage;
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

  public async getMessages(req: Request, res: Response): Promise<Message[]> {
    const { conversationId } = req.body;
    const userId = Number(req.userId);

    if (!userId) {
      throw new Error('Unauthorized');
    }
    const conversation = await prisma.conversation.findFirst({
      where: { id: conversationId, userIds: { has: userId } },
      include: { messages: true },
    });

    if (!conversation) {
      throw new Error('User not found');
    }

    return conversation.messages;
  }

  private async isNewConversation(
    senderId: User['id'],
    receiverId: User['id']
  ): Promise<Conversation | null> {
    const conversation = await prisma.conversation.findFirst({
      where: { userIds: { equals: [senderId, receiverId] } },
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

  private async updateUser(
    conversationId: Conversation['id'],
    senderId: User['id']
  ): Promise<User> {
    const updateUser = await prisma.user.update({
      where: { id: senderId },
      data: { conversations: { connect: { id: conversationId } } },
      include: { conversations: true },
    });
    return updateUser;
  }
}

export default new ChatPersistenceService();
