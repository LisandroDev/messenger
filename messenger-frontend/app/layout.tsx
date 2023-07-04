import './globals.css';
import { Inter } from 'next/font/google';
import { Rubik } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });
const rubik = Rubik({weight: ['400','500','800'],subsets:['latin'],style:['italic','normal']})

export const metadata = {
  title: 'Fake Messenger',
  description: 'Fake messenger',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={rubik.className} lang='en'>
      <body className={rubik.className}>{children}</body>
    </html>
  );
}
