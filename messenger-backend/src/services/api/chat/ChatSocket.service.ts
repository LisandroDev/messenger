import { io, connectedUsers } from '@/index';
import { Conversation, Message } from '@prisma/client';

export class ChatSocketService {
  public async emitMessageToAllUsersIdsOnConversation(
    fromId: number,
    conversationId: number,
    userIds: Array<number>,
    message: Message
  ) {
    userIds.forEach((userId) => {
      const socket = connectedUsers.get(userId);
      if (socket) {
        userId === fromId ? null : socket.emit(String(conversationId), message);
        socket.emit(String(conversationId) + '-badge', message);
      } else {
        console.log('User not connected:', userId);
      }
    });

    return;
  }

  public async emitNewConversationToFriend(
    conversation: Conversation,
    friendId: number
  ) {
    const friendSocket = connectedUsers.get(friendId);
    if (friendSocket) {
      friendSocket.emit('new-conversation', conversation);
    }
    return;
  }

  public async emitRefreshOfOnlineStatus(fromId: number, isOnline: boolean) {
    io.emit(String(fromId), isOnline);
    return;
  }

  public async isFriendOnline(friendId: number) {
    const isFriendOnline = connectedUsers.get(friendId);
    if (isFriendOnline) {
      return true;
    } else {
      return false;
    }
  } 
} 

export default new ChatSocketService();
