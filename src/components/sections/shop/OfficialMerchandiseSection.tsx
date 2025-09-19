'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface OfficialMerchandiseSectionProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  imageSrc?: string;
  onOrderClick?: () => void;
}

export default function OfficialMerchandiseSection({
  title = 'Official Merchandise',
  subtitle = 'Bisa dikirim langsung ke lokasimu',
  buttonText = 'Order',
  imageSrc = '/assets/OfficialMerch.png',
  onOrderClick,
}: OfficialMerchandiseSectionProps) {
  return (
    <section className='p-4'>
      <Card className='bg-white shadow rounded-3xl py-0'>
        <CardContent className='p-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <div className='flex justify-center'>
              <div className='relative'>
                <div className='w-15 h-15 md:w-18 md:h-18 bg-brand rounded-full flex items-center justify-center'>
                  <Image
                  src={imageSrc}
                  alt='Official Merchandise'
                  width={70}
                  height={70}
                  className='object-contain'
                  />
                </div>
              </div>
            </div>

            <div className='col-span-2 text-start'>
              <h3 className='font-bold text-brand mb-1 text-base md:text-lg leading-snug'>{title}</h3>
              <p className='text-black text-sm font-light'>{subtitle}</p>
            </div>

            <div className='flex justify-center'>
              <Button
                className='bg-brand hover:bg-brand/90 text-sm px-4 py-2'
                onClick={onOrderClick}
              >
                <span className='font-bold text-lg'>{buttonText}</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
