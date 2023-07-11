'use client';

import { useEffect, useState } from 'react';
import ChatBox from '@/app/home/components/Chatbox/Chatbox';
import Sidebar from '@/app/home/components/Sidebar/Sidebar';
import ModalSideBar from './components/Sidebar/ModalSidebar';
import EmptyChatBox from '@/app/home/components/Chatbox/EmptyChatBox';
import { Conversation } from '@/app/types/interfaces';
import socket from './socket/socket';
import { fetchConversations } from '@/app/home/utils/getConversations';
import { toast } from 'react-toastify';

export default function App() {
  const [conversations, setConversations] = useState<Conversation[]>();
  const [selectedConversation, setSelectedConversation] = useState<string>('');
  const [isDesktop, setDesktop] = useState<boolean>(true);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const addConversationFromSocket = (data: Conversation) => {
      if (conversations && data) {
        const conversationsClone = [...conversations, data];
        setConversations(conversationsClone);
        setSelectedConversation(String(data.id));
      }
    };
    socket.on('new-conversation', addConversationFromSocket);

    return () => {
      socket.off('new-conversation', addConversationFromSocket);
    };
  }, [conversations]);

  useEffect(() => {
    fetchConversations()
      .then((response) => {
        setConversations(response.conversations);
      })
      .catch((error) => toast.error('Error at fetching conversations'));
  }, []);

  const onSelect = (value: string) => {
    setSelectedConversation(value);
  };

  const updateMedia = () => {
    setDesktop(window.innerWidth > 1024);
  };

  const addConversation = (conversation: Conversation) => {
    if (conversations && conversation) {
      const conversationsClone = [...conversations, conversation];
      setConversations(conversationsClone);
      setSelectedConversation(String(conversation.id));
    }
  };

  useEffect(() => {
    if (window) {
      updateMedia();
      window.addEventListener('resize', updateMedia);
      return () => window.removeEventListener('resize', updateMedia);
    }
  }, []);

  return (
    <main className='flex-1 flex max-w-full flex-row  gap-y-8 text-cyan-500'>
      {isDesktop ? (
        <Sidebar
          onSelect={onSelect}
          addConversation={addConversation}
          Conversations={conversations || []}
        />
      ) : (
        <ModalSideBar
          addConversation={addConversation}
          onSelect={onSelect}
          Conversations={conversations || []}
        />
      )}
      {selectedConversation ? (
        <ChatBox key={selectedConversation} id={selectedConversation} />
      ) : (
        <EmptyChatBox />
      )}
    </main>
  );
}
