import { io, connectedUsers } from '@/index';
import { Message } from '@prisma/client';

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
        socket.emit(String(conversationId) + '-badge', message)
      } else {
        console.log('User not connected:', userId);
      }
    });


    return;
  }

  public async isFriendOnline(friendId: number){
    const isFriendOnline = connectedUsers.get(friendId);
    if(isFriendOnline){
      return true
    } else {
      return false
    }
  }
}

export default new ChatSocketService();
