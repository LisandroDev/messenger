// const sender = await prisma.user.findUnique({
//     where: { id: Number(req.userId) },
//   });

//   if (!sender) {
//     throw new ExistenceConflictError('Unknown');
//   }

//   const newConversation = await prisma.conversation.create({
//     data: { userIds: [sender.id], isGroup: false },
//   });

//   if (!newConversation) {
//     throw new ExistenceConflictError('Unknown');
//   }

//   const newMessage = await prisma.message.create({
//     data: { conversationId: newConversation.id, senderId: sender.id, body: 'con senderid!' },
//   });

//   if (!newMessage) {
//     throw new ExistenceConflictError('Unknown');
//   }

//   const updateUser = await prisma.user.update({
//     where: { id: sender.id},
//     data: { conversations: { connect: { id: newConversation.id} } },
//     include: { conversations: true },
//   });

//   // if (!updateUser) {
//   //   console.log(updateUser);
//   //   throw new ExistenceConflictError('Unknown');
//   // }

//   return res.json(newMessage);