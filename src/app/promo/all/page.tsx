'use client';

import * as React from 'react';
import Autoplay from 'embla-carousel-autoplay';
import { useRef, useState } from 'react';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import type { EmblaCarouselType } from 'embla-carousel';
import DiscountOffers from '@/components/sections/promo/DiscountOffers';

export default function LihatSemuaPage() {
  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));
  const banners = [
    '/assets/banner-promo.png',
    '/assets/banner-promo.png',
    '/assets/banner-promo.png',
  ];
  const [carouselApi, setCarouselApi] = useState<EmblaCarouselType | null>(
    null,
  );

  return (
    <div className='min-h-screen bg-gray-50 mx-auto max-w-[550px] border-x border-gray-200'>
      <Carousel
        plugins={[plugin.current]}
        className='relative w-full'
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        opts={{ align: 'start', loop: true }}
        setApi={(api) => setCarouselApi(api ?? null)}
      >
        <button
          type='button'
          className='absolute left-2 top-1/3 -translate-y-1/2 z-10 h-10 w-10 flex items-center justify-center'
          onClick={() => carouselApi?.scrollPrev?.()}
          aria-label='Sebelumnya'
        >
          <Image
            src='/assets/carousel-arrow-l.png'
            alt='Prev'
            width={30}
            height={30}
            className='pointer-events-none'
          />
        </button>

        <CarouselContent>
          {banners.map((src, idx) => (
            <CarouselItem key={idx}>
              <div className='relative w-full aspect-video overflow-hidden max-h-[320px] sm:max-h-[360px] mx-auto'>
                <Image
                  src={src}
                  alt={`Banner ${idx + 1}`}
                  fill
                  sizes='(max-width: 550px) 100vw, 550px'
                  className='object-cover'
                  priority
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <main className='py-6'>
        <DiscountOffers />
      </main>
    </div>
  );
}
