'use client';
import { useRouter } from 'next/navigation';

export default function Logout() {
  const router = useRouter();

  const onLogout = async () => {
    const res = await fetch('http://localhost:3002/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });

    if (res.status == 200) {
      router.push('/');
    }
  };

  return <button onClick={() => onLogout()} className='btn btn-xs sm:btn sm:btn-sm'>Logout</button>;
}
