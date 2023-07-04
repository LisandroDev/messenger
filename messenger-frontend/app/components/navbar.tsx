import Image from 'next/image';
import Logout from '@/app/components/Logout'

export default function Navbar() {
  return (
    <header className='navbar bg-base-200'>
      <div className='flex-1'>
        <div className='flex'>
        <label
            htmlFor='my-drawer-2'
            className='visible lg:hidden btn btn-ghost btn-circle'
          >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
          </label>
        
          <a className='btn btn-ghost normal-case text-xl'><Image
            height='24'
            width='44'
            className='mx-auto w-auto'
            src='/images/messengerlogo.png'
            alt='Logo'
          />Messenger</a>
        </div>
      </div>
      <div className='flex-none'>

        <Logout />
      </div>
    </header>
  );
}
