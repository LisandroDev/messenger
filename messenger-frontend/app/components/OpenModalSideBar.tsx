'use client';

declare global {
  interface Window {
    my_modal_5: { showModal: () => void}
  }
}

function OpenModalSideBar() {

  return (
    <button className='btn flex lg:hidden' onClick={() => window.my_modal_5.showModal()}>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
    </button>
  );
}

export default OpenModalSideBar
