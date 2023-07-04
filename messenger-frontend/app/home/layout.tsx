import Navbar from '@/app/components/navbar';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className='h-full'>
      <div className='flex h-full flex-col grow'>
        <Navbar />
        {children}
      </div>
    </main>
  );
}
