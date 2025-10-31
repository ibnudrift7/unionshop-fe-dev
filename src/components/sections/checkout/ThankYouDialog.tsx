'use client';

import * as React from 'react';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useSettingsQuery } from '@/hooks/use-setting';
import { useAuthStatus } from '@/hooks/use-auth-status';

export function ThankYouDialogContent({}: { onRegister?: () => void }) {
  const { isLoggedIn } = useAuthStatus();
  const { data: settings, isLoading } = useSettingsQuery();
  const router = useRouter();

  const defaultMessage =
    'Pesanan anda sedang kami proses dan akan segera dikirim. Untuk informasi belanja anda, silakan check email.';

  const message = (() => {
    try {
      const flat = settings?.data?.flat || [];
      const member = flat.find((s) => s.name === 'order_success_member')?.value;
      const guest = flat.find((s) => s.name === 'order_success_guest')?.value;
      const chosen = isLoggedIn ? member : guest;
      const trimmed = (chosen ?? '').trim();
      return trimmed.length > 0 ? trimmed : defaultMessage;
    } catch {
      return defaultMessage;
    }
  })();

  return (
    <DialogContent className='p-0 gap-0 rounded-xl'>
      <DialogHeader className='px-6 pt-6'>
        <div className='flex justify-center mb-4'>
          <div className='relative'>
            <Image
              src={'/assets/icon-thanks.png'}
              alt='Terima Kasih'
              width={112}
              height={112}
              className='h-40 w-auto object-contain'
            />
          </div>
        </div>
        <DialogTitle className='text-center text-xl font-bold border-b-2 pb-4'>
          Terima Kasih!
        </DialogTitle>
      </DialogHeader>

      <div className='px-6 my-4'>
        <p className='text-sm md:text-sm text-foreground/80 leading-relaxed text-center whitespace-pre-line'>
          {isLoading ? defaultMessage : message}
        </p>
      </div>

      <div className='px-6 py-4 rounded-b-xl'>
        {isLoggedIn ? (
          <div className='flex items-center justify-end w-full'>
            <div className='ml-auto'>
              <Button
                onClick={() => router.push('/orders')}
                className='bg-brand text-white font-bold hover:bg-brand/90'
              >
                Lihat Pesanan
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </DialogContent>
  );
}

export default ThankYouDialogContent;
