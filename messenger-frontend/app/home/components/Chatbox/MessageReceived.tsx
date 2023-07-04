interface MessageReceivedProps {
  message: string;
  date: string;
}

function MessageReceived({ message, date }: MessageReceivedProps) {
  return (
    <div className='chat chat-start'>
      <div className='chat-bubble  bg-gray-100 text-black'>
        {message}{' '}
        <div className='chat-footer opacity-50 text-black text-xs'>
          {`${date.substring(0, 10)} ${date.substring(11, 16)}`}
        </div>
      </div>
    </div>
  );
}


export default MessageReceived