import { io } from 'socket.io-client';

const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:3002';
const socket = io(URL, {withCredentials: true});

export default socket;