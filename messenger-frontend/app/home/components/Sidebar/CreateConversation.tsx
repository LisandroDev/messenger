'use client';

import { useState } from "react";
import { Conversation } from '@/app/types/interfaces';
import {toast} from 'react-toastify'
import fetcher from '../../utils/fetcher';
interface CreateConversationProps{
  addConversation: (conversation: Conversation) => void;
}



function CreateConversation({addConversation}: CreateConversationProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: any) => {
    setEmail(e.currentTarget.value);
  };

  const createConversation = async (email: string) => {
    setIsLoading(true);
    try{ 
      const res = await fetcher(
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
        toast.error('Error at create conversation')
      }
      const response = await res.json();
      addConversation(response)
    } catch(error) {
      toast.error('Error at create conversation')
    }
    setIsLoading(false);

  };

  return (
    <div className='flex  flex-col  w-fit mt-8 gap-5'>
      <input
        onChange={handleChange}
        className='w-full  ring  ring-offset-base-100 ring-offset-2 rounded-md p-2'
        placeholder='Type friend email'
        type="email"
        disabled={isLoading}
      ></input>
      <button
        className='btn btn-sm btn-info'
        disabled={isLoading}
        onClick={(e) => { 
          e.preventDefault();
          createConversation(email);
        }}
      >
        Create
      </button>
    </div>
  );
}

export default CreateConversation