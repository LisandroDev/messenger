'use client';

import { useEffect, useState } from 'react';
import ChatBox from '@/app/home/components/Chatbox/Chatbox';
import Sidebar from '@/app/home/components/Sidebar/Sidebar';
import EmptyChatBox from '@/app/home/components/Chatbox/EmptyChatBox';
import { Conversation } from '@/app/types/interfaces';
import { fetchConversations } from '@/app/home/utils/getConversations';

export default function App() {
  const [conversations, setConversations] = useState<Conversation[]>();
  const [selectedConversation, setSelectedConversation] = useState<string>();
 

  const onSelect = (value: string) => {
    setSelectedConversation(value);
  };

  useEffect(() => {
    fetchConversations().then((response) => {
      setConversations(response.conversations);

    });
  }, []);

  return (
    <main className='flex-1 flex max-w-full flex-row  gap-y-8 text-cyan-500'>
      <Sidebar onSelect={onSelect} Conversations={conversations || []} />
      {selectedConversation ? (
        <ChatBox
          key={selectedConversation}
          friendId={'2'} 
          id={selectedConversation}
        />
      ) : (
        <EmptyChatBox />
      )}
    </main>
  );
}
