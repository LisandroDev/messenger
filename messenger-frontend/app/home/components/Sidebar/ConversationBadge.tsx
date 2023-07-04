'use client';

import { useEffect, useState } from 'react';

interface ConversationBadgeProps {
  id: string;
  onSelect: (value: string) => void;
}

interface Information {
  name: string;
  avatarUrl: string;
}

export default function ConversationBadge({
  id,
  onSelect,
}: ConversationBadgeProps) {
  const [information, setInformation] = useState<Information>();

  useEffect(() => {
    const fetchInformation = async () => {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_SERVER as string
        }/api/chat/getInfoOfConversation/${id}`,
        { credentials: 'include', method: 'GET', cache: 'default' }
      );
      const resInfo = await res.json();
      setInformation(resInfo);
    };
    fetchInformation();
  }, [id]);

  return (
    <div className='max-w-max bg-slate-200 rounded-lg'>
      <button
        onClick={() => {
          onSelect(id);
        }}
         className='flex items-center p-8 h-12 '
      >
        <div>
          {information?.avatarUrl || (
            <div className='avatar'>
              <div className='h-12 rounded-full'>
                <img
                  src='https://static-00.iconduck.com/assets.00/avatar-default-symbolic-icon-2048x1949-pq9uiebg.png'
                  alt='default avatar'
                />
              </div>
            </div>
          )}
        </div>
        {information && information.name}
      </button>
    </div>
  );
}
