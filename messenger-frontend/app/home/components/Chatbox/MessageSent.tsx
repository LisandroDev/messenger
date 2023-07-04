interface MessageSentProps {
    message: string
    date: string
}


function MessageSent({message, date}: MessageSentProps) {
  return (
    <div className='chat chat-end'>
      <div className='chat-bubble bg-[#aad8a1] text-black'>
        {message}
        <div className='chat-footer opacity-50  text-black text-xs'>
          {`${date.substring(0, 10)} ${date.substring(11, 16)}`}
        </div>
      </div>
    </div>
  );
}

export default MessageSent