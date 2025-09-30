import * as React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export interface ClaimResultCardProps {
  reward: number;
  onClose: () => void;
}

export default function ClaimResultCard({
  reward,
  onClose,
}: ClaimResultCardProps) {
  return (
    <div className='p-4 border rounded-xl shadow-sm bg-white m-6'>
      <div className='relative mx-auto w-full max-w-xl md:min-h-64 overflow-hidden rounded-2xl'>
        <Image
          src='/assets/bg-claim.png'
          alt='Background klaim'
          fill
          priority
          className='object-cover z-0 pointer-events-none'
        />

        <div className='px-6 py-8 text-center relative z-10'>
          <h3
            className='absolute inset-0 text-black font-extrabold text-2xl md:text-3xl select-none pointer-events-none'
            style={{ transform: 'translateY(35px)' }}
            aria-hidden='true'
          >
            {reward} poin
            <br />
            sudah masuk
          </h3>

          <h3 className='relative text-white font-extrabold text-2xl md:text-3xl'>
            {reward} poin
            <br />
            sudah masuk
          </h3>

          <p className='mt-3 text-black text-base font-bold'>
            Besok, klaim lagi poin yang
            <br />
            lebih banyak
          </p>

          <div className='mt-5'>
            <Button
              onClick={onClose}
              className='bg-brand text-white rounded-full px-6 py-5 md:py-6 w-full font-semibold text-lg hover:opacity-95'
            >
              Klaim Koin
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
