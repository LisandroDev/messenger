'use client';

import { useEffect, useState } from 'react';
import ChatBox from '@/app/home/components/Chatbox/Chatbox';
import Sidebar from '@/app/home/components/Sidebar/Sidebar';
import ModalSideBar from './components/Sidebar/ModalSidebar';
import EmptyChatBox from '@/app/home/components/Chatbox/EmptyChatBox';
import { Conversation } from '@/app/types/interfaces';
import { fetchConversations } from '@/app/home/utils/getConversations';

export default function App() {
  const [conversations, setConversations] = useState<Conversation[]>();
  const [selectedConversation, setSelectedConversation] = useState<string>();
  const [isDesktop, setDesktop] = useState<boolean>(true);

  const onSelect = (value: string) => {
    setSelectedConversation(value);
  };

  useEffect(() => {
    fetchConversations().then((response) => {
      setConversations(response.conversations);
    });
  }, []);

  const updateMedia = () => {
    setDesktop(window.innerWidth > 1024);
  };

  useEffect(() => {
    if(window){
      window.addEventListener('resize', updateMedia);
      return () => window.removeEventListener('resize', updateMedia);
    }
  }, []);

  return (
    <main className='flex-1 flex max-w-full flex-row  gap-y-8 text-cyan-500'>
      {isDesktop ? (
        <Sidebar onSelect={onSelect} Conversations={conversations || []} />
      ) : (
        <ModalSideBar onSelect={onSelect} Conversations={conversations || []} />
      )}
      {selectedConversation ? (
        <ChatBox key={selectedConversation} id={selectedConversation} />
      ) : (
        <EmptyChatBox />
      )}
    </main>
  );
}
