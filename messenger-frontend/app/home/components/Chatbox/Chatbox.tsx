'use client';

import { useEffect, useState } from 'react';

interface ChatBoxProps {
  id: String;
}

export default function ChatBox({ id }: ChatBoxProps) {
  const [messages, setMessages] = useState([]);
  const [createMessage, setCreateMessage] = useState('');

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

  const messageSent = (message: string) => {
    return (
      <div className='chat chat-end'>
        <div className='chat-bubble bg-[#aad8a1] text-black'>{message}</div>
      </div>
    );
  };

  const messageReceived = (message: string) => {
    return (
      <div className='chat chat-start'>
        <div className='chat-bubble bg-white text-black'>{message}</div>
      </div>
    );
  };

  const handleChange = (e: any) => {
    setCreateMessage(e.currentTarget.value);
  };

  return (
    <section className='w-full  grow flex-1 p-8 flex flex-col  justify-end text-neutral-900 bg-slate-200'>
      {messages &&
        messages.map((message) =>
          message.sender
            ? messageSent(message.body)
            : messageReceived(message.body)
        )}
      <div className='divider'></div>
      <div className='flex flex-col gap-y-4 items-center sm:flex-row justify-center  gap-x-8 p-8 bg-slate-300  border-'>
        <input
          onChange={handleChange}
          type='text'
          placeholder='Type here'
          className='input input-bordered input-sm w-full max-w-md'
        />
        <button
          onClick={() => sentMessage(createMessage)}
          className='btn btn-xs sm:btn-md btn-primary'
        >
          Send message
        </button>
      </div>
    </section>
  );
}
