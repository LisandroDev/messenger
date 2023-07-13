import { io } from 'socket.io-client';

const URL =
  process.env.NODE_ENV === 'production'
    ? (process.env.NEXT_PUBLIC_BACKEND_SERVER as string)
    : 'http://localhost:3002';
const socket = io(URL, {
  withCredentials: true,
  extraHeaders: {
    Authorization: `Bearer ${sessionStorage.getItem('tokenjwt')}`,
  },
});

export default socket;
