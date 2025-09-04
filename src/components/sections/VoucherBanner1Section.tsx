'use client';

import {
  CardVoucher,
  CardVoucherLeft,
  CardVoucherRight,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface VoucherBanner1Props {
  image?: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  onClaim?: () => void;
}

export default function VoucherBanner1Section({
  image = '/assets/Voucher2.png',
  title = 'Voucher buy 1 get 1 special',
  subtitle = 'UNIONLABS WEBSITE USER.',
  buttonText = 'KLAIM',
  onClaim,
}: VoucherBanner1Props) {
  return (
    <div className='mx-2 sm:mx-4 mb-4 sm:mb-6'>
      <CardVoucher className='border-2 sm:border-4 md:border-5 border-brand shadow-lg overflow-hidden'>
        <CardVoucherLeft className='p-3 sm:p-4 md:p-6 min-w-[120px] sm:min-w-[150px] md:min-w-[180px]'>
          <Image
            src={image}
            alt='Voucher'
            width={64}
            height={64}
            className='w-12 h-12 sm:w-16 sm:h-16 object-contain'
          />
        </CardVoucherLeft>

        <CardVoucherRight className='sm:p-3 md:p-4 pl-4 sm:pl-6 md:pl-8'>
          <div className='grid grid-cols-3 items-center h-full w-full gap-2 sm:gap-4'>
            <div className='col-span-2 flex flex-col justify-center'>
              <p className='font-bold text-sm sm:text-base md:text-lg text-gray-900 leading-tight'>
                {title}
              </p>
              <p className='font-bold italic text-xs sm:text-sm text-gray-700'>
                {subtitle}
              </p>
            </div>
            <div className='flex justify-end items-center'>
              <Button
                className='bg-brand hover:bg-brand/90 text-white font-semibold px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm'
                onClick={onClaim}
              >
                {buttonText}
              </Button>
            </div>
          </div>
        </CardVoucherRight>
      </CardVoucher>
    </div>
  );
}
