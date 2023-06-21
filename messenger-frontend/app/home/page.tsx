'use client';

import { useRouter } from 'next/navigation';

export default async function Home() {
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

  return (
    <div className='  text-cyan-500'>
      <p>Home Page</p>
      <button onClick={() => onLogout()} className=' text-blue-950 bg-black'>
        Logout
      </button>
    </div>
  );
}
