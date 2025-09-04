'use client';

import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import { useRef } from 'react';

interface PromoSectionProps {
  images?: string[];
}

const defaultImages = [
  '/assets/Cashback.png',
  '/assets/Cashback.png',
  '/assets/Cashback.png',
];

export default function PromoSection({
  images = defaultImages,
}: PromoSectionProps) {
  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));

  return (
    <section className='p-4'>
      <Carousel
        plugins={[plugin.current]}
        className='w-full'
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        opts={{
          align: 'start',
          loop: true,
        }}
      >
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <Card className='overflow-hidden h-48 md:h-56 p-0'>
                <CardContent className='p-0'>
                  <div className='relative w-full h-48 md:h-56'>
                    <Image
                      src={image}
                      alt={`Promo Banner ${index + 1}`}
                      fill
                      className='object-cover'
                      sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                    />
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
