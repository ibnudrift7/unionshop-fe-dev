'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface Voucher1Props {
  image?: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  onClaim?: () => void;
}

interface Voucher2Props {
  title1?: string;
  title2?: string;
  description?: string;
  buttonText?: string;
  image?: string;
  onClaim?: () => void;
}

export interface VoucherBannersSectionProps {
  voucher1?: Voucher1Props;
  voucher2?: Voucher2Props;
  className?: string;
}

export default function VoucherBannersSection({
  voucher1 = {},
  voucher2 = {},
  className = '',
}: VoucherBannersSectionProps) {
  const v1: Required<Voucher1Props> = {
    image: '/assets/Voucher2.png',
    title: 'Voucher buy 1 get 1 special',
    subtitle: 'UNIONLABS WEBSITE USER.',
    buttonText: 'KLAIM',
    onClaim: undefined,
    ...voucher1,
  } as Required<Voucher1Props>;

  const v2: Required<Voucher2Props> = {
    title1: 'Mau Voucher',
    title2: 'Diskon 10RB?',
    description: 'Gabung & Ambil Vouchernya Sekarang juga!',
    buttonText: 'CLAIM SEKARANG',
    image: '/assets/Voucher.png',
    onClaim: undefined,
    ...voucher2,
  } as Required<Voucher2Props>;

  return (
    <div className={`space-y-4 sm:space-y-6 md:space-y-8 mb-6 ${className}`}>
      <div className='mx-2 sm:mx-4 mb-4 sm:mb-6'>
        <div className='bg-white rounded-2xl overflow-hidden shadow-lg border-2 sm:border-4 md:border-[5px] border-brand'>
          <div className='p-1 sm:p-2 md:p-2 flex items-center gap-3'>
            <div className='flex-shrink-0 flex items-center justify-center'>
              <Image
                src={v1.image}
                alt='Voucher'
                width={96}
                height={96}
                className='w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain'
              />
            </div>

            <div className='flex-1 text-center'>
              <p className='font-bold text-xl sm:text-base md:text-xl text-gray-900 leading-tight'>
                {v1.title}
              </p>
              <p className='font-bold italic text-xl sm:text-sm text-gray-700'>
                {v1.subtitle}
              </p>
            </div>

            <div className='flex-shrink-0'>
              <Button
                className='bg-[#C70122] hover:bg-[#C70122]/90 text-white font-semibold w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center text-xs sm:text-sm md:text-sm'
                aria-label='Klaim Voucher'
                onClick={v1.onClaim}
              >
                {v1.buttonText}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className='mx-2 sm:mx-4 mb-4 sm:mb-6 md:mb-8'>
        <div className='rounded-xl sm:rounded-2xl overflow-hidden border-2 border-gray-200 bg-white'>
          <div className='p-3 sm:p-4 md:p-6'>
            <div className='flex items-center justify-between mb-3 sm:mb-4 gap-2 sm:gap-3 md:gap-4'>
              <div className='flex-1'>
                <h3 className='text-sm sm:text-lg md:text-xl lg:text-2xl font-bold text-green-500 mb-1 sm:mb-2'>
                  {v2.title1}
                </h3>
                <h3 className='text-sm sm:text-lg md:text-xl lg:text-2xl font-bold text-green-500 mb-1 sm:mb-2'>
                  {v2.title2}
                </h3>
                <p className='text-xs sm:text-sm md:text-base text-gray-600'>
                  {v2.description}
                </p>
              </div>
              <div className='flex justify-end'>
                <div className='relative'>
                  <Image
                    src={v2.image}
                    alt='Voucher'
                    width={150}
                    height={150}
                    className='w-12 h-12 sm:w-20 sm:h-20 md:w-28 md:h-28 lg:w-36 lg:h-36 object-contain'
                  />
                </div>
              </div>
            </div>

            <Button
              className='w-full bg-green-500 hover:bg-green-500/90 text-white font-semibold py-2 sm:py-3 md:py-4 rounded-full text-sm sm:text-base md:text-lg'
              onClick={v2.onClaim}
            >
              {v2.buttonText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
