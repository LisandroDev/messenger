'use client';
import { useRouter } from 'next/navigation';

export default function Logout() {
  const router = useRouter();

  const onLogout = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_SERVER}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });

    if (res.status == 200) {
      window.location.href = "/"
    }
  };

  return <button onClick={() => onLogout()} className='btn btn-xs sm:btn sm:btn-sm'>Logout</button>;
}
