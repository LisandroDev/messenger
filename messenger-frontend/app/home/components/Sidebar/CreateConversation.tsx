'use client';

import { useState } from "react";

function CreateConversation() {
  const [email, setEmail] = useState('');

  const handleChange = (e: any) => {
    setEmail(e.currentTarget.value);
  };

  const createConversation = async (email: string) => {
    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_BACKEND_SERVER as string
      }/api/chat/createMessage`,
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
    const response = await res.json();
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