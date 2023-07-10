'use client';

import { useState } from "react";
import { Conversation } from '@/app/types/interfaces';

interface CreateConversationProps{
  addConversation: (conversation: Conversation) => void;
}



function CreateConversation({addConversation}: CreateConversationProps) {
  const [email, setEmail] = useState('');

  const handleChange = (e: any) => {
    setEmail(e.currentTarget.value);
  };

  const createConversation = async (email: string) => {
    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_BACKEND_SERVER as string
      }/api/chat/createConversation`,
      {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          toEmail: email,
          messageBody: '',
        }),
      }
    );

    if(!res.ok){
      console.log('Error at create');
      console.log(res);
    }
    const response = await res.json();
    console.log(response)
    addConversation(response)

  };

  return (
    <div className='flex  flex-col  w-fit mt-8 gap-5'>
      <input
        onChange={handleChange}
        className='w-full  ring  ring-offset-base-100 ring-offset-2 rounded-md p-2'
        placeholder='Type friend email'
      ></input>
      <button
        className='btn btn-sm btn-info'
        onClick={() => {
          createConversation(email);
        }}
      >
        Create
      </button>
    </div>
  );
}

export default CreateConversation