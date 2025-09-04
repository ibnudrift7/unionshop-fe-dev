'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface VoucherBanner2Props {
  title1?: string;
  title2?: string;
  description?: string;
  buttonText?: string;
  image?: string;
  onClaim?: () => void;
}

export default function VoucherBanner2Section({
  title1 = 'Mau Voucher',
  title2 = 'Diskon 10RB?',
  description = 'Gabung & Ambil Vouchernya Sekarang juga!',
  buttonText = 'CLAIM SEKARANG',
  image = '/assets/Voucher.png',
  onClaim,
}: VoucherBanner2Props) {
  return (
    <div className='mx-2 sm:mx-4 mb-4 sm:mb-6 md:mb-8'>
      <Card className='rounded-xl sm:rounded-2xl overflow-hidden border-2 border-gray-200'>
        <CardContent className='p-3 sm:p-4 md:p-6'>
          <div className='flex items-center justify-between mb-3 sm:mb-4 gap-2 sm:gap-3 md:gap-4'>
            <div className='flex-1'>
              <h3 className='text-sm sm:text-lg md:text-xl lg:text-2xl font-bold text-green-600 mb-1 sm:mb-2'>
                {title1}
              </h3>
              <h3 className='text-sm sm:text-lg md:text-xl lg:text-2xl font-bold text-green-600 mb-1 sm:mb-2'>
                {title2}
              </h3>
              <p className='text-xs sm:text-sm md:text-base text-gray-600'>
                {description}
              </p>
            </div>
            <div className='flex justify-end'>
              <div className='relative'>
                <Image
                  src={image}
                  alt='Voucher'
                  width={150}
                  height={150}
                  className='w-12 h-12 sm:w-20 sm:h-20 md:w-28 md:h-28 lg:w-36 lg:h-36 object-contain'
                />
              </div>
            </div>
          </div>

          <Button
            className='w-full bg-brand hover:bg-brand/90 text-white font-semibold py-3 sm:py-4 md:py-6 lg:py-8 rounded-full text-sm sm:text-base md:text-lg'
            onClick={onClaim}
          >
            {buttonText}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
