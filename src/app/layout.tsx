import type { Metadata } from 'next';
import { QueryProvider } from '@/components/providers/QueryProvider';
import AgeGate from '@/components/providers/AgeGate';
import { Toaster } from '@/components/ui/sonner';
// @ts-expect-error allow global CSS side-effect import
import '@/app/globals.css';

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
        <QueryProvider>
          <AgeGate />
          {children}
          <Toaster position='top-center' />
        </QueryProvider>
      </body>
    </html>
  );
}
