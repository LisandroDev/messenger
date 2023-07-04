'use client';

import { useEffect, useState } from 'react';
import MessageSent from './MessageSent';
import MessageReceived from './MessageReceived';

interface ChatBoxProps {
  id: String;
}

interface Message {
  body: string;
  createdAt: string;
  id: string;
  sender: boolean;
}

export default function ChatBox({ id }: ChatBoxProps) {
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [messageToSend, setMessageToSend] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_SERVER as string
        }/api/chat/getMessages/${id}`,
        { credentials: 'include', method: 'GET', cache: 'default' }
      );
      const resMessages = await res.json();
      setMessages(resMessages.messages);
    };
    fetchMessages();
  }, [id]);

  const sentMessage = async (message: string) => {
    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_BACKEND_SERVER as string
      }/api/chat/createMessage`,
      {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId: id,
          messageBody: message,
        }),
      }
    );
    const response = await res.json();
  };

  const handleChange = (e: any) => {
    setMessageToSend(e.currentTarget.value);
  };

  const handleSubmit = () => {
    sentMessage(messageToSend);
    setMessageToSend('');
  }

  return (
    <section className='w-full  grow flex-1 p-8 flex flex-col bg-[url("https://i.pinimg.com/736x/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg")] justify-end text-neutral-900 '>
      {messages &&
        messages.map((message) =>
          message.sender ? (
            <MessageSent
              key={message.id}
              message={message.body}
              date={message.createdAt}
            />
          ) : (
            <MessageReceived
              key={message.id}
              message={message.body}
              date={message.createdAt}
            />
          )
        )}
      <div className='divider'></div>
      <div className='flex flex-col gap-y-4 items-center sm:flex-row justify-center  gap-x-8 p-8 bg-slate-300  border-'>
        <input
          onChange={handleChange}
          value={messageToSend}
          type='text'
          placeholder='Type here'
          className='input input-bordered input-sm w-full max-w-md'
        />
        <button
          onClick={handleSubmit}
          className='btn btn-xs sm:btn-md btn-primary'
        >
          Send message
        </button>
      </div>
    </section>
  );
}
