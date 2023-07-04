import { useEffect, useState } from 'react';

interface ConversationBadgeProps {
  id: string;
  onSelect: (value: string) => void;
}

interface Information {
  name: string;
  avatarUrl: string;
  lastMessage: { body: string };
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
    <div className='w-full  rounded-lg'>
      <button
        onClick={() => {
          onSelect(id);
        }}
        className='flex w-full px-3 justify-evenly items-center  h-12 '
      >
        <div>
          {information?.avatarUrl || (
            <div className='avatar offline'>
              <div className='h-8 rounded-full ring  ring-offset-base-100 ring-offset-2'>
                <img
                  src='https://static-00.iconduck.com/assets.00/avatar-default-symbolic-icon-2048x1949-pq9uiebg.png'
                  alt='default avatar'
                />
              </div>
            </div>
          )}
        </div>
        <div className='max-w-sm text-center flex flex-col  '>
          <span className='text-sm font-bold'>
            {' '}
            {information && information.name}
          </span>
          <span className='text-xs'>
            {information && information.lastMessage.body}
          </span>
        </div>
      </button>
    </div>
  );
}
