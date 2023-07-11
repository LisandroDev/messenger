
import { Conversation } from '@/app/types/interfaces';
import ConversationBadge from './ConversationBadge';
import CreateConversation from './CreateConversation';
import { Fragment } from 'react';
import { Suspense } from 'react';
interface SidebarProps {
  Conversations: Conversation[];
  onSelect: (value: string) => void;
  addConversation: (conversation: Conversation) => void;
}

export default function Sidebar({ Conversations, onSelect, addConversation }: SidebarProps) {

  
  return (
    <aside className='hidden lg:flex lg:flex-col items-center   w-1/6  text-black'>
      <div className='p-4'>
        <CreateConversation  addConversation={addConversation} />
      </div>
      <div className='divider'></div>
      {Conversations &&
        Conversations.map((conversation) => (
          <Fragment key={String(conversation.id)}>
            <ConversationBadge
              onSelect={onSelect}
              id={String(conversation.id)}
            />
            <div  className='divider'></div>{' '}
          </Fragment>
        ))}
    </aside>

  );
}
