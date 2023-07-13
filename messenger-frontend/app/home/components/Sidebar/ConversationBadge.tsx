'use client';
import { useEffect, useState } from 'react';
import socket from '@/socket/socket';
import { toast } from 'react-toastify'
import fetcher from '../../utils/fetcher';


interface ConversationBadgeProps {
  id: string;
  onSelect: (value: string) => void;
}

interface Information {
  name: string;
  avatarUrl: string;
  lastMessage: { body: string };
  online: boolean;
  friendId: number;
}

export default function ConversationBadge({
  id,
  onSelect,
}: ConversationBadgeProps) {
  const [information, setInformation] = useState<Information>();
  const [lastMessageFromSocket, setLastMessageFromSocket] =
    useState<string>('');
  const [notification, setNotification] = useState<boolean>(false);
  const [messageCounter, setMessageCounter] = useState<number>(0);

  useEffect(() => {
      const fetchInformation = async () => {
        const res = await fetcher(
          `${
            process.env.NEXT_PUBLIC_BACKEND_SERVER as string
          }/api/chat/getInfoOfConversation/${id}`,
          { credentials: 'include', method: 'GET', cache: 'default' }
        );
        const resInfo = await res.json();
        setInformation(resInfo);
      };
      fetchInformation().catch((error) => {
        toast.error('Error at fetching conversation information')
      });

  }, [id]);

  useEffect(() => {
    const manageNotification = (data: any) => {
      if (
        information?.friendId === data.senderId &&
        localStorage.getItem('conversationOpen') !== id
      ) {
        setNotification(true);
        setMessageCounter((messageCounter) => messageCounter + 1);
      }
      setLastMessageFromSocket(data.body);
    };

    const manageOnlineStatusOfFriend = (data: any) => {
      if (information) {
        const informationClone = { ...information, online: data };
        setInformation(informationClone);
      }
    };

    socket.on(`${id}-badge`, manageNotification);
    socket.on(String(information?.friendId), manageOnlineStatusOfFriend);

    return () => {
      socket.off(`${id}-badge`, manageNotification);
      socket.off(String(information?.friendId), manageOnlineStatusOfFriend);
    };
  }, [id, information]);

  return (
    <div className='w-full rounded-lg'>
      <button
        onClick={() => {
          onSelect(id);
          setNotification(false);
          setMessageCounter(0);
          localStorage.removeItem('conversationOpen');
          localStorage.setItem('conversationOpen', id);
        }}
        className='flex w-full px-3 justify-evenly items-center  h-12 '
      >
        <div>
          {information?.avatarUrl || (
            <div
              className={
                information?.online ? 'avatar online' : 'avatar offline'
              }
            >
              <div
                className={`h-8 rounded-full ring  ring-offset-base-100 ${
                  information?.online ? 'ring-success' : ''
                }  ring-offset-2`}
              >
                {
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src='https://static-00.iconduck.com/assets.00/avatar-default-symbolic-icon-2048x1949-pq9uiebg.png'
                    alt='default avatar'
                  />
                }
              </div>
            </div>
          )}
        </div>
        <div className='max-w-sm text-center flex flex-col  '>
          <span className='text-sm font-bold'>
            {' '}
            {information && information.name}
          </span>
          <span className='text-xs truncate  w-20'>
            {lastMessageFromSocket
              ? lastMessageFromSocket
              : information && information?.lastMessage?.body}
          </span>
        </div>
        <div>
          {notification && (
            <div className='badge badge-success badge-xs p-2'>
              +{messageCounter}
            </div>
          )}
        </div>
      </button>
    </div>
  );
}
