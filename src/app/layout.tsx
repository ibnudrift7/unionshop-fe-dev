import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

export const metadata: Metadata = {
  title: 'Unionlabs - Liquid Vapor Premium',
  description: 'Unionlabs - Liquid Vapor Premium',
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className='antialiased font-sans'>
        {children}
        <Toaster position='top-center' />
      </body>
    </html>
  );
}
