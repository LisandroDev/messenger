import { Conversation } from '@/app/types/interfaces';
import ConversationBadge from './ConversationBadge';
import CreateConversation from './CreateConversation';

interface SidebarProps {
  Conversations: Conversation[];
  onSelect: (value: string) => void;
}

export default function Sidebar({ Conversations, onSelect }: SidebarProps) {
  
  return (
    <aside className='hidden lg:flex lg:flex-col items-center   w-1/6  text-black'>
      <div className='p-4'>
        <CreateConversation />
      </div>
      <div className='divider'></div>
      {Conversations &&
        Conversations.map((conversation) => (
          <>
            <ConversationBadge
              onSelect={onSelect}
              key={String(conversation.id)}
              id={String(conversation.id)}
            />
            <div className='divider'></div>{' '}
          </>
        ))}
    </aside>
  );
}
