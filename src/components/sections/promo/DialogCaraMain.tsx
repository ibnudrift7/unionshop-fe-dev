'use client';

import * as React from 'react';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Image from 'next/image';

export function HowToPlayDialogContent() {
  return (
    <DialogContent className='p-0 gap-0 rounded-xl'>
      <DialogHeader className='px-6 pt-6'>
        <div className='flex justify-center mb-4'>
          <div className='relative'>
            <Image
              src={'/assets/icon-claim.png'}
              alt='Ilustrasi klaim'
              width={112}
              height={112}
              className='h-40 w-40 object-contain'
            />
          </div>
        </div>
        <DialogTitle className='text-center text-2xl font-semibold border-b-2 pb-4'>
          Cara Mainnya:
        </DialogTitle>
      </DialogHeader>

      <div className='px-6 my-4'>
        <ol className='text-xs md:text-sm text-foreground/80 space-y-4'>
          <li className='flex gap-2'>
            <span className='shrink-0 font-medium'>1.</span>
            <span>
              Temukan banner &quot;Check-in Setiap Hari&quot; di halaman promo.
            </span>
          </li>
          <li className='flex gap-2'>
            <span className='shrink-0 font-medium'>2.</span>
            <span>
              Tekan tombol &quot;Klaim&quot; dan poinmu langsung bertambah.
            </span>
          </li>
          <li className='flex gap-2'>
            <span className='shrink-0 font-medium'>3.</span>
            <span>Ulangi setiap hari untuk dapat poin lebih banyak!</span>
          </li>
        </ol>
      </div>

      <div className='px-6 py-5 rounded-b-xl text-pretty text-xs leading-relaxed text-white bg-brand text-center'>
        Poin yang kamu dapat akan terus bertambah setiap hari. jangan lewatkan
        satu hari pun. Karena di Hari ke-7, poin yang kamu dapat bakal jauh
        lebih besar! Jadi, kumpulkan terus poinmu dan nimati berbagai keuntungan
        dari Makna.
      </div>
    </DialogContent>
  );
}

export default HowToPlayDialogContent;
