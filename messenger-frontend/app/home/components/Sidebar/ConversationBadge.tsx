// interface ConversationBadgeProps{
//     AvatarImage: string;
//     Name: string;
// }

interface TestProps {
  id: string;
  onSelect: (value: string) => void;
}

export default function ConversationBadge({ id, onSelect }: TestProps) {
  return (
    <div className='h-22 max-w-max bg-slate-600'>
      <button
        onClick={() => {
          onSelect(id);
        }}
      >
        Id de conversacion: {id}
      </button>
    </div>
  );
}
