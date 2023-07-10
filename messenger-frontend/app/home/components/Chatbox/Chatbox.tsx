'use client';

import { useEffect, useState, useRef} from 'react';
import MessageSent from './MessageSent';
import MessageReceived from './MessageReceived';
import socket from '../../socket/socket';

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
  const [lastMessageSent, setLastMessageSent] = useState('');
  const [messageToSend, setMessageToSend] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "instant"})
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages]);


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

  useEffect(() => {
    socket.on(id as string, (data: any) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { ...data, sender: false },
      ]);
    });
  }, [id]);

  const sentMessage = async (message: string) => {
    setLastMessageSent(message);
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
    addMessage(response)
  };

  const handleChange = (e: any) => {
    setMessageToSend(e.currentTarget.value);
  };

  const handleSubmit = () => {
    sentMessage(messageToSend);
    setMessageToSend('');
  };

  const addMessage = (newMessage: Message) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { ...newMessage, sender: true },
    ]);
  }

  return (
    <section className='w-full grow  flex-1 p-8 flex flex-col bg-[url("https://i.pinimg.com/736x/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg")] justify-end text-neutral-900 '>
      <div className='max-h-[40rem] overflow-auto overflow-x-hidden mb-8  w-full' >
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
        <div ref={messagesEndRef} />
      </div>

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
