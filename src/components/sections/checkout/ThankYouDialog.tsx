'use client';

import * as React from 'react';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Image from 'next/image';

export function ThankYouDialogContent({}: { onRegister?: () => void }) {
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
        <p className='text-sm md:text-sm text-foreground/80 leading-relaxed text-center'>
          Pesanan anda sedang kami proses dan akan segera dikirim. Untuk
          informasi belanja anda, silakan check email.
        </p>
      </div>

      {/* <div className='px-6 py-4 rounded-b-xl bg-gray-50 flex items-center gap-3 justify-between border-t-2 relative shadow-[0_-6px_8px_-6px_rgba(0,0,0,0.12)]'>
        <div className='flex items-center gap-3'>
          <Image
            src={'/assets/icon-coin-thanks.png'}
            alt='Ikon poin'
            width={36}
            height={36}
            className='flex-shrink-0'
          />
          <p className='text-sm font-semibold text-gray-900'>
            Cek email anda, untuk segera ganti password akun anda. dan
            dapatkan points dari kami!
          </p>
        </div>
      </div> */}
    </DialogContent>
  );
}

export default ThankYouDialogContent;
