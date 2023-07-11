import Image from 'next/image';
import Logout from '@/app/components/Logout'
import OpenModalSideBar from './OpenModalSideBar';

export default function Navbar() {
  return (
    <header className='navbar  border-b-2 '>
      <div className='flex-1'>
        <div className='flex'>
        <OpenModalSideBar />
        
          <a className='btn btn-ghost normal-case sm:text-xl'><Image
            height='24'
            width='44'
            className='mx-auto sm:w-auto w-8'
            src='/images/messengerlogo.png'
            alt='Logo'
          /> <p className=' text-sm font-normal'>Messenger</p></a>
        </div>

      </div>
      <div className='flex-none'>

        <Logout />
      </div>
    </header>
  );
}
