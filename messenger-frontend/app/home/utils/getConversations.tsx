
export const fetchConversations = () => {
  const res = fetch(
    `${
      process.env.NEXT_PUBLIC_BACKEND_SERVER as string
    }/api/chat/getConversations`,
    { method: 'GET', credentials: 'include' }
  )
    .then((res) => res.json())
    .catch((err) => {
      throw new Error('Fail at getting conversations');
    });

    return res
};
