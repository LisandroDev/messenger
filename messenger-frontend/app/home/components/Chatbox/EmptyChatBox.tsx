export default function EmptyChatBox() {
  return (
    <section className='w-full  grow flex-1 p-8 flex flex-col  justify-end text-neutral-900 bg-slate-200'>
      <div className='text-center  my-64'>
        <h1> No conversation selected! </h1>
      </div>
      <div className='divider'></div>
      <div className='flex flex-col gap-y-4 items-center sm:flex-row justify-center  gap-x-8 p-8 bg-slate-300  border-'>
        <input
          type='text'
          disabled={true}
          placeholder='Type here'
          className='input input-bordered input-sm w-full max-w-md'
        />
        <button
          disabled={true}
          className='btn btn-disabled btn-xs sm:btn-md btn-primary'
        >
          Send message
        </button>
      </div>
    </section>
  );
}
