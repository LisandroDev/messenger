import { Conversation } from '@/app/types/interfaces';
import ConversationBadge from './ConversationBadge';
import CreateConversation from './CreateConversation';

interface ModalSidebarProps {
  Conversations: Conversation[];
  onSelect: (value: string) => void;
  addConversation: (conversation: Conversation) => void;
}

export default function ModalSideBar({ Conversations, onSelect , addConversation}: ModalSidebarProps) {
  return (
    <>
    <dialog id='my_modal_5' className='modal modal-bottom sm:modal-middle'>
      <form method='dialog' className='modal-box'>
        <aside className='flex  w-full flex-col items-center   text-black'>
          <div className='p-4'>
            <CreateConversation  addConversation={addConversation}/>
          </div>
          <div className='divider'></div>
          {Conversations &&
            Conversations.map((conversation) => (
              <>
                <ConversationBadge
                  onSelect={onSelect}
                  key={String(conversation.id) + 'modal'}
                  id={String(conversation.id)}
                />
                <div className='divider'></div>{' '}
              </>
            ))}
        </aside>
        <div className='modal-action'>
          {/* if there is a button in form, it will close the modal */}
          <button className='btn'>Close</button>
        </div>
      </form>
    </dialog>
    </>
  );
}
